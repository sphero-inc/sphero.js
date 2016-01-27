"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.color({ red: 255, green: 0, blue: 255 });

  setTimeout(function() {
    console.log("color 1 - 50%");
    // sets color to the provided hex value, at 50% luminance
    orb.color(0xff0000, 50);
  }, 1000);

  setTimeout(function() {
    console.log("color 1 - 100%");
    // sets color to the same hex value, at 100% luminance
    orb.color(0xff0000, 100);
  }, 2000);

  setTimeout(function() {
    console.log("color 2 - 33%");
    // hex numbers can also be passed in strings
    orb.color("00ff00", 33);
  }, 3000);

  setTimeout(function() {
    console.log("color 2 - 100%");
    // hex numbers can also be passed in strings
    orb.color("00ff00", 100);
  }, 4000);

  setTimeout(function() {
    console.log("color 3 - 75%");
    // sets color to the provided color name
    orb.color("magenta", 75);
  }, 5000);

  setTimeout(function() {
    console.log("color 3 - 0%");
    // sets color to the provided color name
    orb.color("magenta", 0);
  }, 6000);

  setTimeout(function() {
    console.log("color 3 - 100%");
    // sets color to the provided color name
    orb.color("magenta", 100);
  }, 7000);
});
