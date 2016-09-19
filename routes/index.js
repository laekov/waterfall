var express = require('express');
var router = express();

/* GET home page. */
router.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        res.render('index', { title: 'waterfall' });
    }
});

module.exports = router;
