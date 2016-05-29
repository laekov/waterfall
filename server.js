#!/bin/env node

var app = require("./app");

var serverOptions = {
	ipaddress: "localhost",
	port: 2334,
	dburl: "mongodb://127.0.0.1/waterfall"
};

if (process.env.OPENSHIFT_NODEJS_IP) {
	serverOptions = {
		ipaddress: process.env.OPENSHIFT_NODEJS_IP,
		port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
		dburl: process.env.OPENSHIFT_MONGODB_DB_URL + 'waterfall'
	};
}

app.connectDB(serverOptions.dburl);

app.listen(serverOptions.port, serverOptions.ipaddress, function() {
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), serverOptions.ipaddress, serverOptions.port);
});

