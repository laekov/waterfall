var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	postId: String, 
	author: String,
	content: String,
});

module.exports = mongoose.model('blog', schema);

