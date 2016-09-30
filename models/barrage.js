var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	roundId: String,
	barrId: String,
	owner: String,
	text: String,
	time: Number,
    deadline: Number,
});

module.exports = mongoose.model('barrage', schema);
