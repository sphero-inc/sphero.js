"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.color("FF00FF");

  orb.version(function(err, data) {
    if (err) { console.error("err:", err); }
    else {
      console.log("version:");
      console.log("  mdl:", data.mdl);
      console.log("  hw:", data.hw);
      console.log("  msaVer:", data.msaVer);
      console.log("  msaRev:", data.msaRev);
      console.log("  bl:", data.bl);
      console.log("  bas:", data.bas);
      console.log("  macro:", data.macro);
    }
  });
});
