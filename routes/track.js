const rp = require('request-promise');
const Promise = require('bluebird');

module.exports = function(models){

    const QuizMeURL = process.env.QuizMeURL || 'http://localhost:3007';

    const select = function(req, res, err){
        Promise.join(rp(`${QuizMeURL}/api/usergroups`),
            models.Project.find({}),
            function(userGroups, projects){
                userGroups = JSON.parse(userGroups);
                res.render('track/select', {
                    userGroups,
                    projects
                });
            })
            .catch((err) => next(err));
    };

    const track = function(req, res, next){
        const group_id = req.body.group_id;
        const project_name = req.body.project_name;

        models.Project
            .find({})
            .then((projects) => {

                projects.forEach((p) =>{
                    if (p.repoName === project_name){
                        p.selected = "selected";
                    }
                });

                //
                const membersURL = `${QuizMeURL}/api/usergroups/${group_id}/members`;
                rp(membersURL)
                .then((members) => {

                    members = JSON.parse(members);
                    const candidates = members.map((member) => {
                        return {
                            fullName : member.firstName + " " + member.lastName,
                            username : member.githubUsername,
                            repo : project_name
                        }
                    });
                    res.render('track/track', {
                        candidates,
                        projectName : project_name,
                        projects
                    });
                });
            });

    }

    return {
        track,
        select
    };
}
