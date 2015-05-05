"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.on("collision", function(data) {
    console.log("::COLLISION PACKET::");
    console.log("  Data:", data);
    orb.setRGBLed({red: 0xFF, green: 0x00, blue: 0x00});
    setTimeout(function() {
      orb.setRGBLed({red: 0x00, green: 0x00, blue: 0xFF});
    }, 1000);
  });

  orb.detectCollisions();
});
