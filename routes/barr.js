var express = require("express");
var access = require('../modules/access');
var router = express();

router.get("/:roundId", function(req, res) {
	if (!req.user) {
		return res.redirect('/login');
	}
	access.has('u_' + req.user.username, 'view', function(viewable) {
		res.render("barrage", { roundId: req.params.roundId, needUpdate: viewable });
	});
});

module.exports = router;

