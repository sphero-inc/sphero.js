"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect().then(function() {
  return orb.color("FF00FF");
}).then(function() {
  return orb.getBluetoothInfo();
}).then(function(data) {
  console.log("bluetoothInfo:");
  console.log("  name:", data.name);
  console.log("  btAddress:", data.btAddress);
  console.log("  separator:", data.separator);
  console.log("  colors:", data.colors);
}).catch(function(err) {
  console.error("err:", err);
});
