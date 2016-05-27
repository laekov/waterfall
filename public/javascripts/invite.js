function isNum(e) {
	var k = window.event ? e.keyCode : e.which;
	if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
	} 
	else {
		if (window.event) {
			window.event.returnValue = false;
		}
		else {
			e.preventDefault(); //for firefox 
		}
	}
} 

function genSize(vl) {
	if (!vl) {
		return "0";
	}
	var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	var uniti = 0;
	var tt = vl;
	for (; vl >= 1024; ++ uniti) {
		vl /= 1024;
	}
	vl = Math.round(vl * 100) / 100;
	return vl + " " + units[uniti];
}

function updateInfo() {
	$.post('/login/query', function(res) {
		if (res.userid) {
			var userId = res.userid;
			$.post("/login/query/freeMask", function(res) {
				$("#freemask").find("#value").html(res.data);
			});
			$.post("/login/query/maxSize", function(res) {
				var maxSize = res.data;
				$("#maxsize").find("#value").html(genSize(maxSize));
				$.post("/login/query/curSize", function(res) {
					$("#cursize").find("#value").html(genSize(res.data));
					$("#freesize").find("#value").html(genSize(maxSize - res.data));
				});
			});
		}
	});
	$("#genedloading").show();
	$("#genederror").hide();
	$("#genedempty").hide();
	$.post('/login/invite/querymy', {}, function(res) {
		$("#genedlist").html("");;
		$("#genedlistsimple").find("#content").html("");;
		$("#genedloading").hide();
		if (res.error) {
			$("#genederror").html(res.error);
			$("#genederror").show();
		}
		else if (!res.data || !res.data.length) {
			$("#genedempty").show();
		}
		else {
			var d = res.data;
			for (var i = 0; i < d.length; ++ i) {
				var ele = $("#samplegenedcode").clone();
				ele.attr("id", "code_" + d[i].codeid);
				ele.find("#value").html(d[i].codeid);
				ele.find("#value_mask").html(d[i].inc.freeMask);
				ele.find("#value_size").html(genSize(d[i].inc.maxSize));
				ele.show();
				$("#genedlist").append(ele);
				$("#genedlistsimple").find("#content").append(d[i].codeid + "\n");
			}
		}
	});
}

function commitCodeSubmit() {
	$("#commiterror").hide();
	$("#commitsucceed").hide();
	$("#commitpending").show();
	$.post("/login/invite/commit/auth", { code: $("#commitcode").val() }, function(res) {
		$("#commitpending").hide();
		if (res.error) {
			$("#commiterror").html(res.error);
			$("#commiterror").show();
		}
		else {
			$("#commitsucceed").show();
		}
		updateInfo();
	});
}

function genSubmit() {
	$("#generror").hide();
	$("#gensucceed").hide();
	$("#genpending").show();
	var uploadForm = {};
	uploadForm.count = Number($("#gencount").val());
	uploadForm.mask = Number($("#genmask").val());
	uploadForm.size = Number($("#gensize").val()) * 1048576;
	$.post("/login/invite/gen/auth", uploadForm, function(res) {
		$("#genpending").hide();
		if (res.error) {
			$("#generror").html(res.error);
			$("#generror").show();
		}
		else {
			$("#gensucceed").show();
		}
		updateInfo();
	});
}

function changeListFormat() {
	if ($("#genedlist").css("display") == "none") {
		$("#genedlistsimple").hide();
		$("#genedlist").show();
	}
	else {
		$("#genedlist").hide();
		$("#genedlistsimple").show();
	}
}

$(document).ready(function() {
	updateInfo();
	$("#commitsubmit").click(commitCodeSubmit);
	$("#gensubmit").click(genSubmit);
	$("#gencount").keypress(isNum);
	$("#genmask").keypress(isNum);
	$("#gensize").keypress(isNum);
	$("#changeformat").click(changeListFormat);
});

