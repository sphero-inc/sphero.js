"use strict";

var sphero = require("../");
var orb = sphero(process.env.PORT);

orb.connect().then(function() {
  return orb.color({ red: 255, green: 0, blue: 255 });
}).then(function() {
  return orb.getBluetoothInfo();
}).then(function(data) {
  console.log("bluetoothInfo:");
  console.log("  name:", data.name);
  console.log("  btAddress:", data.btAddress);
  console.log("  separator:", data.separator);
  console.log("  colors:", data.colors);
});
