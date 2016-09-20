var express = require('express');
var router = express();
var roundMan = require('../modules/roundman');

/* GET home page. */
router.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        res.render('index', { title: 'Rooms', list: roundMan.list() });
    }
});

module.exports = router;
