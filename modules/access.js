var Access = require('../models/access');

function getDoc(uId, done) {
    Access.findOne({ uId: uId }, function(err, doc) {
        if (err) {
            return done(false);
        }
        done(doc);
    });
}

var ret = {};

ret.has = function(a, b, done) {
    if (typeof(a) != 'string' || typeof(b) != 'string') {
        return done(false);
    }
    getDoc(a, function(doc) {
        if (doc) {
            done(doc.list.indexOf(b) != -1);
        } else {
            done(false);
        }
    });
}

ret.check = function(a, b, done) {
    if (typeof(a) != 'string' || typeof(b) != 'string') {
        return done(false);
    }
    getDoc(a, function(doca) {
        getDoc(b, function(docb) {
            if (!doca || !docb) {
                return done(false);
            }
            for (i in doca.list) {
                if (docb.list.find(doca.list[i])) {
                    return done(true);
                }
            }
            return done(false);
        });
    });
}

ret.reg = function(uId, done) {
    var accessData = {
        uId: uId,
        list: []
    };
    var access = new Access(accessData);
    access.save(done);
}

ret.add = function(uId, tag, done) {
    Access.update({ uId: uId }, { $addToSet: { list: tag } }, { upsert: true }, done);
}

ret.remove = function(uId, tag, done) {
    Access.update({ uId: uId }, { $pull: { list: tag } }, { upsert: true }, done);
}

module.exports = ret;

