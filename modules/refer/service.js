var fs = require('fs');
var path = require('path');

module.exports = function() {
    var self = this;
    self.init = function() {
        var dataStr = String(fs.readFileSync(path.resolve(__dirname, 'data.json')));
        self.data = JSON.parse(dataStr);
        self.map = {};
        for (var i in self.data) {
            self.map[self.data[i].en.toLowerCase()] = i;
        }
    };
    self.lookup = function(word) {
        if (!self.map) {
            self.init();
        }
        if (typeof(word) != 'string') {
            return 'Not a string';
        }
        if (self.map[word.toLowerCase()]) {
            var res = self.data[self.map[word.toLowerCase()]];
            return res.en + ': ' + res.cn + ' @' + res.pages;
        }
        return 'Not found';
    };
};
