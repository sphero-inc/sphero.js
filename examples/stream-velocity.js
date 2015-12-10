"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamVelocity();

  orb.on("velocity", function(data) {
    console.log("velocity:");
    console.log("  sensor:", data.xVelocity.sensor);
    console.log("    range:", data.xVelocity.range);
    console.log("    units:", data.xVelocity.units);
    console.log("    value:", data.xVelocity.value[0]);

    console.log("  sensor:", data.yVelocity.sensor);
    console.log("    range:", data.yVelocity.range);
    console.log("    units:", data.yVelocity.units);
    console.log("    value:", data.yVelocity.value[0]);
  });

  orb.roll(180, 0);
});
