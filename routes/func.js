var express = require("express");
var xml = require('xml');
var toolkit = require('../modules/toolkit');
var access = require('../modules/access');
var router = express();
var barr = require('../modules/barr');
var cmdList = [
	require('../modules/blog'),
	require('../modules/dash'),
	require('../modules/refer'),
	require('../modules/lrinv'),
];

router.post('/wechat/get', function(req, res) {
	var cmd = req.body.xml.content[0].split(' ');
	for (var i in cmdList) {
		if (cmdList[i].own(cmd[0])) {
			return cmdList[i].deal(req, cmd, function(str) {
				toolkit.xmlRenderRes(req, res, str);
			});
		}
	}
	return toolkit.xmlRenderRes(req, res, 'Function not supported yet');
});

router.get('/wechat/get', function(req, res) {
	res.send(req.query.echostr);
});

module.exports = router;

