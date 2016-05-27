function updateFileList() {
	$.post("/login/query", {}, function(data) {
		var userid = data.userid;
		$("#listdiv").html("");
		$.post("/file/list/" + userid, {}, function(data) {
			if (data.error) {
				$("#listdiv").html("Error: " + JSON.stringify(data));
			}
			else {
				for (var i = 0; i < data.length; ++ i) {
					var ele = $("#filesample").clone();
					ele.attr("id", "fileitem" + i);
					ele.find("#name").html(data[i].fileName);
					ele.find("#name").attr("href", "/file/query/" + data[i].fileId);
					ele.find("#size").html(data[i].size);
					ele.find("#fileid").html(data[i].fileId);
					ele.find("#rmfile").click(function() {
						var eleid = $(this).parent().attr("id");
						var id = Number(String(eleid).substr(8));
						var fileid = $("#" + eleid).find("#fileid").html();
						$.post("/file/remove/" + fileid, {}, function(data) {
							if (data.error) {
								$("#listdiv").html("An error occured");
							}
							updateFileList();
						});
					});
					$("#listdiv").append(ele);
					ele.show();
				}
			}
		});
	});
}

$(document).ready(function() {
	updateFileList();
});
