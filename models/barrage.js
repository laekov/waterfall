var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	roundId: String,
	barrId: String,
	sessionId: String,
	owner: String,
	text: String,
	time: Number,
});

module.exports = mongoose.model('barrage', schema);