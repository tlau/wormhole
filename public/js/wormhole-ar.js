var rtc;
var users = {};
var g_stream;
var g_call;

function init() {
  rtc.register("ar", function(worked) {
    holla.createFullStream(function(err, stream) {
      console.log('creating video stream on AR side');
      g_stream = stream;

      // Draw my picture-in-picture
      holla.pipe(stream, $(".me"));
    });

  });

  rtc.on("presence", updatePresence);
}

function callWG() {
  console.log("Calling WG");
  call = rtc.call("wg");
  call.addStream(g_stream);

  call.ready(function(stream) {
    call.mute();
    holla.pipe(stream, $(".them"));
  });

  // Hide their video on hangup
  call.on("hangup", function() {
    console.log("Other end hung up");
    $(".them").attr("src", "");
  });

  g_call = call;
}

function hangup() {
  console.log("Other end hung up");
  g_call.end();
  $(".them").attr("src", "");
}

function updatePresence(user) {
    console.log("in updatePresence");
    users[user.name] = user.online;
    console.log(user.name, "is", user.online);

    if (user.name === "wg" && user.online) {
      callWG();
    } else if (user.name === "wg" && !user.online) {
      hangup();
    }
}

function hangup() {
    console.log("Hanging up");
    g_call.end();
}

var g_mute = false;
function toggleMute() {
  g_mute = !g_mute;
  if (g_mute) {
    $("#mute").show();
    if (g_call) {
      g_call.mute();
    }
  } else {
    $("#mute").hide();
    if (g_call) {
      g_call.unmute();
    }
  }
}

$(function() {
  rtc = holla.createClient({debug:true});
  init();

  $("#body").click(toggleMute);
});

