"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.color({ red: 255, green: 0, blue: 255 });

  setTimeout(function() {
    console.log("color 1");
    // sets color to the provided hex value
    orb.color(0xff0000);
  }, 1000);

  setTimeout(function() {
    console.log("color 2");
    // hex numbers can also be passed in strings
    orb.color("00ff00");
  }, 2000);

  setTimeout(function() {
    console.log("color 3");
    // sets color to the provided color name
    orb.color("magenta");
  }, 3000);
});
