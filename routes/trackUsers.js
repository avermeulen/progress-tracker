const github = require('octonode'),
    // Load the full build.
    _ = require('lodash'),
    // Load git user content
    client = github.client();

module.exports = function(models) {

    const specificUserFilePool = function(user_name, repository_name, cb) {
        client
            .get('/repos/' + user_name + '/' + repository_name + '/contents', function(err, results, data) {

                // The app crashes when it reaches this part
                // if (data === "undefined") {
                //   console.log('Fix me , and make it clear that you"ve fixed me on github')
                //   }

                var fileNames = data.map(function(entry) {
                    var holdAllFiles = entry.name;
                    // holdAllFiles
                    return holdAllFiles;
                });
                var numberOfFiles = fileNames.length;
                // gather user specifics but without the get user module(Plugin)
                var detailedUserContentObj = {
                    user_name: user_name,
                    repository_name: repository_name,
                    file_List: fileNames,
                    fileNo: numberOfFiles
                };
                //make sure it's a true async call
                process.nextTick(function() {
                    cb(err, detailedUserContentObj);
                });
            })
    };
    exports.getUserRepoContent = function(req, res) {
        var user_name = req.params.user_name;
        var repository_name = req.params.repository_name;

        specificUserFilePool(user_name, repository_name, function(err, detailedUserContent) {
            var files = detailedUserContent.file_List;

            res.render('usersDataPresentation', {
                filesNameResult: detailedUserContent
            })
        });
    };

    const userFileRepoCheck = function(req, res, next) {
        var user_name = req.params.user_name;
        var repository_name = req.params.repository_name;

        specificUserFilePool(user_name, repository_name, function(err, detailedUserContent) {
            var files = detailedUserContent.file_List;

            models.Project
                .findOne({projectName : repository_name})
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
                    // console.log(details);
                    res.render('checkedFilesFeeds', {
                        userFeed: details
                    });
                })
                .catch((err) => next(err));
        });
    };

    return {
        userFileRepoCheck,
        specificUserFilePool
    };

}
