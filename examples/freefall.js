"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT, {timeout: 200});

orb.connect(function() {
  orb.detectFreefall();

  orb.on("freefall", function(data) {
    console.log("freefall detected");
    console.log("  data:", data);
  });

  orb.on("landed", function(data) {
    console.log("landing detected");
    console.log("  data:", data);
  });

});
