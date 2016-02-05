/**
 * Created by user on 2/2/16.
 */
var express = require('express');
var path = require('path');
var User = require('../../models/users');
var Opening = require('../../models/openings');
var passport = require('passport');

var router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, "../public/views/index.html"));
});

//creates the new user
router.post('/registerNewUser', function(request, response, next){
    User.create(request.body, function(err, post){
        if(err) {
        //checks if username already exists
            response.send('duplicate username');
        } else {
            //response.sendStatus(200);
            response.send('success');
        }
    });
});

//if returning user sign in successful
router.get('/success', function(request, response) {
    //response.sendStatus(200);
    response.send('success');
});

//if returning user sign in fails
router.get('/failure', function(request, response) {
    //response.sendStatus(401);
    response.send('failure');
});

//authenticates returning user
router.post('/signIn', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));

//pull user info from Mongo by username
router.post('/getUserInfo', function(request, response){
    var user = request.body.username;
    User.findOne({username: user}).exec(function(err, results){
        if(err){
            console.log(err)
        }else {
            response.send(results);
        }
    })
});

//get volunteer openings
router.get('/getOpenings', function(request, response) {

    Opening.find({}).exec(function(err, activities){
        if(err){
            console.log(err)
        } else{
            response.send(activities);
            //response.send(JSON.stringify(activities));
        }
    })
});

module.exports = router;