function clearMsg() {
	$("#errorMessage").html("");
	$("#successMessage").html("");
	$("#pendingMessage").html("");
}

function loadBlog() {
	clearMsg();
	$("#pendingMessage").html("Pending");
	$("#content").val("");
	var postId = $("#postId").val();
	$.post('/blog/edit/get', { postId: postId }, function(res) {
		clearMsg();
		if (res.error) {
			return $("#errorMessage").html(res.message);
		}
		$("#successMessage").html("Loaded");
		$("#content").val(res.content);
	});
}
function postBlog() {
	clearMsg();
	$("#pendingMessage").html("Pending");
	var postId = $("#postId").val();
	var content = $("#content").val();
	$.post('/blog/edit/post', {
		postId: postId,
		content: content
	}, function(res) {
		clearMsg();
		if (res.error) {
			return $("#errorMessage").html(res.message);
		}
		$("#successMessage").html("Posted");
	});
}

$(document).ready(function() {
	$("#loadBlog").click(loadBlog);
	$("#postBlog").click(postBlog);
});

