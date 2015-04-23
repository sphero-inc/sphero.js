"use strict";

var Sphero = require("../lib/sphero");

var sphero = Sphero("/dev/rfcomm0");

sphero.connect(function() {
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

  sphero.ping(function(err, packet) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("PING PACKET: ", packet);
  });


  setTimeout(function() {
    sphero.version(function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("VERSION PACKET: ", packet);
    });
  }, 100);

  setTimeout(function() {
    sphero.setDeviceName("r2d2-RPB", function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("SET_DEVICE_NAME PACKET: ", packet);
    });
  }, 300);

  setTimeout(function() {
    sphero.getBluetoothInfo(function(err, packet) {
      if (err) {
        console.error(err);
        return;
      }

      console.log("GET_BT_INFO PACKET: ", packet);
    });
  }, 200);

  // // sphero.setAutoReconnect(1, 5);
  // sphero.getAutoReconnect();
  // sphero.getPowerState();
  // sphero.setPowerNotification(1);
  // sphero.sleep(10, 0, 0);
});
