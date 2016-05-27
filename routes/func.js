var express = require("express");
var router = express();

var curText = new Array();

router.post("/send", function(req, res) {
	var curDate = (new Date()).getTime();
	curText.push({ 
		text: req.body.text,
		time: curDate
	});
	console.log("Received: " + req.body.text);
	res.send({ error: 0, time: curDate });
});

router.post("/get", function(req, res) {
	var data = new Array();
	var curDate = (new Date()).getTime();
	var timeLow = Math.floor(curDate / 1000) * 1000;
	if (req.body.timeLow) {
		timeLow = Number(req.body.timeLow);
	}
	for (var i = curText.length - 1; i >= 0 && curText[i].time > timeLow; -- i) {
		data.push(curText[i]);
	}
	res.send({data: data});
});

module.exports = router;

