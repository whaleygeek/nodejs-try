// FILE: capture.js  07/09/2014  D.J.Whale
//
// Capture data from an accelerometer.
// If there is an active http connection, send data to it in CSV format.
// Only one active connection is supported, in order to limit the
// bandwidth requirements of the wifi interface to a sustainable rate.


var http = require('http');

//##### Put this back: to use real hardware
//var tessel = require('tessel');
//var accel = require('accel-mma84').use(tessel.port['A']);

//##### Remove this: Use a mock accel object for testing
var accel = require("./mock").use();

// We only allow one active streaming response at any one time
var active_response = null;

// Create a new HTTP server with a request listener
var server = http.createServer(
  function (request, response) {
    console.log("http: incoming");
    
    // Only allow one open incoming connection streaming data
    if (active_response != null) {
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.end("already in use, go away!");
      return;
    }
    
    // This is the only connection, so stream data
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("seq,x,y,z\n");
    
    // Make sure if the client closes, we terminate our live stream
    response.on("close",
      function() {
        active_response = null;
        console.log("http: closed");
      }
    );
    active_response = response;  
  }
);


// Event handlers for accelerometer

accel.on("ready", 
  function() {
    console.log("accel: ready");
  }
);

accel.on("error", 
  function(err) {
    console.log("accel: error=", err);
  }
);

var sequence = 0
accel.on("data", 
  function(xyz) {
    console.log("accel: data=" + xyz);
    sequence = (sequence+1)%99;
    // If there is an active response stream, stream data to it
    if (active_response != null) {
      active_response.write(
          sequence.toFixed(0)+','
        + xyz[0].toFixed(2)+','
        + xyz[1].toFixed(2)+','
        + xyz[2].toFixed(2)+'\n');
    }
  }
); 


// Start the HTTP server (0.0.0.0 means "all interfaces")
server.listen(8080, '0.0.0.0');
console.log("http: running");


//END capture.js







