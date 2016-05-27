function onWatchStatusChange() {
	var req = window.location.pathname.split('/');
	var filter = { owner: req[3] };
	$("#ownerinfo").html("");
	renderMaskInfo(filter.owner, "#samplemaskinfobig", function(ele) {
		$("#ownerinfo").append(ele);
	}, 
	onWatchStatusChange);
}

$(document).ready(function() {
	var req = window.location.pathname.split('/');
	var filter = { owner: req[3] };
	addToContentList(filter);
	onWatchStatusChange();
});

