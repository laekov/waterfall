var express = require('express');
var router = express();
var roundMan = require('../modules/roundman');
var navList = require('../modules/navlist');

/* GET home page. */
router.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/login');
    } else {
		navList.generate(req.user, function(navList) {
			res.render('index', { 
				title: 'Rooms', 
				list: roundMan.list(),
				navList: navList
			});
		});
    }
});

module.exports = router;
