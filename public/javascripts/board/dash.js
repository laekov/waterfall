function updatePage() {
	$.post("/login/query/watchList", function(res) {
		if (res.data && res.data.length) {
			for (var i = 0; i < res.data.length; ++ i) {
				var filter = { owner: res.data[i] };
				addToContentList(filter);
			}
		}
		else {
			$("#islistempty").show();
		}
	});
}

$(document).ready(function() {
	updatePage();
});
