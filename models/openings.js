/**
 * Created by user on 2/4/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema for the festival activities
var OpeningSchema = new Schema({
    activity_name: {type: String, required: true},
    shift: Number,
    shift_time: {type: String, required: true},
    max_avail: {type: Number, required: true},
    users: []
});

var openingModel = mongoose.model('Opening', OpeningSchema);

module.exports = openingModel;
