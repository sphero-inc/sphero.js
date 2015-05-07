"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.color("FF00FF");
  orb.getBluetoothInfo(function(err, data) {
    console.log("::BLUETOOTH INFO::");
    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
