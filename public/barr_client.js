var timeLow = 1;

function showErr(word) {
	$("#errorinfo").html(word);
}

function submitBarr() {
	showErr("Sending");
	var data = {
		roundId: localRoundId,
		text: $("#text").val(),
		owner: $("#owner").val()
	};
	$("#text").val("");
	if (data.text.length < 3 || data.text.length > 100) {
		showErr("Illegal text");
		return -1;
	}
	if (data.owner.length < 3 || data.owner.length > 30) {
		showErr("Illegal name");
		return -1;
	}
	$.post("/func/send", data, function(res) {
		if (res.error) {
			showErr(res.message);
		} else {
			showErr("Sent");
		}
	});
	return 0;
}

var eleList = [];
var eleHead = 0;
var sessionIdList = {};
const maxEle = 512;

function randInt(x) {
	return Math.floor(Math.random() * x);
}

function updateList() {
	$.post("/func/get", { roundId: localRoundId, timeLow: timeLow }, function(res) {
		if (res.error) {
			showErr(res.error);
		} else {
			for (var i in res.data) {
				if (sessionIdList[res.data[i].barrId] != undefined) continue;
				sessionIdList[res.data[i].barrId] = res.data[i].sessionId;
				var newEle = $("#sampleitem").clone();
				newEle.attr("id", res.data[i].barrId);
				newEle.find("#name").html(res.data[i].owner);
				newEle.find("#content").html(res.data[i].text);
				var brDate = new Date(res.data[i].time);
				newEle.find("#time").html(brDate.toLocaleString());
				newEle.addClass("bg" + randInt(5));
				$("#listmain").prepend(newEle);
				eleList.push(newEle);
				if (res.data[i].time > timeLow) {
					timeLow = res.data[i].time;
				}
			}
		}
	});
	while (eleList.length - eleHead > maxEle) {
		eleList[eleHead].remove();
		++ eleHead;
	}
	setTimeout("updateList()", 300);
}

$(document).ready(function() {
	$("#submitbarr").click(submitBarr);
	$("#text").keyup(function(key) {
		if (key.which == 13) {
			submitBarr();
		}
	});
	updateList();
});
