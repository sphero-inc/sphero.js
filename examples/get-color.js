"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect(function() {
  // sets color to the provided r/g/b values
  orb.getColor(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Color is:", data.color);
    }
  });
});
