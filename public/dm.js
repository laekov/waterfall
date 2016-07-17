var localRoundId = "qbxt201607";

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
		}
		showErr("Sent");
	});
	return 0;
}

function updateList() {
	$.post("/func/get", { roundId: localRoundId, timeLow: timeLow }, function(res) {
		if (res.error) {
			showErr(res.error);
		} else {
			for (var i in res.data) {
				var newEle = $("#sampleitem").clone();
				newEle.attr("id", res.data[i].barrId);
				newEle.find("#name").html(res.data[i].owner);
				newEle.find("#content").html(res.data[i].text);
				var brDate = new Date(res.data[i].time);
				newEle.find("#time").html(brDate.toLocaleString());
				$("#listmain").prepend(newEle);
				if (res.data[i].time > timeLow) {
					timeLow = res.data[i].time;
				}
			}
		}
		setTimeout("updateList()", 300);
	});
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
