"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.color({ red: 255, green: 0, blue: 0 });

  setTimeout(function() {
    console.log("color 1");
    // sets color to the provided hex value
    orb.color(0x0000ff);
  }, 1000);

  setTimeout(function() {
    console.log("color 2");
    // hex numbers can also be passed in strings
    orb.color("000000");
  }, 2000);

  setTimeout(function() {
    // sets color to the provided color name
    orb.sleep(0, 0, 0);
    orb.disconnect(function() { console.log("bye!");});
    process.exit();
  }, 3000);

});
