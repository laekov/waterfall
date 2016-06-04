var express = require("express");
var Barr = require('../modules/db/barrage');
var toolkit = require('../modules/toolkit');
var router = express();

var nSaveTime = 10000;
var nLastClean = 0;

function cleanBarr() {
	var cTime = Date.now();
	if (cTime > nLastClean + nSaveTime) {
		nLastClean = cTime;
		Barr.remove({ $lt: { time: cTime - nSaveTime } }, function(err) {
		});
	}
}

cleanBarr();

router.post("/send", function(req, res) {
	cleanBarr();
	var barrData = {
		barrId: toolkit.md5sum(Date.now() + req.body.text),
		roundId: req.body.roundId ? req.body.roundId : 'defaultRound',
		text: req.body.text,
		owner: req.body.owner,
		time: Date.now()
	};
	if (barrData.text.length < 2 || barrData.text.length > 64) {
		res.send({ error: 403, message: 'Invalid text'});
	}
	else {
		//console.log("Received: " + req.body.text);
		var barr = new Barr(barrData);
		barr.save(function(err) {
			res.send({ error: err, time: barrData.time });
		});
	}
});

router.post("/get", function(req, res) {
	cleanBarr();
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
		}
		else {
			res.send({ data: doc });
		}
	});
});

module.exports = router;

