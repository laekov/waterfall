var Dictionary = require('./service');
var dictionary = new Dictionary();

module.exports.own = function(cmdl) {
    return cmdl == 'refer';
};

module.exports.deal = function(req, cmd, callback) {
    var word = '';
    for (var i = 1; cmd[i]; ++ i) {
        if (i > 1) {
            word += ' ';
        }
        word += cmd[i];
    }
    callback(dictionary.lookup(word));
};
