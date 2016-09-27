var express = require("express");
var Barr = require('../models/barrage');
var Ban = require('../models/ban');
var Blog = require('../models/blog');
var xml = require('xml');
var toolkit = require('../modules/toolkit');
var access = require('../modules/access');
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

cleanBarr();

function checkString(x) {
	while (x.match("<")) {
		x = x.replace("<", "&lt;");
	}
	return x;
}

router.post("/send", function(req, res) {
    if (!req.user) {
        return res.send({ error: 404, message: "not logged in" });
    }
    access.has("u_" + req.user.username, "send", function(availible) {
        if (!availible) {
            return res.send({ error: 403, message: 'access deined' });
        }
        cleanBarr();
        var sessionId = req.sessionID;
        var barrData = {
            barrId: toolkit.md5sum(Date.now() + req.body.text),
            roundId: req.body.roundId ? req.body.roundId : 'defaultRound',
            sessionId: sessionId,
            text: checkString(req.body.text),
            owner: req.user.username,
            time: Date.now()
        };
        var banPattern = {
            $or: [ { sessionId: sessionId }, { owner: barrData.owner } ],
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

router.post("/get", function(req, res) {
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
            roundId: req.body.roundId ? req.body.roundId : 'defaultRound'
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

var adminKey = 'zhzhxxx';
router.post("/addBan", function(req, res) {
    var key = req.body.adminKey;
    if (key != adminKey) {
        res.send({ error: 403, message: "wrong key" });
    } else {
        if (req.body.sessionId || req.body.owner) {
            var data = { 
                owner: req.body.owner, 
                sessionId: req.body.sessionId,
            };
            if (!data.owner) {
                data.owner = "unknown";
            }
            if (!data.sessionId) {
                data.sessionId = "unknown";
            }
            var ban = new Ban(data);
            ban.save(function(err) {
                res.send({ error: err });
            });
        } else {
            res.send({ error: 404, message: "illegal data" });
        }
    }
});

function xmlRenderRes(req, res, content) {
	var xmlStr = xml({
		xml: [
			{ ToUserName: req.body.xml.fromusername[0] },
			{ FromUserName: req.body.xml.tousername[0] },
			{ CreateTime: Date.now() },
			{ MsgType: 'text' },
			{ Content: content }
		]
	});
	return res.send(xmlStr);
}
const defBlogList = {
	ls: 'bulletin',
	bulletin: 'bulletin',
	help: 'help',
	version: 'version',
};
router.post('/wechat/get', function(req, res) {
	var cmd = req.body.xml.content[0].split(' ');
	if (cmd[0] == 'vi' || defBlogList[cmd[0]]) {
		var blogTitle = defBlogList[cmd[0]];
		if (cmd[0] == 'vi' && !cmd[1]) {
			return xmlRenderRes(req, res, 'Argument error');
		} else if (cmd[0] == 'vi') {
			blogTitle = cmd[1];
		}
		Blog.findOne({ postId: blogTitle }, function(err, doc) {
			if (err || !doc) {
				return xmlRenderRes(req, res, 'No such blog');
			} else {
				return xmlRenderRes(req, res, doc.content);
			}
		});
	} else {
		return xmlRenderRes(req, res, 'Function not supported yet');
	}
});
router.get('/wechat/get', function(req, res) {
	res.send(req.query.echostr);
});

module.exports = router;

