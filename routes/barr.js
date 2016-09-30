var express = require("express");
var barr = require('../modules/barr');
var toolkit = require('../modules/toolkit');
var access = require('../modules/access');
var roundMan = require('../modules/roundman');
var navList = require('../modules/navlist');
var router = express();

const lifetime = 30000;

router.post("/:roundId/send", function(req, res) {
    if (!req.user) {
        return res.send({ error: 404, message: "not logged in" });
    }
    access.has("u_" + req.user.username, "send", function(availible) {
        if (!availible) {
            return res.send({ error: 403, message: 'access deined' });
        }
        var barrData = {
            barrId: toolkit.md5sum(Date.now() + req.body.text),
            roundId: req.params.roundId,
            text: toolkit.checkString(req.body.text),
            owner: req.user.username,
            time: Date.now(),
            deadline: Date.now() + lifetime
        };
		var roundCheckRes = roundMan.checkSend(barrData.roundId, barrData.owner);
		if (roundCheckRes) {
			return res.send({ error: 403, message: roundCheckRes });
		} else {
			roundMan.commitSend(barrData.roundId, barrData.owner);
		}
        barr.sendBarr(barrData, function(data) {
            res.send(data);
        });
    });
});

router.post("/:roundId/get", function(req, res) {
    if (!req.user) {
        return res.send({ error: 404, message: "not logged in" });
    }
    access.has("u_" + req.user.username, "view", function(accessible) {
        if (!accessible) {
            return res.send({ error: "access deined" });
        }
        var data = new Array();
        var curDate = Date.now();
        var timeLow = Math.floor(curDate / 1000) * 1000;
        if (req.body.timeLow && req.body.timeLow > 0) {
            timeLow = Number(req.body.timeLow);
        }
        var findPattern = {
            time: { $gt: timeLow },
            roundId: req.params.roundId
        };
        barr.getBarr(findPattern, function(data) {
            res.send(data);
        });
    });
});

router.get("/:roundId", function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	roundMan.login(req.params.roundId, req.user.username);
	access.has('u_' + req.user.username, 'view', function(viewable) {
		navList.generate(req.user, function(navList) {
			res.render("barrage", { 
				title: req.params.roundId, 
				roundId: req.params.roundId, 
				needUpdate: viewable,
				navList: navList
			});
		});
	});
});

module.exports = router;

