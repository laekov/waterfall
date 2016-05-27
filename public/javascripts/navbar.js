var curNavType = 0;

function changeNav(type) {
	if (type != undefined) {
		curNavType = type;
	}
	var wndWid = window.innerWidth;
	var navWid;
	if (curNavType == 0) {
		navWid = (wndWid > 40) ? 40: wndWid;
		$("#navmain").hide();
		$("#navtiny").show();
		$("#navdiv").width(navWid + "px");
		$("#maindiv").width((wndWid - navWid) + "px");
	}
	else if (curNavType == 1) {
		navWid = (wndWid > 192) ? 192: wndWid;
		$("#navtiny").hide();
		$("#navmain").show();
	}
	$("#navdiv").width(navWid + "px");
	$("#maindiv").width((wndWid - navWid) + "px");
}

function updateLoginStatus() {
	$.post("/login/query", function(data) {
		if (!data.userid) {
			$("#useronline").hide();
			$("#useroffline").show();
		}
		else {
			$("#useronline").show();
			$("#useroffline").hide();
			$("#login_userid").html(data.userid);
		}
	});
}

function expandMaskList() {
	$.post("/login/query", function(data) {
		if (data.userid) {
			$("#mymasks").html("Pending");
			$("#mymasks").show();
			$.post("/login/query/masklist", function(res) {
				$("#mymasks").html("");
				var data = res.data;
				for (var i = 0; i < data.length; ++ i) {
					var d = data[i];
					var ele = $("#samplehref").clone();
					ele.find("#ref").attr("href", "/board/mask/" + data[i]);
					ele.find("#ref").html(data[i]);
					$("#mymasks").append(ele);
					ele.show();
				}
			});
		}
		else {
			$("#mymasks").html("Please log in first");
		}
	});
}

$(document).ready(function() {
	$("#navmain").height(window.innerHeight + "px");
	$("#navtiny").height(window.innerHeight + "px");
	changeNav(1);
	$("#minmnavbar").click(function() {
		changeNav(0);
	});
	$("#maxmnavbar").click(function() {
		changeNav(1);
	});
	$("#logout").click(function() {
		$.post("/login/logout");
		window.location.reload();
	});
	$("#expandmy").click(expandMaskList);
	$("#expandlogin").click(function() {
		$("#logindiv").slideDown();
	});
	updateLoginStatus();
});

$(window).resize(function() {
	$("#navmain").height(window.innerHeight + "px");
	$("#navtiny").height(window.innerHeight + "px");
	changeNav();
});

