var Barr = require('../models/barrage');
var toolkit = require('../modules/toolkit');

function cleanBarr() {
    Barr.remove({ 
        deadline: { $lt: Date.now() } 
    }, function(err) {
        if (err) {
            //console.log(err);
        }
    });
}

var sendBarr = function(barrData, callback) {
	cleanBarr();
    if (barrData.text.length < 2 || barrData.text.length > 64) {
        return callback({ error: 403, message: 'Invalid text'});
    } else {
        var barr = new Barr(barrData);
        barr.save(function(err) {
            callback({ error: err, time: barrData.time });
        });
    }
}

var getBarr = function(attr, callback) {
  Barr.find(attr, function(err, doc) {
      if (err) {
          return callback({error: err});
      } 
      callback({ data: doc });
  });
}

module.exports.cleanBarr = cleanBarr;
module.exports.sendBarr = sendBarr;
module.exports.getBarr = getBarr;

