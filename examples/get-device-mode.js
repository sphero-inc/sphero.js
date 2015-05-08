"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.getDeviceMode(function(err, data) {
    console.log("::DEVICE MODE CALLBACK::");
    if (err) {
      console.log("the error:", err);
    }
    console.log("Data:", data);
  });
});

