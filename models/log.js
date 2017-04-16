var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MsgLog = new Schema({
	date: Number,
	text: String,
});
module.exports = mongoose.model('msglog', MsgLog);
