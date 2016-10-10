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

            function arr_diff(userFiles, expectedUserFiles) {

                var existingFiles = [],
                    diff = [];

                for (var i = 0; i < userFiles.length; i++) {
                    existingFiles[userFiles[i]] = true;
                }

                for (var i = 0; i < expectedUserFiles.length; i++) {
                    if (existingFiles[expectedUserFiles[i]]) {
                        delete existingFiles[expectedUserFiles[i]];
                    } else {
                        existingFiles[expectedUserFiles[i]] = true;
                    }
                }

                for (var k in existingFiles) {
                    diff.push(k);
                }
                console.log(diff)
                return diff;
            };

            arr_diff();
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
        function arr_diff(userFiles, expectedUserFiles) {

            var existingFiles = [],trackDiff = [];

            for (var i = 0; i < userFiles.length; i++) {
                existingFiles[userFiles[i]] = true;
            };
            for (var i = 0; i < expectedUserFiles.length; i++) {
                if (existingFiles[expectedUserFiles[i]]) {
                    delete existingFiles[expectedUserFiles[i]];
                } else {
                    existingFiles[expectedUserFiles[i]] = true;
                }
            };
            for (var file_names in existingFiles) {
                trackDiff.push(file_names);
            }
            console.log(trackDiff);
            return trackDiff;
        };
        // console.log(detailedUserContent);
        res.render('usersDataPresentation', {
            filesNameResult: detailedUserContent
        })
    });
};
