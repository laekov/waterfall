var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	owner: String,
	sessionId: String,
});

module.exports = mongoose.model('ban', schema);
