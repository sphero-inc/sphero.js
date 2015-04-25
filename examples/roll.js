"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.roll(255, 0x00, function(err, packet) {
    if (err) {
      console.log("the error:", err);
    }
    console.log("Packet contents:", packet);
    console.log("The orb is rolling!!!");
  });
});

