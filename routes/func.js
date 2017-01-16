var express = require("express");
var xml = require('xml');
var toolkit = require('../modules/toolkit');
var access = require('../modules/access');
var router = express();
var barr = require('../modules/barr');
var MsgLog = require('../models/log.js');
var cmdList = [
	require('../modules/blog'),
	require('../modules/dash'),
	require('../modules/refer'),
	require('../modules/lrinv'),
	require('../modules/oldhl'),
];

router.get('/wechat/list', function(req, res) {
	MsgLog.find({}, function(err, doc) {
		if (err) {
			return res.send('error');
		} else {
			res.render('msglist', {
				title: 'wechat msg',
				data: doc.reverse()
			});
		}
	});
});

router.post('/wechat/get', function(req, res) {
	var cmd = req.body.xml.content[0].split(' ');
	for (var i in cmdList) {
		if (cmdList[i].own(cmd[0])) {
			return cmdList[i].deal(req, cmd, function(str) {
				toolkit.xmlRenderRes(req, res, str);
			});
		}
	}
	var msgLog = new MsgLog({
		date: Date.now(),
		text: req.body.xml.content[0]
	});
	msgLog.save(function(error) {
		if (error) {
			console.error(error);
		}
	});
	return toolkit.xmlRenderRes(req, res, ' 机器君已经不能回答您的问题啦. 人工智障君正在赶来.');
});

router.get('/wechat/get', function(req, res) {
	res.send(req.query.echostr);
});

module.exports = router;

