var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	roundId: String,
	barrId: String,
	text: String,
	time: Number,
});

module.exports = mongoose.model('barrage', schema);