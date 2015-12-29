"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.detectFreefall();

  orb.on("freefall", function(data) {
    console.log("freefall detected");
    console.log("  data:", data);
  });
});
