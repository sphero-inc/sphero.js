"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.getVoltageTripPoints(function(err, data) {
    console.log("::VOLTAGE TRIP POINTS CALLBACK::");

    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
