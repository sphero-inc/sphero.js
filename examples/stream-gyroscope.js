"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamGyroscope();

  orb.on("gyroscope", function(data) {
    console.log("gyroscope:");
    console.log("  sensor:", data.xGyro.sensor);
    console.log("    range:", data.xGyro.range);
    console.log("    units:", data.xGyro.units);
    console.log("    value:", data.xGyro.value[0]);

    console.log("  sensor:", data.yGyro.sensor);
    console.log("    range:", data.yGyro.range);
    console.log("    units:", data.yGyro.units);
    console.log("    value:", data.yGyro.value[0]);

    console.log("  sensor:", data.zGyro.sensor);
    console.log("    range:", data.zGyro.range);
    console.log("    units:", data.zGyro.units);
    console.log("    value:", data.zGyro.value[0]);
  });

  orb.roll(180, 0);
});
