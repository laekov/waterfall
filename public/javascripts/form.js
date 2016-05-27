function showError(message) {
	$("#message").html(message);
}

function submitForm() {
	var postForm = new Object();
	for (var i in itemlist) {
		if (itemlist[i].type == "text" || itemlist[i].type == "password") {
			postForm[i] = $("#" + i).val();
		}
		else if (itemlist[i].type == "radio") {
			postForm[i] = $("input[name='" + i + "']:checked").val();
		}
	}
	showError("<span style='color: blue;'>Pending</span>");
	$.post(posturl, postForm, function(data) {
		if (data.error) {
			showError(data.message);
		}
		else {
			showError("<span style='color: green;'>Succeeded</span>");
			if (reftype == "signup" || reftype == "createmask") {
				window.location.href = "/";
			}
		}
	});
}

$(document).ready(function() {
	$("#submit").click(submitForm);
});

