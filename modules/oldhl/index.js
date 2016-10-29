var generator = require('./gen');
var Hlrec = require('../../models/hlrec');

module.exports.own = function(cmdl) {
    return cmdl == 'oldhl';
}

module.exports.deal = function(req, cmd, callback) {
    var userId = req.body.xml.fromusername[0];
    Hlrec.findOne({
        userId: userId
    }, function(err, doc) {
        if (err || !doc || doc.lifeTime < Date.now()) {
            var newStr = generator.gen();
            var newDate = new Date();
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            Hlrec.update({
                userId: userId
            }, {
                $set: {
                    message: newStr,
                    lifeTime: newDate.getTime() + 86400000
                }
            }, {
                upsert: true
            }, function(err) {
                callback(newStr);
            });
		} else {
			callback(doc.message);
		}
    });
};

