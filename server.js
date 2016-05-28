#!/bin/env node

var app = require("./app");

var ipaddress = "localhost";
var port      = 2334;
app.listen(port, ipaddress, function() {
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
});

