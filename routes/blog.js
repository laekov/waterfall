var express = require('express');
var access = require('../modules/access');
var navList = require('../modules/navlist');
var Blog = require('../models/blog');
var app = express();
 
app.get('/edit', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'blog', function(availible) {
		if (!availible) {
			return res.redirect('/');
		}
		navList.generate(req.user, function(navList) {
			res.render('blogedit', {
				title: 'Edit blog',
				navList: navList
			});
		});
	});
});

app.post('/edit/get', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'blog', function(availible) {
		if (!availible) {
			return res.send({ error: 403, message: 'Access deined'});
		}
		Blog.findOne({ postId: req.body.postId }, function(err, doc) {
			if (err || !doc) {
				return res.send({});
			}
			res.send({ content: doc.content });
		});
	});
});

app.post('/edit/post', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'blog', function(availible) {
		if (!availible) {
			return res.send({ error: 403, message: 'Access deined'});
		}
		Blog.update({ postId: req.body.postId }, { 
			$set: {
				postId: req.body.postId,
				author: req.user.username, 
				content: req.body.content
			}
		}, {
			upsert: true
		}, function(err) {
			res.send(err);
		});
	});
});


module.exports = app;
