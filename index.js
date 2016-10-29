'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express_handlebars = require('express-handlebars'),
    TrackUsers = require('./routes/trackUsers'),
    Projects = require('./routes/projects'),
    Track = require('./routes/track'),
    models = require('./models'),
    // Load the core build.
    _ = require('lodash/core');

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', express_handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

// list of all the files the need to create for each project

// look at this: https://lodash.com/docs/4.16.2#find

app.get('/',function(req,res){
  res.render('home');
})

const trackUsers = TrackUsers(models);

const track = Track(models);

app.get('/track', track.select);
app.post('/track', track.track);

//app.get('/track/:user_name/:repository_name/contents', trackUsers.specificUserFilePool);

app.get('/track/:user_name/repo/:repository_name/matches', trackUsers.userFileRepoCheck);

const projects = Projects(models);

app.get('/projects', projects.list);
app.get('/projects/add', projects.showAdd);
app.post('/projects/add', projects.add);
app.get('/projects/edit/:project_id', projects.edit);
app.post('/projects/update/:project_id', projects.update);

app.post('/projects/:project_id/add/files', projects.addFiles);
app.get('/projects/:project_id/files/:file_id/delete', projects.deleteFile);

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

app.use(errorHandler);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('Express app started on port ' + port);
}

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/progress_tracker';
  return mongoose.connect(mongoURL, options).connection;
}
