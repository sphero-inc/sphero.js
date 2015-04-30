"use strict";

var sphero = require("../lib/sphero");
var orb = sphero("/dev/rfcomm0", { deadtime: 150 });

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


  orb.version(function(err, packet) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("VERSION PACKET: ", packet);
  });

  orb.setDeviceName("3pio-RPB", function(err, packet) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("SET_DEVICE_NAME PACKET: ", packet);
  });

  orb.getBluetoothInfo(function(err, packet) {
    if (err) {
      console.error(err);
      return;
    }

    console.log("GET_BT_INFO PACKET: ", packet);
    console.log("GET_BT_INFO PACKET: ", packet.data.toString());
  });

  orb.getPowerState();
  orb.setPowerNotification(1);
  orb.setRGBLed({red: 0xFF, green: 0x00, blue: 0x00});
  orb.setRGBLed({red: 0x00, green: 0xFF, blue: 0x00});
  orb.setRGBLed({red: 0x00, green: 0x00, blue: 0xFF});
  orb.getRGBColor(function(err, packet) {
    if (err) {
      console.log("error ->", err);
    }
    console.log("GET_RGB_COLOR PACKET: ", packet);
  });
});
