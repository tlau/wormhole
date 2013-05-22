var rtc = holla.createClient();

var g_call;

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
  holla.createFullStream(function(err, stream) {
    console.log("creating video stream on WG side");
    holla.pipe(stream, $(".me"));

    rtc.register("wg", function(worked) {

      rtc.on("call", function(call) {
        g_call = call;
        console.log("Incoming call!");

        call.addStream(stream);
        call.answer();

        call.ready(function(stream) {
          holla.pipe(stream, $(".them"));
        });

        // Hide their video on hangup
        call.on("hangup", function() {
          console.log("Other end hung up");
          $(".them").attr("src", "");
        });

        call.on("disconnect", function() {
          console.log("Other end disconnected");
          $(".them").attr("src", "");
        });
      });

      rtc.on("disconnected", function() {
        console.log("Disconnected");
      });
      rtc.on("error", function() {
        console.log("Error");
      });
      rtc.on("connected", function() {
        console.log("Connected");
      });

      console.log("WG end ready to receive call");
    });
  });

  rtc.on("presence", function(user) {
    if (user.online) {
      console.log(user.name, "is online");
    } else {
      console.log(user.name, "went offline");
      if (user.name == "ar") {
        g_call.end();         
        $("#them").attr("src", "");
      }
    }
  });

  $("#body").click(toggleMute);
});

