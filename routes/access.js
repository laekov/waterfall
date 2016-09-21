var express = require('express');
var access = require('../modules/access');
var navList = require('../modules/navlist');
var router = express();

router.get('/manage', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	navList.generate(req.user, function(navList) {
		res.render('accessManage', {
			title: 'Access manager',
			navList: navList
		});
	});
});

router.post('/update/:operate', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'access', function(availible) {
		if (!availible) {
			return res.redirect('/');
		}
		if (req.params.operate == 'add') {
			access.add('u_' + req.body.username, req.body.accesstag, function(err) { 
				return res.redirect('/access/manage'); 
			});
		} else if (req.params.operate == 'remove') {
			access.remove('u_' + req.body.username, req.body.accesstag, function(err) { 
				return res.redirect('/access/manage'); 
			});
		} else if (req.params.operate == 'view') {
			access.getDoc('u_' + req.body.username, function(doc) {
				if (doc) {
					return res.send(doc.list);
				} else {
					return res.send({ error: 404, message: "No such user" });
				}
			});
		} else {
			res.redirect('/access/manage');
		}
	});
});

module.exports = router;
