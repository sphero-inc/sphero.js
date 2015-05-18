"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  var max = 0,
      updating = false;

  // enable streaming of velocity data
  orb.setDataStreaming({
    mask1: 0x00000000,
    mask2: 0x01800000,
    n: 40,
    m: 1,
    pcnt: 0
  });

  orb.on("dataStreaming", function(data) {
    if (updating) { return; }

    var x = Math.abs(data.xVelocity.value),
        y = Math.abs(data.yVelocity.value);

    var localmax = Math.max(x, y);

    if (localmax > max) { max = localmax; }
  });

  function update() {
    updating = true;

    if (max < 10) {
      orb.color("white");
    } else if (max < 100) {
      orb.color("lightyellow");
    } else if (max < 150) {
      orb.color("yellow");
    } else if (max < 250) {
      orb.color("orange");
    } else if (max < 350) {
      orb.color("orangered");
    } else if (max < 450) {
      orb.color("red");
    } else {
      orb.color("darkred");
    }

    max = 0;
    updating = false;
  }

  setInterval(update, 600);
});
