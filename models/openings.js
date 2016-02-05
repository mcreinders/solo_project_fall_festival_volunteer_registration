/**
 * Created by user on 2/4/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/users');

//Schema for the festival activities
var OpeningSchema = new Schema({
    activity_name: String,
    begin_time: Date,
    end_time: Date,
    max_avail: Number,
    users: [User]
});

var openingModel = mongoose.model('Opening', OpeningSchema);

module.exports = openingModel;