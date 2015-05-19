"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.streamAccelOne();

  orb.on("accelOne", function(data) {
    console.log("::STREAMING ACCELONE::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
