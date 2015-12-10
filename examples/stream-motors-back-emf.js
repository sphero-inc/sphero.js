"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamMotorsBackEmf();

  orb.on("motorsBackEmf", function(data) {
    console.log("motorsBackEmf:");
    console.log("  sensor:", data.rMotorBackEmf.sensor);
    console.log("    range:", data.rMotorBackEmf.range);
    console.log("    units:", data.rMotorBackEmf.units);
    console.log("    value:", data.rMotorBackEmf.value[0]);

    console.log("  sensor:", data.lMotorBackEmf.sensor);
    console.log("    range:", data.lMotorBackEmf.range);
    console.log("    units:", data.lMotorBackEmf.units);
    console.log("    value:", data.lMotorBackEmf.value[0]);
  });

  orb.roll(180, 0);
});
