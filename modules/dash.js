var barr = require('../modules/barr.js');
var toolkit = require('../modules/toolkit');
var xmlRenderRes = toolkit.xmlRenderRes;

var isDashCmd = function(cmdl) {
    return cmdl == 'dash';
}

const maxLength = 64;
const dashLifetime = 12 * 60 * 60 * 1000;

function postDash(attr, callback) {
    if (!attr.content || typeof(attr.content) != 'string') {
        return callback('Illegal string');
    }
    if (attr.content.length > maxLength) {
        return callback('You said too much');
    }
    barr.cleanBarr();
    try {
        Step(function() {
            barr.getBarr({
                owner: attr.owner,
                deadline: {
                    $gt: Date.now()
                }
            }, this);
        }, function(data) {
            if (data.error) {
                throw(error.message);
            }
			var doc = data.doc;
            if (doc && doc.length) {
                throw('You speak too frequently');
            }
            barr.sendBarr(attr, this);
        }, function(err) {
            if (err) {
                throw(err);
            }
            throw('Done');
        });
    } catch (error) {
        callback(error);
    }
}

function getDash(callback) {
    barr.getBarr({
        roundId: 'dash'
    }, function(data) {
        if (data.error) {
            return callback(data.error.message);
        }
		var doc = data.doc;
        var res = '';
        for (var i in doc) {
            res += doc[i].text + ' @' + new Date(doc[i].time).toLocaleTimeString();
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

