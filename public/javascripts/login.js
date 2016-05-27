function showError(message) {
	$("#loginmessage").html(message);
}

function login() {
	var userid, passwd;
	$("#loginmessage").html("<span style='color:blue'>Pending</span>");
	userid = $("#loginuserid").val();
	passwd = $("#loginpasswd").val();
	$.post("/login/auth", {
		userid: userid,
		passwd: passwd
	},
	function(data) {
		if (data.error) {
			showError(data.message);
		}
		else {
			showError("<span style='color:green'>Succeeded</span>");
			window.location.reload();
		}
	});
}


$(document).ready(function() {
	$("#loginuserid").keyup(function(key) {
		if (key.which == 13) {
			login();
		}
	});
	$("#loginpasswd").keyup(function(key) {
		if (key.which == 13) {
			login();
		}
	});
	$("#loginsubmit").click(login);
});

