"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.runL2Diags(function(err, data) {
    console.log("::LLEVEL 1 DIAGNOSTICS CALLBACK::");

    if (err) {
      console.log("err ->", err);
    }

    console.log("Data --->", data);
  });
});
