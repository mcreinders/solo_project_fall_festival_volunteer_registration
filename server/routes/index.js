/**
 * Created by user on 2/2/16.
 */
var express = require('express');
var path = require('path');
var User = require('../../models/users');
var passport = require('passport');

var router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, "../public/views/index.html"));
});

router.post('/registerNewUser', function(request, response, next){
    User.create(request.body, function(err, post){
        if(err) {
            next(err);
        } else {
            response.sendStatus(200);
        }
    });
});

router.get('/success', function(request, response) {
    //response.sendStatus(200);
    response.send('success');
});

router.get('/failure', function(request, response) {
    //response.sendStatus(401);
    response.send('failure');
});

router.post('/signIn', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));

module.exports = router;