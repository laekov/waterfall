var fileList = [];

function getFile(file, id, callback) {
	var ret = new Object();
	var reader = new FileReader;
	reader.onload = function() {
		ret.content = this.result;
		ret.filename = file.name;
		ret.size = file.size;
		callback(id, ret);
	};
	reader.readAsBinaryString(file);
}

function uploadFile(id) {
	var eleid = "fileitem" + id;
	var ele = $("#" + eleid);
	$.post("/file/upload/auth", fileList[id], function(data) {
		ele.find("#status").removeClass("blue");
		ele.find("#status").addClass("red");
		var msg = "Unknown error";
		fileList[id].removed = true;
		if (!data.error) {
			ele.find("#status").removeClass("red");
			ele.find("#status").addClass("green");
			msg = "Uploaded";
			fileList[id].removed = false;
			fileList[id].uploaded = true;
			fileList[id].fileid = data.id;
		}
		else if (data.message) {
			msg = data.message;
		}
		else if (typeof(data.error) == "string") {
			msg = data.error;
		}
		ele.find("#status").html(msg);
	});
}

function updateFileList() {
	var obj = document.getElementById("fileselector");
	for (var i = 0; i < obj.files.length; ++ i) {
		var id = fileList.length;
		fileList.push({});
		var dispObj = $("#fileitemsample").clone();
		var eleid = "fileitem" + id;
		dispObj = dispObj.attr({ id: eleid });
		$("#filelist").append(dispObj);
		var ele = $("#" + eleid);
		ele.find("#name").html(obj.files[i].name);
		ele.find("#size").html(obj.files[i].size + "B");
		ele.find("#rmfile").click(function() {
			var eleid = $(this).parent().attr("id");
			$("#" + eleid).hide();
			var id = Number(eleid.substr(8));
			fileList[id].removed = true;
		});
		ele.show();
		getFile(obj.files[i], i, function(id, file) {
			var eleid = "fileitem" + id;
			var ele = $("#" + eleid);
			ele.find("#status").html("Uploading");
			fileList[id] = file;
			uploadFile(id);
		});
	}
	obj.outerHTML = obj.outerHTML;
	$("#fileselector").change(updateFileList);
}

$(document).ready(function() {
	$("#fileselector").change(updateFileList);
});

