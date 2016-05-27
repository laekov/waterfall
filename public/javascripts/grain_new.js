function showError(message) {
	$("#message").html(message);
}

function submitForm() {
	$("#submit").attr("disabled", "disabled");
	$("#fileselector").attr("disabled", "disabled");
	var postForm = new Object();
	postForm.text = $("#maincontents").val();
	postForm.maskid = $("input[name='maskid']:checked").val();
	postForm.filecnt = 0;
	for (var i = 0; i < fileList.length; ++ i) {
		while (!fileList[i].removed && !fileList[i].uploaded);
		if (!fileList[i].removed) {
			postForm["file" + (postForm.filecnt ++)] = fileList[i].fileid;
		}
	}
	showError("<span style='color: blue;'>Pending</span>");
	$.post("/grain/new/auth", postForm, function(data) {
		$("#submit").attr("disabled", "none");
		$("#fileselector").attr("disabled", "none");
		if (data.error) {
			showError(ret.error);
		}
		else {
			showError("<span style='color: green;'>Succeeded</span>");
		}
	});
}

function updateContentSize() {
	$("#maincontents").width($("#formdiv").width() + "px");
	$("#maincontents").height((window.innerHeight / 2) + "px");
}

$(document).ready(function() {
	$("#submit").click(submitForm);
	updateContentSize();
});

$(window).resize(function() {
	updateContentSize();
});

