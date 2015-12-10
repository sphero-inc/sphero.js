"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamOdometer();

  orb.on("odometer", function(data) {
    console.log("odometer:");
    console.log("  sensor:", data.xOdometer.sensor);
    console.log("    range:", data.xOdometer.range);
    console.log("    units:", data.xOdometer.units);
    console.log("    value:", data.xOdometer.value[0]);

    console.log("  sensor:", data.yOdometer.sensor);
    console.log("    range:", data.yOdometer.range);
    console.log("    units:", data.yOdometer.units);
    console.log("    value:", data.yOdometer.value[0]);
  });

  orb.roll(180, 0);
});
