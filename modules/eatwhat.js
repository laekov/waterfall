var halls = {};
module.exports.own = function(cmdl) {
    return cmdl === 'eatwhat' || cmdl === 'eatadd' || cmdl === 'eatlist';
};

module.exports.dealWithCmd = function(req, cmds, callback) {
    if (cmds[0] === 'eatwhat') {
        var tot = 0;
        for (var i in halls) {
            tot += halls[i];
        }
        if (tot == 0) {
            return callback('悲伤地告诉你, 没有东西可吃');
        }
        var b = Math.floor(tot * Math.random());
        for (var i in halls) {
            b -= halls[i];
            if (b < 0) {
                return callback('去吃 ' + i + ' 吧');
            }
        }
        return callback('哈哈哈所有食堂都枚举过了但是你还是没有东西可吃');
    } else if (cmds[0] === 'eatadd') {
        for (var i = 1; i < cmds.length; ++ i) {
            if (halls[cmds[i]] === undefined) {
                halls[cmds[i]] = 0;
            }
            ++ halls[cmds[i]];
        }
    } else if (cmds[0] === 'eatlist') {
        var res = '';
        for (var i in halls) {
            res += i + ': ' + halls[i] + '\n';
        }
        callback(res);
    }
};
