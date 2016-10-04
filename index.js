var express = require('express'),
    express_handlebars = require('express-handlebars'),
    github = require('octonode');

const app = express();
const client = github.client();


app.engine('handlebars', express_handlebars({defaultLayout: 'main'}));

app.use(express.static(__dirname + '/public'));

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

var specificUserFilePool = function(username, repoName, cb){
    client
        .get('/repos/' + username + '/' + repoName + '/contents', function(err, results, data){

            var fileNames = data.map(function(entry){
                return entry.name;
            });
            //make sure it's a true async call
            process.nextTick(function(){
                cb(err, fileNames);
            })

            //console.log(fileNames.length);
        });
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
var repofiles = []
var userData = {};

specificUserFilePool('MsEmma', '53functions', function(err, files){
    console.log( 'MsEmma : ' + repofiles.push(files));
    console.log(repofiles);


  for (var i = 0; i < files.length; ++i)
    userData[i] = files[i];
    console.log(userData);
    return userData;
});

specificUserFilePool('avermeulen', '53functions', function(err, files){
    console.log( 'avermeulen : ' + files.length);
});

specificUserFilePool('Oyamasiphula', '53functions', function(err, files){
    console.log('Oyamasiphula : ' + files.length);
});


app.get('/', function(req, res){
	res.render('home');
})
app.get('about',function(req,res){
  res.render('about');

})
// <portSetup>port delcaration
var port = process.env.port || 2000
// </portSetup>

// <serveCodeBlocksRun>Lets configure our localhost server's port
app.listen(port,function(){
console.log('app is listening on' + port);
});
// </serveCodeBlocksRun>
