"use strict";

var util = require("../lib/utils.js");

var value = 0;

for (var i = 0; i <= 255; i++) {
  value = util.intToHexArray(i, 4);
  console.log("value " + i + " in hexArray ==>", value);
}

value = util.intToHexArray(256, 1);
console.log("value " + i + " in hexArray ==>", value);
