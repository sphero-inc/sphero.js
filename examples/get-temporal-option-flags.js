"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.getTempOptionFlags(function(err, data) {
    if (err) {
      console.log("the error:", err);
    }
    console.log("Data:", data);
  });
});

