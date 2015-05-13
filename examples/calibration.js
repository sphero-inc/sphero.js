"use strict";

var sphero = require("../");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  orb.startCalibration();
  setTimeout(orb.finishCalibration, 5000);
});
