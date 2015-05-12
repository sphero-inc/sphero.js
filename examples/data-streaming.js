"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { timeout: 300 });

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  orb.on("dataStreaming", function(data) {
    console.log("::DATA STREAMING PACKET::");
    console.log("  Data:", data);
  });

  orb.setDataStreaming({
    n: 400,
    m: 1,
    mask1: 0x1C000000,
    pcnt: 0,
    mask2: 0x00000000
  }, function(err, data) {
    console.log("Simple response err:", err);
    console.log("Simple response data:", data);
  });
});
