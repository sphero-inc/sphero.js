"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.streamGyroscope();

  orb.on("gyroscope", function(data) {
    console.log("::STREAMING GYROSCOPE::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
