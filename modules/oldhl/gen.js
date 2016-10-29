var fs = require("fs");

var randInt = function(x) {
    return Math.floor(Math.random() * x);
};

module.exports.gen = function() {
    var data;
    try {
        data = JSON.parse(String(fs.readFileSync('./data.json')));
    } catch (error) {
        return "Error: " + error;
    }
    var res = data.types[randInt(data.types.length)];
    res.good = Number(res.good) + randInt(1);
    res.a = [];
    for (var i = 0; i < res.good; ++ i) {
        while (1) {
            var x = randInt(data.things.length);
            if (res.a.indexOf(data.things[x]) == -1) {
                res.a.push(data.things[x]);
                break;
            }
        }
    }
    res.bad = Number(res.bad) + randInt(1);
    res.b = [];
    for (var i = 0; i < res.bad; ++ i) {
        while (1) {
            var x = randInt(data.things.length);
            if (res.a.indexOf(data.things[x]) == -1 && res.b.indexOf(data.things[x])) {
                res.b.push(data.things[x]);
                break;
            }
        }
    }
    var ans = '今日运势: ' + res.name;
    if (res.good) {
        ans += '\n宜: ';
        for (var i in res.a) {
            if (i) {
                ans += ', ';
            }
            ans += res.a[i];
        }
    }
    if (res.bad) {
        ans += '\n不宜: ';
        for (var i in res.b) {
            if (i) {
                ans += ', ';
            }
            ans += res.b[i];
        }
    }
    return ans;
};

