const github = require('octonode'),
    // Load the full build.
    _ = require('lodash'),
    // Load git user content
    ghClient = github.client();

module.exports = function(models) {

    const filesInGithubRepoForUser = function(user_name, repository_name, cb) {
        ghClient
            .get('/repos/' + user_name + '/' + repository_name + '/contents', function(err, results, data) {

                const fileNames = data ? data.map((entry) =>
                    entry.name) : [];

                // gather user specifics but without the get user module(Plugin)
                const detailedUserContentObj = {
                    user_name : user_name,
                    repository_name : repository_name,
                    files : fileNames,
                    fileCount : fileNames.length
                };

                //make sure it's a true async call
                process.nextTick(function() {
                    cb(err, detailedUserContentObj);
                });
            })
    };

    // exports.getUserRepoContent = function(req, res) {
    //     var user_name = req.params.user_name;
    //     var repository_name = req.params.repository_name;
    //
    //     filesInGithubRepoForUser(user_name, repository_name, function(err, detailedUserContent) {
    //         var files = detailedUserContent.files;
    //
    //         res.render('usersDataPresentation', {
    //             filesNameResult: detailedUserContent
    //         })
    //     });
    // };

    const userFileRepoCheck = function(req, res, next) {
        var user_name = req.params.user_name;
        var repository_name = req.params.repository_name;

        filesInGithubRepoForUser(user_name, repository_name, function(err, detailedUserContent) {

            var files = detailedUserContent.files;

            models.Project
                .findOne({repoName : repository_name})
                .then(function(project){
                    const expectedFiles = project.files.map(file => file.name);

                    var fileList = expectedFiles.map(function(expectedFile) {
                        return {
                            file_name: expectedFile,
                            exist: _.includes(files, expectedFile)
                        };
                    });

                    var details = {
                        username: user_name,
                        repo: repository_name,
                        files: fileList
                    };

                    res.render('userRepoOverview', {
                        user : details,
                        layout : false
                    });

                })
                .catch((err) => next(err));
        });
    };

    return {
        userFileRepoCheck
    };

}
