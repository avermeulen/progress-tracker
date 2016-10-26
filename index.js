var express = require('express'),
    express_handlebars = require('express-handlebars'),
    userContentUtil = require('./routes/trackUsers'),
    // Load the core build.
    _ = require('lodash/core');

const app = express();

app.engine('handlebars', express_handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

// list of all the files the need to create for each project

// look at this: https://lodash.com/docs/4.16.2#find

/*
var_const.js
variables.js
dynamically_typed.js
type_errors.js
empty_variables.js
*/

app.get('/',function(req,res){
  res.render('home');
})
app.get('/track/:user_name/:repository_name/contents', userContentUtil.getUserRepoContent);
app.get('/track/:user_name/repo/:repository_name/matches', userContentUtil.userFileRepoCheck);

// <portSetup>port delcaration
var port = process.env.port || 2001
    // </portSetup>

// <serveCodeBlocksRun>Lets configure our localhost server's port
app.listen(port, function() {
    console.log('app is listening on ' + port);
});
// </serveCodeBlocksRun>
