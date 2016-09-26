var access = require('./access');
var ret = {};

ret.generate = function(user, done) {
	var res = [];
	if (!user) {
		res.push({
			'text': 'Login',
			'href': '/login'
		});
		res.push({
			'text': 'Register',
			'href': '/login/register'
		});
		done(res);
	} else {
		res.push({
			'text': 'Currently logged in as ' + user.username,
			'href': '#'
		});
		res.push({
			'text': 'Show rooms',
			'href': '/'
		});
		res.push({
			'text': 'Reset password',
			'href': '/login/resetpassword'
		});
		res.push({
			'text': 'Log out',
			'href': '/login/logout'
		});
		access.getDoc('u_' + user.username, function(doc) {
			if (doc) {
				if (doc.list.indexOf('rounds') != -1) {
					res.push({
						'text': 'Manage rooms',
						'href': '/rounds/manage'
					});
				}
				if (doc.list.indexOf('access') != -1) {
					res.push({
						'text': 'Manage access',
						'href': '/access/manage'
					});
				}	
				if (doc.list.indexOf('access') != -1) {
					res.push({
						'text': 'Edit blog',
						'href': '/blog/edit'
					});
				}
	
			}
			done(res);
		});
	}
}

module.exports = ret;
