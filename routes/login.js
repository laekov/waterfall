var express = require('express');
var passport = require('passport');
var access = require('../modules/access');
var Account = require('../models/account');
var navList = require('../modules/navlist');

var router = express();

router.get('/', function(req, res) {
	navList.generate(req.user, function(navList) {
		res.render('login', { 
			title: 'Login',
			navList: navList
		});
	});
});

router.get('/register', function(req, res) {
	navList.generate(req.user, function(navList) {
		res.render('register', { 
			title: 'Register',
			navList: navList
		});
	});
});

router.post('/register', function(req, res) {
	if (req.body.password != req.body.passwordRepeat) {
		return res.redirect('/login/register');
	}
	Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
		if (err) {
			return res.redirect('/login/register');
		}
		passport.authenticate('local')(req, res, function() {
			req.session.save(function(err) {
				if (err) {
					res.send(err);
				}
				access.reg("u_" + req.body.username, function(err) {
					if (err) {
						return res.send(err);
					}
					access.add("u_" + req.body.username, 'send', function(err) {
						if (err) {
						}
					});
					res.redirect('/');
				});
			});
		});
	});
});

router.post('/', passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
	req.session.save(function(err) {
		if (err) {
			return res.send(err);
		}
		res.redirect('/');
	});
});

router.post('/logout', function(req, res) {
	req.logout();
	req.session.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.redirect('/login');
	});
});
router.get('/logout', function(req, res) {
	req.logout();
	req.session.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.redirect('/login');
	});
});

router.get('/resetpassword', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	navList.generate(req.user, function(navList) {
		res.render('resetpassword', {
			title: 'Reset password',
			navList: navList
		})
	});
});
router.post('/resetpassword', function(req, res) {
	if (req.body.newpassword != req.body.newpasswordRepeat) {
		return res.redirect('/login/resetpassword');
	}
	if (!req.user) {
		return res.redirect('/login');
	}
	Account.findOne({ username: req.user.username }, function(err, doc) {
		if (err || !doc) {
			return res.redirect('/');
		}
		doc.setPassword(req.body.newpassword, function(err) {
			doc.save();
			if (err) {
				return res.redirect('/login/resetpassword');
			}
			return res.redirect('/');
		});	
	});
});

module.exports = router;

