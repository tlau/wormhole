var rtc;
var users = {};
var g_stream;
var g_call;

function init() {
    rtc.register("ar", function(worked) {
      holla.createVideoStream(function(err, stream) {
        console.log('creating video stream on AR side');
        g_stream = stream;

        // Draw my picture-in-picture
        holla.pipe(stream, $(".me"));

        // Wait 5 seconds then call
//        window.setTimeout(function() { callWG(); }, 5000);
      });

    });

    rtc.on("presence", updatePresence);

}

function callWG() {
    console.log("Calling WG");
    call = rtc.call("wg");
    call.addStream(g_stream);

    call.ready(function(stream) {
      holla.pipe(stream, $(".them"));
    });

    // Hide their video on hangup
    call.on("hangup", function() {
      console.log("Other end hung up");
      $(".them").attr("src", "");
    });

    g_call = call;
}

function updatePresence(user) {
    console.log("in updatePresence");
    users[user.name] = user.online;
    console.log(user.name, "is", user.online);

    if (user.name === "wg" && user.online) {
      callWG();
    }
}

function hangup() {
    console.log("Hanging up");
    g_call.end();
}

var g_mute = false;
function toggleMute() {
  g_mute = !g_mute;
  console.log("toggleMute is now", g_mute);
  if (!g_call) return;
  if (g_mute) {
    $("#mute").html("Muted");
    g_call.mute();
  } else {
    $("#mute").html("Unmuted");
    g_call.unmute();
  }
}

$(function() {
  rtc = holla.createClient({debug:true});
  init();

  $("#body").click(toggleMute);
});

