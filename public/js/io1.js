console.log('rtc:', rtc);

// Create my local stream
rtc.createStream({'video':true, 'audio':true}, function(stream) {
  console.log('in createStream callback, stream is', stream);
  rtc.attachStream(stream, 'local');
});

// Connect to the server
rtc.connect('ws://localhost:8080', 'tunnel');

// Callback when someone else connects
rtc.on('add remote stream', function(stream) {
  console.log('in remote stream callback, stream is', stream);
  rtc.attachStream(stream, 'remote');
});


