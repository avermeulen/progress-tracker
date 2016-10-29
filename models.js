var mongoose = require('mongoose');
mongoose.Promise = Promise;

const Project = mongoose.model('Project', {
        projectName: String,
        repoName: String,
        files : [{name : String}]});

module.exports = {
    Project
}
