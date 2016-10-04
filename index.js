var github = require('octonode');

const client = github.client();


var filesForUser = function(username, repoName, cb){
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

filesForUser('MsEmma', '53functions', function(err, files){
    console.log( 'MsEmma : ' + files.length);
});

filesForUser('avermeulen', '53functions', function(err, files){
    console.log( 'avermeulen : ' + files.length);
});

filesForUser('Oyamasiphula', '53functions', function(err, files){
    console.log('Oyamasiphula : ' + files.length);
});
