"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.color({ red: 255, green: 0, blue: 255 });

  setTimeout(function() {
    // sets color to the provided hex value
    orb.color(0xff0000);
  }, 2000);

  setTimeout(function() {
    // hex numbers can also be passed in strings
    orb.color("00ff00");
  }, 4000);

  setTimeout(function() {
    // sets color to the provided color name
    orb.color("magenta");
  }, 6000);
});
