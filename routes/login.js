const GithubAuth = require('../gh-auth');
const rp = require('request-promise');

module.exports = function() {
    const QuizMeURL = process.env.QuizMeURL || 'http://localhost:3000';

    function authCallback(err, response, ctx) {
        if (response.body.login) {
            const username = response.body.login;
            rp(`${QuizMeURL}/api/users/${username}`)
                .then((user) => {
                    user = JSON.parse(user);
                    if (user.active && user.active === true) {
                        ctx.req.session.username = user.githubUsername;
                        ctx.res.redirect('/');
                    } else {
                        ctx.res.redirect('/login');
                    }
                });
        }
    }

    const ghAuth = GithubAuth({
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        authCallback
    });

    const show = (req, res) => res.render('login/login');

    const logout = (req, res) => {
        req.session.destroy(function(){
            res.redirect('/login');
        });
    };

    const login = (req, res) => {
        ghAuth.redirectToGithub(req, res);
    };

    return {
        show,
        login,
        logout,
        callback: ghAuth.callback
    }

}
