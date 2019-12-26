"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamQuaternions();

  orb.on("quaternions", function(data) {
    console.log("quaternions:");
    console.log("  sensor:", data.quaternionQ0.sensor);
    console.log("    range:", data.quaternionQ0.range);
    console.log("    units:", data.quaternionQ0.units);
    console.log("    value:", data.quaternionQ0.value[0]);

    console.log("  sensor:", data.quaternionQ1.sensor);
    console.log("    range:", data.quaternionQ1.range);
    console.log("    units:", data.quaternionQ1.units);
    console.log("    value:", data.quaternionQ1.value[0]);

    console.log("  sensor:", data.quaternionQ2.sensor);
    console.log("    range:", data.quaternionQ2.range);
    console.log("    units:", data.quaternionQ2.units);
    console.log("    value:", data.quaternionQ2.value[0]);

    console.log("  sensor:", data.quaternionQ3.sensor);
    console.log("    range:", data.quaternionQ3.range);
    console.log("    units:", data.quaternionQ3.units);
    console.log("    value:", data.quaternionQ3.value[0]);
  });

  orb.roll(180, 0);
});
