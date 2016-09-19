var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	roundId: String,
});

module.exports = mongoose.model('round', schema);
