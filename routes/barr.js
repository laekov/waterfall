var express = require("express");
var Barr = require('../models/barrage');
var Ban = require('../models/ban');
var toolkit = require('../modules/toolkit');
var access = require('../modules/access');
var roundMan = require('../modules/roundman');
var router = express();

var nSaveTime = 10000;
var nLastClean = 0;

function cleanBarr() {
	var cTime = Date.now();
	if (cTime > nLastClean + nSaveTime) {
		nLastClean = cTime;
		Barr.remove({ time: { $lt: cTime - nSaveTime } }, function(err) {
			if (err) {
				//console.log(err);
			}
		});
	}
}

function checkString(x) {
	while (x.match("<")) {
		x = x.replace("<", "&lt;");
	}
	return x;
}

router.post("/:roundId/send", function(req, res) {
    if (!req.user) {
        return res.send({ error: 404, message: "not logged in" });
    }
    access.has("u_" + req.user.username, "send", function(availible) {
        if (!availible) {
            return res.send({ error: 403, message: 'access deined' });
        }
        cleanBarr();
        var barrData = {
            barrId: toolkit.md5sum(Date.now() + req.body.text),
            roundId: req.params.roundId,
            text: checkString(req.body.text),
            owner: req.user.username,
            time: Date.now()
        };
		var roundCheckRes = roundMan.checkSend(barrData.roundId, barrData.owner);
		if (roundCheckRes) {
			return res.send({ error: 403, message: roundCheckRes });
		} else {
			roundMan.commitSend(barrData.roundId, barrData.owner);
		}
        var banPattern = {
            $or: [ { owner: barrData.owner } ],
        };
        Ban.find(banPattern, function(err, doc) {
            if (doc.length) {
                res.send({ error: 403, message: "You are not allowed to speak" });
            } else {
                if (barrData.text.length < 2 || barrData.text.length > 64) {
                    res.send({ error: 403, message: 'Invalid text'});
                }
                else {
                    var barr = new Barr(barrData);
                    barr.save(function(err) {
                        res.send({ error: err, time: barrData.time });
                    });
                }
            }
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
        Barr.find(findPattern, function(err, doc) {
            if (err) {
                res.send({error: err});
            } else {
                res.send({ data: doc });
            }
        });
    });
});

router.get("/:roundId", function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	roundMan.login(req.params.roundId, req.user.username);
	access.has('u_' + req.user.username, 'view', function(viewable) {
		res.render("barrage", { 
            title: req.params.roundId, 
            roundId: req.params.roundId, 
            needUpdate: viewable 
        });
	});
});

module.exports = router;

