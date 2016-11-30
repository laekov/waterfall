var fs = require('fs');
var cp = require('child_process');
var path = require('path');

module.exports.own = function(cmdl) {
    return cmdl == 'lrinv' || cmdl == 'lrlu' || cmdl == 'lrdet';
};

module.exports.deal = function(req, cmd, callback) {
    var txt = '';
    for (var i = 1; cmd[i]; ++ i) {
        txt += ' ' + cmd[i];
    }
    var inputFilePath = path.resolve(__dirname, '.tmpin');
    var execPath = path.resolve(__dirname, cmd[0]);
    fs.writeFileSync(inputFilePath, txt);
    try {
        cp.exec(execPath + ' <.tmpin', {
            cwd: __dirname, 
            timeout: 1000
        }, function(error, stdout, stderr) {
            if (error) {
                return callback(String(error));
            }
            if (stderr) {
                return callback(String(stderr));
            }
            return callback(String(stdout));
        });
    } catch (error) {
        callback('Error: ' + error);
    }
};
