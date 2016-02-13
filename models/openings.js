/**
 * Created by user on 2/4/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = require('../models/users');

//Schema for the festival activities
var OpeningSchema = new Schema({
    activity_name: String,
    shift: Number,
    shift_time: String,
    max_avail: Number,
    users: []
});

var openingModel = mongoose.model('Opening', OpeningSchema);

module.exports = openingModel;

//exports.schema = OpeningSchema;
//exports.model = Opening;