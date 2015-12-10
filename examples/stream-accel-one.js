"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamAccelOne();

  orb.on("accelOne", function(data) {
    console.log("accelOne:");
    console.log("  sensor:", data.accelOne.sensor);
    console.log("  range:", data.accelOne.range);
    console.log("  units:", data.accelOne.units);
    console.log("  value:", data.accelOne.value[0]);
  });

  orb.roll(180, 0);
});
