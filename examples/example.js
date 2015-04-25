"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  console.log("::CONNECT EVENT::");

  // sphero.on("response", function(packet) {
  //   console.log("::RESPONSE PACKET::");
  //   console.log("  Packet:", packet);
  // });
  //
  // sphero.on("async", function(packet) {
  //   console.log("::ASYNC PACKET::");
  //   console.log("  Packet:", packet);
  // });

  orb.ping(function(err, packet) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("PING PACKET: ", packet);
  });


  setTimeout(function() {
    orb.version(function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("VERSION PACKET: ", packet);
    });
  }, 100);

  setTimeout(function() {
    orb.setDeviceName("r2d2-RPB", function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("SET_DEVICE_NAME PACKET: ", packet);
    });
  }, 300);

  setTimeout(function() {
    orb.getBluetoothInfo(function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("GET_BT_INFO PACKET: ", packet);
    });
  }, 200);

  // //orb.setAutoReconnect(1, 5);
  // orb.getAutoReconnect();
  // orb.getPowerState();
  // orb.setPowerNotification(1);
  // orb.sleep(10, 0, 0);
});
