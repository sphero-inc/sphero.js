"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect().then(function() {
  // roll orb in a random direction, changing direction every second
  setInterval(function() {
    var direction = Math.floor(Math.random() * 360);
    orb.roll(150, direction);
  }, 1000);
});
