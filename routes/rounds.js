var express = require('express');
var roundMan = require('../modules/roundman');
var access = require('../modules/access');
var navList = require('../modules/navlist');
var router = express();

router.post('/update/:operation', function(req, res) {
	if (!req.user) {
		return res.redirect('/');
		return res.send({ error: 403, message: 'not logged in' });
	}
	access.has('u_' + req.user.username, 'rounds', function(availible) {
		if (!availible) {
			return res.redirect('/');
			return res.send({ error: 403, message: 'access deined' });
		}
		if (req.body.roundId) {
			if (req.params.operation == 'reg') {
				roundMan.reg(req.body.roundId);
			} else if (req.params.operation == 'dismiss') {
				roundMan.dismiss(req.body.roundId);
			}
			return res.redirect('/rounds/manage');
			return res.send({ });
		} else {
			return res.redirect('/');
			return res.send({ error: 404, message: 'no data' });
		}
	});
});

router.get('/manage', function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'rounds', function(availible) {
        if (!availible) {
            return res.redirect('/login');
        }
		navList.generate(req.user, function(navList) {
			res.render('roundsManage', { 
				title: 'rounds manage', 
				list: roundMan.list(),
				navList: navList
			});
		});
    });
});

module.exports = router;

