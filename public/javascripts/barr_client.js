var timeLow = 1;

function showErr(word) {
	$("#errorinfo").html(word);
}

var eleList = [];
var eleHead = 0;
var lastColor = 1;
const maxEle = 512;

function submitBarr() {
	// showErr("Sending");
	var data = {
		text: $("#text").val()
	};
	$("#text").val("");
	if (data.text.length < 1 || data.text.length > 100) {
		showErr("Illegal text");
		return -1;
	}
	var newEle = $("#sampleitem").clone();
	if (!needRefresh) {
		newEle.attr("id", Date.now());
		newEle.find("#name").html('me');
		newEle.find("#content").html(data.text);
		newEle.find("#time").html((new Date()).toLocaleString());
		newEle.find("#status").html('Sending');
		newEle.find("#status").css('color', 'blue');
		newEle.find("#status").removeClass('hidden');
		lastColor ^= 1;
		newEle.addClass("bg" + lastColor);
		$("#listmain").prepend(newEle);
		eleList.push(newEle);
	}
	$.post("/room/" + localRoundId + "/send", data, function(res) {
		if (res.error) {
			newEle.find("#status").html(res.message);
			newEle.find("#status").css('color', 'red');
		} else {
			newEle.find("#status").html('Sent');
			newEle.find("#status").css('color', 'green');
		}
	});
	return 0;
}

function randInt(x) {
	return Math.floor(Math.random() * x);
}

function updateList() {
	$.post("/room/" + localRoundId + "/get", { timeLow: timeLow }, function(res) {
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
                lastColor ^= 1;
				newEle.addClass("bg" + lastColor);
				$("#listmain").prepend(newEle);
				if (res.data[i].time - timeLow > 60 * 1000) {
					newEle.find("#time").removeClass('hidden');
				}
				eleList.push(newEle);
				if (res.data[i].time > timeLow) {
					timeLow = res.data[i].time;
				}
			}
		}
		setTimeout("updateList()", 300);
	});
	while (eleList.length - eleHead > maxEle) {
		eleList[eleHead].remove();
		++ eleHead;
	}
}

$(document).ready(function() {
	$("#submitbarr").click(submitBarr);
	$("#text").keyup(function(key) {
		if (key.which == 13) {
			submitBarr();
		}
	});
    if (needRefresh) {
        updateList();
    }
	$("#hidepost").click(function() {
		$("#postdiv").hide();
	});
});

