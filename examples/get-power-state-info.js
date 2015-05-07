"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.getPowerState(function(err, data) {
    console.log("::POWER STATE CALLBACK::");

    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
