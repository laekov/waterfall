function showError(message) {
	$("#message").html(message);
}

function getFile(callback) {
	var ret = new Object();
	var file = document.getElementById("file").files[0];
	var reader = new FileReader;
	reader.onload = function() {
		ret.content = this.result;
		ret.filename = file.name;
		ret.size = file.size;
		callback(ret);
	};
	reader.readAsBinaryString(file);
}

function showFileInfo() {
	getFile(function(file) {
		var infoStr = "";
		infoStr += "<p>Name: " + file.filename + "</p>";
		infoStr += "<p>Size: " + file.size + "</p>";
		$("#fileinfo").html(infoStr);
	});
}

function uploadFile() {
	showError("<span style='color: blue;'>Pending</span>");
	getFile(function(file) {
		$.post("/file/upload/auth", file, function(data) {
			if (data.error) {
				if (data.message) {
					showError(data.message);
				}
				else if (typeof(data.error) == "string") {
					showError(data.error);
				}
				else {
					console.log(data.error);
					showError("Unknown error");
				}
			}
			else {
				showError("<span style='color: green;'>Succeeded</span>");
			}
		});
	});
}

$(document).ready(function() {
	$("#file").change(showFileInfo);
	$("#submit").click(uploadFile);
});

