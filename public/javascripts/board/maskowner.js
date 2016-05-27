function renderMaskInfo(maskId, sourceId, callback, actChange) {
	var ele = $(sourceId).clone();
	ele.attr("id", "infocontent");
	ele.find("#maskid").html(maskId);
	$.post("/mask/query/" + maskId + "/description", function(res) {
		if (res.error) {
			ele.find("#description").html("Error fetching data. Info: " + res.error);
		}
		else {
			ele.find("#description").html(res.data);
		}
	});
	$.post("/mask/query/" + maskId + "/headimage", function(res) {
		if (res.error || !res.data) {
			ele.find("#head").attr("src", "/images/head_default.png");
		}
		else {
			ele.find("#head").attr("src", res.data);
		}
	});
	$.post("/login/query/watchList", function(res) {
		if (res.data  && res.data.indexOf(maskId) > -1) {
			ele.find("#unwatch").show();
			ele.find("#unwatch").click(function() {
				$.post("/login/watch/remove", { maskId: maskId }, actChange);
			});

		}
		else {
			ele.find("#watch").show();
			ele.find("#watch").click(function() {
				$.post("/login/watch/add", { maskId: maskId }, actChange);
			});
		}
	});
	ele.find("#head").hover(function() {
		$(this).find("#moreinfo").show();
	}, 
	function() {
		$(this).find("#moreinfo").hide();
	});
	ele.find("#maskid").attr("href", "/board/mask/" + maskId);
	ele.find("#maskid").hover(function() {
		$(this).find("#moreinfo").show();
	}, 
	function() {
		$(this).find("#moreinfo").hide();
	});
	ele.show();
	callback(ele);
}

