"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  orb.color("FF00FF");

  orb.version(function(err, data) {
    console.log("version fetched");
    if (err) { console.error("err:", err); }
    console.log("data:", data);
  });
});
