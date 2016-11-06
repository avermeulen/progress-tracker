const rp = require('request-promise');
const Promise = require('bluebird');

module.exports = function(models) {

    const QuizMeURL = process.env.QuizMeURL || 'http://localhost:3007';

    const select = function(req, res, err) {

        Promise.join(rp(`${QuizMeURL}/api/usergroups`),
                models.Project.find({}),
                function(userGroups, projects) {
                    userGroups = JSON.parse(userGroups);
                    res.render('track/select', {
                        userGroups,
                        projects
                    });
                })
            .catch((err) => next(err));
    };

    const track = function(req, res, next) {
        const groupId = req.body.groupId;
        const repoName = req.body.repoName;

        Promise.join(
                rp(`${QuizMeURL}/api/usergroups`),
                models.Project.find({}),
                getGroupMembers(groupId),
                function(userGroups, projects, candidates) {
                    if (repoName) {
                        projects.forEach((p) => {
                            if (p.repoName === repoName) {
                                p.selected = "selected";
                            }
                        });
                    }

                    userGroups = JSON.parse(userGroups);
                    if (groupId){
                        userGroups.forEach((ug) => {
                            if (ug._id === groupId){
                                ug.selected = "selected";
                            }
                        })
                    }


                    res.render('track/track', {
                        userGroups,
                        projects,
                        candidates
                    });
                });

    };

    function getGroupMembers(group_id){
        if (!group_id){
            return Promise.resolve([]);
        }
        const membersURL = `${QuizMeURL}/api/usergroups/${group_id}/members`;

        return rp(membersURL)
        .then((members) => {
            members = JSON.parse(members);
            //
            return members.map((member) => {
                return {
                    fullName : `${member.firstName} ${member.lastName}`,
                    username : member.githubUsername
                };
            });
        });
    };




    return {
        track,
        select
    };
}
