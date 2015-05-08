"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.setRGBLed({ red: 0x50, green: 0xA0, blue: 0xF0 }, function() {
    orb.getRGBLed(function(err, data) {
      if (err) {
        console.log("the error:", err);
      }
      console.log("Data:", data);
    });
  });
});

