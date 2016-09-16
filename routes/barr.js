var express = require("express");
var router = express();

router.get("/:roundId", function(req, res) {
	res.render("b", { roundId: req.params.roundId });
});

module.exports = router;

