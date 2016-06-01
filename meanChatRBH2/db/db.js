/**
 * Created by rasmus on 4/23/16.
 */
var mongoose = require('mongoose');

var connection = mongoose.connect('mongodb://localhost:27017/test', function(err){
    if(err){
        console.log("Failed to connect to db! ----- " + err);
    } else {
        console.log("Connected to db!");

    }
});

exports.connection = connection;