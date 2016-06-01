/**
 * Created by rasmus on 4/23/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatLogSchema = new Schema({
    username: String,
    message: String,
    postedAt: Date
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);