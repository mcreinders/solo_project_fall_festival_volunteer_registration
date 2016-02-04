/**
 * Created by user on 2/3/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//Schema for the volunteers
var UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    contact_method: String,
    username: {type: String, required: true, index: {unique:true}},
    password: {type: String, required: true},
    coordinator: Boolean,
    reminder: Boolean
});

//encrypt volunteers password
UserSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;

            next();
        })

    });
});

//password verification
UserSchema.methods.comparePassword = function(submittedPassword, callBack){
    bcrypt.compare(submittedPassword, this.password, function(err, isMatch){
        if(err) {
            return callBack(err);
        }
        callBack(null, isMatch);
    })
};

var userModel = mongoose.model('User', UserSchema);

module.exports = userModel;

