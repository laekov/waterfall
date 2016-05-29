var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	barrageId: String,
	text: String,
	time: Number,
});
