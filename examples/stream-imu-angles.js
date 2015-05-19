"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.streamIMUAngles();

  orb.on("imuAngles", function(data) {
    console.log("::STREAMING IMU ANGLES::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
