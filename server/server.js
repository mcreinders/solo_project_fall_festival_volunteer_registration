/**
 * Created by user on 2/2/16.
 */
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var index = require('./routes/index');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/users');
var Opening = require('../models/openings');

var app = express();
var localStrategy = require('passport-local').Strategy;

app.use(express.static('server/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

//set up Mongo//
var mongoURI = 'mongodb://localhost:27017/fall_festival_volunteers';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
    console.log('MongoDB error: ', err);
});

MongoDB.on('open', function(){
    console.log('MongoDB connected!');
});
////////////////

//Passport Things//
passport.serializeUser(function(user, done){
    //Place ID on session, so we can get user back
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    //Go get User object to put on req.user
    User.findById(id, function(err, user){
        if(err){
            done(err);
        }
        done(null, user); //req.user
    })
});

passport.use('local', new localStrategy({passReqToCallback:true, usernameField: 'username'},
    function(req, username, password, done){

        //checking the password
        User.findOne({username: username}, function(err, user){
            if(err){
                console.log(err);
            }
            if(!user){
                return done(null, false);
            }

            //calls the UserSchema.methods.comparePassword in users.js
            user.comparePassword(password, function(err, isMatch){
                if(err){
                    console.log(err);
                }
                if(isMatch){
                    done(null, user); //success
                } else {
                    done(null, false); //fail
                }
            })
        })
    }));
//////////////////////////


var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Listening at port: ', port);
});