"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.color({ red: 255, green: 0, blue: 255 });

  setTimeout(function() {
    console.log("color 1 -50% luminance");
    // sets color to the provided hex value, at -50% luminance
    orb.color(0xcc0000, -0.5);
  }, 1000);

  setTimeout(function() {
    console.log("color 1 normal% luminance");
    // sets color to the same hex value, at +50% luminance
    orb.color(0xcc0000, 0);
  }, 2000);

  setTimeout(function() {
    console.log("color 1 +50% luminance");
    // sets color to the same hex value, at +50% luminance
    orb.color(0xcc0000, 0.5);
  }, 3000);

  setTimeout(function() {
    console.log("color 2 -50% luminance");
    // hex numbers can also be passed in strings
    orb.color("00cc00", -0.5);
  }, 4000);

  setTimeout(function() {
    console.log("color 2 normal% luminance");
    // hex numbers can also be passed in strings
    orb.color("00cc00", 0);
  }, 5000);

  setTimeout(function() {
    console.log("color 2 +50% luminance");
    // hex numbers can also be passed in strings
    orb.color("00cc00", 0.5);
  }, 6000);

  setTimeout(function() {
    console.log("color 3 -50% luminance");
    // sets color to the provided color name
    orb.color("magenta", -0.5);
  }, 7000);

  setTimeout(function() {
    console.log("color 3 normal% luminance");
    // sets color to the provided color name
    orb.color("magenta", 0);
  }, 8000);

  setTimeout(function() {
    console.log("color 3 +50% luminance");
    // sets color to the provided color name
    orb.color("magenta", 0.5);
  }, 9000);
});
