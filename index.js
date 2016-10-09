var express = require('express'),
    express_handlebars = require('express-handlebars'),
    github = require('octonode'),
    // Load the full build.
    _ = require('lodash'),
    // Load the core build.
    _ = require('lodash/core'),
    // Load the FP build for immutable auto-curried iteratee-first data-last methods.
    fp = require('lodash/fp'),
    // Load method categories.
    array = require('lodash/array'),
    object = require('lodash/fp/object');

const app = express(),
    client = github.client();


app.engine('handlebars', express_handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


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
// list of bootcamp users github accounts
//SinethembaDlova

// the project name
//function_intro

// list of all the files the need to create for each project

// look at this: https://lodash.com/docs/4.16.2#find

/*
var_const.js
variables.js
dynamically_typed.js
type_errors.js
empty_variables.js
*/

app.get('/repos/:ghUserId/:repository_name/contents', function(req, res) {
    var ghUserId = req.params.ghUserId;
    var repository_name = req.params.repository_name;
    specificUserFilePool(ghUserId, repository_name, function(err, detailedUserContent) {
        console.log(detailedUserContent);
        res.render('usersDataPresentation', {
            filesNameResult: detailedUserContent
        })
    });
});


// <portSetup>port delcaration
var port = process.env.port || 2001
    // </portSetup>

// <serveCodeBlocksRun>Lets configure our localhost server's port
app.listen(port, function() {
    console.log('app is listening on' + port);
});
// </serveCodeBlocksRun>
