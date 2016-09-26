#!/bin/env node

var app = require("./app");
var fs = require('fs');

var serverOptions = {
	ipaddress: "ec2-52-11-57-80.us-west-2.compute.amazonaws.com",
	port: 80,
	dburl: "mongodb://127.0.0.1/waterfall"
};

if (process.env.OPENSHIFT_NODEJS_IP) {
	serverOptions = {
		ipaddress: process.env.OPENSHIFT_NODEJS_IP,
		port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
		dburl: process.env.OPENSHIFT_MONGODB_DB_URL + 'dm'
	};
}

var httpsOptions = {
	key: fs.readFileSync('./cert/server.key'),
	cert: fs.readFileSync('./cert/server.crt')
};

app.connectDB(serverOptions.dburl);

app.listen(serverOptions.port, serverOptions.ipaddress, function() {
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), serverOptions.ipaddress, serverOptions.port);
});
