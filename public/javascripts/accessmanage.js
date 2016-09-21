$(document).ready(function() {
	$("#submitview").click(function() {
		var formData = {
			username: $("#viewusername").val()
		};
		$("#accesslist").html("Querying");
		$.post('/access/update/view', formData, function(res) {
			$("#accesslist").html(JSON.stringify(res));
		});
	});
});
