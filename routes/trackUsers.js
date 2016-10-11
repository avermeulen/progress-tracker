const github = require('octonode'),
      // Load the full build.
    _ = require('lodash'),
    // Load git user content
    client = github.client();

var specificUserFilePool = function(user_name, repository_name, cb) {
    client
        .get('/repos/' + user_name + '/' + repository_name + '/contents', function(err, results, data) {
            // var handleRequest = function(req, res) {
            //     try {
            //       res.writeHead(200);
            //       res1.end('Hello, World!\n');
            //     } catch(e) {
            //       res.writeHead(200);
            //       res.end('Boo');
            //     }
            // };
            // var server = require('http').createServer(handleRequest);
            // process.on('uncaughtException', function(ex) {
            //           console.log('Something went wrong')
            //     // do something with exception
            // });

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
        var files = detailedUserContent.file_List

        res.render('usersDataPresentation', {
            filesNameResult: detailedUserContent
        })
    });
};

exports.userFileRepoCheck = function(req, res) {
    var user_name = req.params.user_name;
    var repository_name = req.params.repository_name;

    specificUserFilePool(user_name, repository_name, function(err, detailedUserContent) {
        var files = detailedUserContent.file_List;
        var fileList = [];

        var getUserFileNames = files.map(function(file) {
            fileList.push(userFileNames = {
                file_name: file
            })
            return fileList;
        });
        var checkIfFile1Exist = _.some(getUserFileNames, { file_name: 'package.json' });

        console.log(checkIfFile1Exist);
        return getUserFileNames;
    });
};
