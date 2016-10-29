const superagent = require('superagent');

module.exports = function(params){

    const CLIENT_ID =  params.CLIENT_ID;
    const CLIENT_SECRET =  params.CLIENT_SECRET;

    //process.env.CLIENT_ID || 'd48293f543a760af1132';
    //process.env.CLIENT_SECRET || "fa2a4abd4214dfce6f0ec2fb4334cf52a6ae2232";

    var redirectToGithub =  function(req, res){
        res.redirect("https://github.com/login/oauth/authorize?scope=user:email&client_id=" + CLIENT_ID);
    };

    var callback = function(req, res){
        superagent
          .post('https://github.com/login/oauth/access_token')
          .send({
                  client_id : CLIENT_ID,
                  client_secret : CLIENT_SECRET,
                  code : req.query.code
          })
          .set('Accept', 'application/json')
          .end(function(err, response){
            // Calling the end function will send the request
            if (err){
                return res.send(err);
            }

            superagent
                .get('https://api.github.com/user?access_token=' + response.body.access_token)
                .end((err, response) => {
                    params.authCallback(err, response, {req, res});
                });
          });
    };

    return {
        redirectToGithub : redirectToGithub,
        callback : callback
    }
};
