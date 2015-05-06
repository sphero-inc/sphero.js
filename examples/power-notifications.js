"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.setPowerNotification(1);

  orb.on("battery", function(data) {
    console.log("::BATTERY PACKET::");
    console.log("  Data:", data);
    orb.setRGBLed({red: 0x00, green: 0x00, blue: 0xFF});
    setTimeout(function() {
      orb.setRGBLed({red: 0x00, green: 0xFF, blue: 0x00});
    }, 1000);
  });
});
