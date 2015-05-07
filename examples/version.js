"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.version(function(err, data) {
    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
