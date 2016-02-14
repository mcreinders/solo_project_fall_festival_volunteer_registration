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

//add a volunteers id to the users array of the openings document
//adds the openings document to the volunteer
router.post('/addVolunteer', function(request, response) {

    Opening.findById(request.body.id, function (err, openings) {

        if(err){
            console.log('Error finding opening', err);
        } else {
            //find the user and push the openings document to the volunteer
            User.findById(request.user.id, function(err, users){
                if(err){
                    console.log(err)
                }else {
                    users.activities.push(openings);

                    users.save(function(err){
                        if(err){
                            console.log('error saving user', err);
                        }
                    });
                }
            });
            //push the volunteers id to the openings document
            openings.users.push(request.user.id);

            openings.save(function (err) {
                if (err) {
                    console.log('error saving opening', err);
                }
            });
            //response.sendStatus(200);
            response.send('success');
        }
    });
});

//get user for list of volunteer activities they have signed up for
router.get('/getSignedUpFor', function(request, response){

    User.findById(request.user.id, function(err, results){
        if(err){
            console.log(err)
        }else {
            response.send(results);
        }
    })
});

//get user for list of volunteer activities they have signed up for
router.get('/getAllUsers', function(request, response){

    User.find({}).exec(function(err, users){
        if(err){
            console.log(err)
        }else {
            response.send(users);
        }
    })
});

//remove the openings document from the volunteer
//when they remove an activity
router.post('/removeActivity', function(request, response) {

    //request.body.id is the id of the activity to remove
    var activityId = request.body.id;

    //find the user that's logged in
    User.findById(request.user.id, function (err, user) {

        if(err){
            console.log('Error finding user', err);
        } else {
            //find the activity and remove it
            var activityFound = user.activities.id(activityId).remove();

            user.save(function(err){
                if(err){
                    console.log('error saving user', err);
                }
            });
        }
    });

     //find the opening so I can remove the user id from the openings users array
    Opening.findById(activityId, function (err, openings) {

        if (err) {
            console.log('Error finding opening', err);
        } else {
            //users array
            var openingFound = openings.users;

            var openingFoundLength = openingFound.length;
            //if user signed up for same opening multiple times, remove all of them
            for(var i=0; i<openingFoundLength; i++){
                //position in array of user
                var index = openingFound.indexOf(request.user.id);
                //remove the user from the array
                openingFound.splice(index, 1);
            }

            openings.save(function (err) {
                if (err) {
                    console.log('error saving openings', err);
                }
            });
        }
    });

    //response.sendStatus(200);
    response.send('success');

});

//route for coordinator to add a new activity
router.post('/addActivity', function(request, response, next){
    Opening.create(request.body, function(err, post){
        if(err) {
            //checks if opening already exists
            response.send('failure');
        } else {
            response.send('success');
        }
    });
});


router.get('/logout', function(request, response){
    request.logout();
    response.send('logged_out');
});

module.exports = router;


