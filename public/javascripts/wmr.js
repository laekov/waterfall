function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}
function showStatus(text, color) {
    $("#status").html(text);
    if (!color) {
        color = "#000";
    }
    $("#status").css("color", color);
}

function getRoundId() {
    var buildingId = $("#buildingId").val();
    var roomId = $("#roomId").val();
    if (!buildingId.match(/^\d{1,3}$/)) {
        showStatus("Wrong building", "red");
        return 0;
    } else if (!roomId.match(/^\d{3}.$/)) {
        showStatus("Wrong room", "red");
        return 0;
    } else {
        return $.md5(buildingId + "_" + roomId);
    }
}

function search() {
    var roundId = getRoundId();
	$("#postdiv").hide();
    if (roundId) {
        showStatus("Searching", "blue");
        $.post("/wmr/search", { roundId: roundId }, function(res) {
            if (res.error) {
                showStatus("Error " + res.error + ": " + res.message);
            } else {
                res.data.sort(function(a, b) {
                    return b.time - a.time;
                });
                $("#postdiv").show();
                showStatus("Done", "green");
                var contentDiv = $("#contentList");
                contentDiv.html("");
                for (var i in res.data) {
                    var barr = $("#sampleBarr").clone();
                    barr.attr("id", res.data[i].barrId);
                    barr.find("#text").html(res.data[i].text);
                    var brDate = new Date(res.data[i].time / 2);
                    barr.find("#time").html(brDate.toLocaleString());
                    barr.addClass("bg" + randInt(0, 5));
                    contentDiv.append(barr);
                }
            }
        });
    }
}

function post() {
    var roundId = getRoundId();
    if (roundId) {
        var text = $("#posttext").val();
        if (!text.match(/^\S{3,140}$/)) {
            showStatus("Illegal text", "red");
        } else {
            showStatus("Posting", "blue");
            var postData = {
                roundId: roundId,
                text: text,
            };
            $.post("/wmr/send", postData, function(res) {
                if (res.error) {
                    showStatus("Error " + res.error + ": " + res.message);
                } else {
                    search();
                }
            });
        }
    }
}

$(document).ready(function() {
    $("#search").click(search);
    $("#post").click(post);
});
