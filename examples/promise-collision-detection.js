"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect().then(orb.detectCollisions).then(function() {
  return orb.color("green");
}).then(function() {
  return orb.roll(155, 0);
});

orb.on("collision", function(data) {
  console.log("collision detected");
  console.log("  data:", data);

  orb.color("red").delay(100).then(function() {
    return orb.color("green");
  });
});
