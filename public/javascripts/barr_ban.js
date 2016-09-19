$(document).ready(function() {
	$("#submitban").click(function() {
		$("#info").html("Submitting");
		var data = {
			owner: $("#owner").val(),
			adminKey: $("#key").val(),
		};
		$.post("/func/addBan", data, function(res) {
			if (res.error) {
				$("#info").html(res.message);
			} else {
				$("#info").html("Done");
				$("#text").val("");
			}
		});
	});
});
