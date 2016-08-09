var express = require("express");
var Barr = require('../modules/db/barrage');
var toolkit = require('../modules/toolkit');
var router = express();

router.get("/", function(req, res) {
    res.render("wmr");
});

router.post("/search", function(req, res) {
    var roundId = req.body.roundId;
    if (roundId.length == 32) {
        var findPattern = {
            roundId: "thudom2016" + req.body.roundId,
        };
        Barr.find(findPattern, function(err, doc) {
            if (err) {
                res.send({ error: err });
            } else {
                res.send({ data: doc });
            }
        });
    } else {
        res.send({ error: 403, message: "wrong ID"});
    }
});

function checkString(str) {
    if (!str.match(/^\S{3,140}$/)) {
        return "???";
    } else {
        return str;
    }
}

router.post("/send", function(req, res) {
    var roundId = req.body.roundId;
    if (roundId.length == 32) {
        var findPattern = {
            roundId: "thudom2016" + roundId,
        };
        var barrData = {
            barrId: toolkit.md5sum(Date.now() + req.body.text),
            roundId: "thudom2016" + roundId,
            text: checkString(req.body.text),
            owner: "sys",
            time: Number(Date.now()) * 2 
        };
        if (barrData.text.length < 2 || barrData.text.length > 64) {
            res.send({ error: 403, message: 'Invalid text'});
        } else {
            var barr = new Barr(barrData);
            barr.save(function(err) {
                res.send({ error: err, time: barrData.time });
            });
        }
    } else {
        res.send({ error: 403, message: "wrong ID"});
    }
});

module.exports = router;

