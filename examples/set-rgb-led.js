"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.setRGBLed(0xFF, 0x00, 0x00, function() {
    orb.getRGBColor(function(err, packet) {
      if (err) {
        console.log("the error:", err);
      }
      console.log("Packet contents:", packet);
      console.log("And the color is:", packet.data);
    });
  });
});

