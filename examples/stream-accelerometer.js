"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamAccelerometer();

  orb.on("accelerometer", function(data) {
    console.log("accelerometer:");
    console.log("  sensor:", data.xAccel.sensor);
    console.log("    range:", data.xAccel.range);
    console.log("    units:", data.xAccel.units);
    console.log("    value:", data.xAccel.value[0]);

    console.log("  sensor:", data.yAccel.sensor);
    console.log("    range:", data.yAccel.range);
    console.log("    units:", data.yAccel.units);
    console.log("    value:", data.yAccel.value[0]);

    console.log("  sensor:", data.zAccel.sensor);
    console.log("    range:", data.zAccel.range);
    console.log("    units:", data.zAccel.units);
    console.log("    value:", data.zAccel.value[0]);
  });

  orb.roll(180, 0);
});
