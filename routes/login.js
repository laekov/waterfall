var express = require('express');
var passport = require('passport');
var access = require('../modules/access');
var Account = require('../models/account');

var router = express();

router.get('/', function(req, res) {
    res.render('login', { title: 'waterfall - login' });
});

router.get('/register', function(req, res) {
    res.render('register', { title: 'waterfall - register' });
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

module.exports = router;
