var Blog = require('../models/blog');

const defBlogList = {
	ls: 'bulletin',
	bulletin: 'bulletin',
	help: 'help',
	version: 'version',
	man: 'help_',
};

var own = function(cmdl) {
	if (cmdl == 'cat' || defBlogList[cmdl]) {
		return true;
	} else {
		return false;
	}
}

var readBlog = function(req, cmd, callback) {
	var blogTitle = defBlogList[cmd[0]];
	if (cmd[0] == 'cat' && !cmd[1]) {
		return callback('Argument error');
	} else if (cmd[0] == 'man') {
		blogTitle = 'help_' + cmd[1];
	} else if (cmd[0] == 'cat') {
		blogTitle = cmd[1];
	}
	Blog.findOne({ postId: blogTitle }, function(err, doc) {
		if (err || !doc) {
			return callback('No such blog');
		} else {
			return callback(doc.content);
		}
	});
}

module.exports.own = own;
module.exports.deal = readBlog;

