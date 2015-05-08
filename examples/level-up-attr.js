"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.levelUpAttr(1234567, 10, function(err, data) {
    console.log("::LEVEL UP ATTR CALLBACK::");

    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
