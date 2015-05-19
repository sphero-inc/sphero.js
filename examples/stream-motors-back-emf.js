"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.streamVelocity();
  orb.streamMotorsBackEmf();

  orb.on("motorsBackEmf", function(data) {
    console.log("::STREAMING MOTORS BACK EMF::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
