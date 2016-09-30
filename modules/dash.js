var Step = require('step');
var barr = require('../modules/barr.js');
var toolkit = require('../modules/toolkit');
var xmlRenderRes = toolkit.xmlRenderRes;

var isDashCmd = function(cmdl) {
    return cmdl == 'dash';
}

const maxLength = 64;
const dashLifetime = 12 * 60 * 60 * 1000;

function postDash(attr, callback) {
    if (!attr.text || typeof(attr.text) != 'string') {
        return callback('Illegal string');
    }
    if (attr.text.length > maxLength) {
        return callback('You said too much');
    }
    barr.cleanBarr();
	Step(function() {
		barr.getBarr({
			owner: attr.owner,
			deadline: {
				$gt: Date.now()
			}
		}, this);
	}, function(data) {
		if (data.error) {
			callback(data.error.message);
			return undefined;
		}
		var doc = data.data;
		if (doc && doc.length) {
			callback('You speak too frequently');
			return undefined;
		}
		barr.sendBarr(attr, this);
	}, function(data) {
		if (data.error) {
			return callback(data.error.message);
		}
		callback('Done');
	});
}

function getDash(callback) {
	barr.getBarr({
		roundId: 'dash'
	}, function(data) {
		if (data.error) {
			return callback(data.error.message);
		}
		var doc = data.data;
		var res = '';
		for (var i in doc) {
			res += doc[i].text + ' @' + new Date(doc[i].time + 480 * 60 * 1000).toLocaleString();
		}
		if (res == '') {
			res = 'Nothing';
		}
		callback(res);
	});
}

var dealWithCmd = function(req, cmds, callback) {
	if (cmds[1] == 'see') {
		return getDash(callback);
	} else if (cmds[1] == 'say') {
		if (!cmds[2]) {
			return callback('Who are you?');
		} else if (!cmds[3]) {
			return callback('What do you want to say?');
		}
		var attr = {
			roundId: 'dash',
			barrId: toolkit.md5sum(Date.now() + cmds[2]),
			owner: req.body.xml.fromusername[0],
			text: cmds[2] + ': ',
			time: Date.now(),
			deadline: Date.now() + dashLifetime
		};
		for (var i = 3; cmds[i]; ++ i) {
			attr.text += cmds[i] + ' ';
		}
		return postDash(attr, callback);
	}
};

module.exports.own = isDashCmd;
module.exports.deal = dealWithCmd;

