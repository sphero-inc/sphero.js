"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.streamMotorsBackEmf();

  orb.on("motorsBackEmf", function(data) {
    console.log("::STREAMING MOTORS BACK EMF::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
