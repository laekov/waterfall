function createFileRef(id, callback) {
	var ele = $("#samplefileref").clone();
	var ref = ele.find("#content");
	ele.attr("id", "filecontainer_" + id);
	ref.attr("id", "file_" + id);
	ref.attr("href", "/file/query/" + id);
	ele.show();
	ref.html(id);
	callback(ele);
	$.post("/file/info/" + id, { fileName: true }, function(res) {
		$("#file_" + id).html(res.fileName);
	});
}

function createItem(d, callback) {
	var ele = $("#sampleitem").clone();
	ele.attr("id", d.grainid);
	renderMaskInfo(d.owner, "#samplemaskinfosmall", function(gele) {
		ele.find("#owner").append(gele);
	},
	function() {
		window.location.reload();
	});
	var mDate = new Date();
	mDate.setTime(d.modifyTime);
	ele.find("#date").html(mDate.toLocaleDateString() + "&nbsp;" + mDate.toLocaleTimeString());
	ele.find("#content").html(d.text);
	if (Boolean(d.files) && d.files.length) {
		ele.find("#filelisttitle").show();
	}
	if (d.files) {
		for (var i = 0; i < d.files.length; ++ i) {
			createFileRef(d.files[i], function(res) {
				ele.find("#filelist").append(res);
			});
		}
	}
	callback(ele);
}

function addToContentList(filter) {
	$.post("/grain/query", filter, function(res) {
		var data = res.data;
		data.sort(function(x, y) {
			return y.modifyTime - x.modifyTime;
		});
		for (var i = 0; i < data.length; ++ i) {
			createItem(data[i], function(ele) {
				$("#contentdiv").append(ele);
				ele.find("#head").hover(function() {
					ele.find("#moreinfo").position(ele.position);
					ele.find("#moreinfo").show();
				}, 
				function() {
					setTimeout(function() {
						ele.find("#moreinfo").hide();
					},
					1000);
				});
				ele.show();
			});
		}
	});
}

