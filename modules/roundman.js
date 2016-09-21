const timeInterval = 5 * 1000;
var RoundController = function(roundId) {
	var self = this;
	self.roundId = roundId;
	self.audiences = [];
	self.count = 0;
	self.login = function(username) {
		if (!self.audiences[username]) {
			++ self.count;
		}
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
	self.rounds = [];
	self.reg = function(roundId) {
		self.rounds[roundId] = new RoundController(roundId);
	}
	self.dismiss = function(roundId) {
		delete self.rounds[roundId];
	}
	self.login = function(roundId, username) {
		if (self.rounds[roundId]) {
			self.rounds[roundId].login(username);
		}
	}
	self.checkSend = function(roundId, username) {
		if (self.rounds[roundId]) {
			return self.rounds[roundId].checkSend(username);
		} else {
			return 'No such round';
		}
	}
	self.commitSend = function(roundId, username) {
		if (self.rounds[roundId]) {
			self.rounds[roundId].commitSend(username);
		}
	}
	self.list = function() {
		var ret = [];
		for (var i in self.rounds) {
			ret.push({
				roundId: i,
				count: self.rounds[i].count
			});
		}
		return ret;
	}
};

module.exports = new RoundManager();

