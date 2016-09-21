var access = require('./access');
var ret = {};

ret.generate = function(user, done) {
	var res = [];
	if (!user) {
		res.push({
			'text': 'login',
			'href': '/login'
		});
		done(res);
	} else {
		res.push({
			'text': 'Show rooms',
			'href': '/'
		});
		res.push({
			'text': 'Log out',
			'href': '/login/logout'
		});
		access.getDoc('u_' + user.username, function(doc) {
			if (doc) {
				if (doc.list.indexOf('rounds') != -1) {
					res.push({
						'text': 'Manage rounds',
						'href': '/rounds/manage'
					});
				}
				if (doc.list.indexOf('access') != -1) {
					res.push({
						'text': 'Manage access',
						'href': '/access/manage'
					});
				}
			}
			done(res);
		});
	}
}

module.exports = ret;
