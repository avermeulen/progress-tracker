const github = require('octonode'),
      client = github.client();

var specificUserFilePool = function(ghUserId, repository_name, cb) {
    client
        .get('/repos/' + ghUserId + '/' + repository_name + '/contents', function(err, results, data) {

            var holdFileNames = data.map(function(entry) {
                var holdAllFiles = entry.name;
                return holdAllFiles;
            });
            var numberOfFiles = holdFileNames.length;
            // gather user specifics but without the get user module(Plugin)
            var detailedUserContentObj = {
                ghUserId: ghUserId,
                repository_name: repository_name,
                file_List: holdFileNames,
                fileNo: numberOfFiles
            };
            //make sure it's a true async call
            process.nextTick(function() {
                cb(err, detailedUserContentObj);
            });
        })
};

exports.getUserRepoContent = function(req, res) {
    var ghUserId = req.params.ghUserId;
    var repository_name = req.params.repository_name;

        specificUserFilePool(ghUserId, repository_name, function(err, detailedUserContent) {
            // console.log(detailedUserContent);
            res.render('usersDataPresentation', {
                filesNameResult: detailedUserContent
            })
    });
};
