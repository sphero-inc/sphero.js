"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamAccelOne();

  orb.on("accelOne", function(data) {
    console.log("::STREAMING ACCELONE::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
