"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  var opts = {
    flags: 0x01,
    x: 0x0000,
    y: 0x0000,
    yawTare: 0x0
  };

  orb.configureLocator(opts);

  setInterval(function() {
    orb.readLocator(function(err, data) {
      if (err) {
        console.log("error: ", err);
      } else {
        console.log("readLocator:");
        console.log("  xpos:", data.xpos);
        console.log("  ypos:", data.ypos);
        console.log("  xvel:", data.xvel);
        console.log("  yvel:", data.yvel);
        console.log("  sog:", data.sog);
      }
    });
  }, 1000);
});
