var fs = require('fs');
var cp = require('child_process');
var path = require('path');

module.exports.own = function(cmdl) {
    return cmdl == 'lrinv';
};

module.exports.deal = function(req, cmd, callback) {
    var txt = '';
    for (var i = 1; cmd[i]; ++ i) {
        txt += ' ' + cmd[i];
    }
    fs.writeFileSync(path.resolve(__dirname, '.tmpin'), txt);
    try {
        cp.execSync(path.resolve(__dirname, 'lrinv') + ' <.tmpin >.tmpout');
        callback(String(fs.readFileSync(path.resolve(__dirname, '.tmpout'))));
    } catch (error) {
        callback('Error: ' + error);
    }
};
