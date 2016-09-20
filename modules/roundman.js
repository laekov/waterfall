const timeInterval = 5 * 1000;
var RoundController = function(roundId) {
	var self = this;
	self.roundId = roundId;
	self.audiences = [];
	self.login = function(username) {
		self.audiences[username] = { lastPost: 0 };
	}
	self.checkSend = function(username) {
		if (!self.audiences[username]) {
			return false;
		}
		if (Date.now() - self.audiences[username].lastPost > timeInterval) {
			return false;
		} else {
			return 'Sending too fast';
		}
	}
	self.commitSend = function(username) {
		 self.audiences[username].lastPost = Date.now();
	}
};

var RoundManager = function() {
	var self = this;
	var rounds = [];
	self.reg = function(roundId) {
		rounds[roundId] = new RoundController(roundId);
	}
	self.dismiss = function(roundId) {
		delete rounds[roundId];
	}
	self.login = function(roundId, username) {
		if (rounds[roundId]) {
			rounds[roundId].login(username);
		}
	}
	self.checkSend = function(roundId, username) {
		if (rounds[roundId]) {
			return rounds[roundId].checkSend(username);
		} else {
			return 'No such round';
		}
	}
	self.commitSend = function(roundId, username) {
		if (rounds[roundId]) {
			rounds[roundId].commitSend(username);
		}
	}
	self.list = function() {
		var ret = [];
		for (var i in rounds) {
			ret.push(i);
		}
		return ret;
	}
};

module.exports = new RoundManager();

