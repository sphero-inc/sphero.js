"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect().then(function() {
  return orb.color({ red: 255, green: 0, blue: 255 });
}).delay(1000).then(function() {
  console.log("color 1");
  // sets color to the provided hex value
  return orb.color(0xff0000);
}).delay(1000).then(function() {
  console.log("color 2");
  // hex numbers can also be passed in strings
  return orb.color("00ff00");
}).delay(1000).then(function() {
  console.log("color 3");
  // sets color to the provided color name
  return orb.color("magenta");
});
