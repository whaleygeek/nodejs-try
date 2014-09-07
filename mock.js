// FILE: mock.js  07/09/2014  D.J.Whale
//
// A mock "accelerometer". Generates events at 12.5Hz
// just like the "accel-mma84"

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var RATEMS = 80; // 12.5Hz as per accel default rate


function Accelerometer (hardware, callback) {
  console.log("new Accelerometer mock");
  var self = this;
  
  self.on('newListener', 
    function(event) {
      //console.log("accel: addListener:" + event);
    }
  );  
}

util.inherits(Accelerometer, EventEmitter);

function use(hardware, callback) {
  //console.log("use mock.js");
  a = new Accelerometer(hardware, callback);
  
  var reported_ready = false;
  
  // Generate mock accel events for testing

  t = setInterval(
    function() {
      if (! reported_ready) {
        a.emit("ready");
        reported_ready = true;
      }
      else {
        var xyz = [10, 20, 30];
        a.emit('data', xyz);
      }
    }, RATEMS
  );
  return a;  
}

exports.Accelerometer = Accelerometer;
exports.use = use;

// END mock.js

