var Sphero = require("../lib/sphero");

var sphero= new Sphero("/dev/rfcomm0");

sphero.connect( function() {
  console.log("::CONNECT EVENT::");

  sphero.on("data", function(payload) {
    console.log("::DATA EVENT::");
    console.log("  Payload:", payload);
  });

  sphero.on("response", function(packet) {
    console.log("::RESPONSE PACKET::");
    console.log("  Packet:", packet);
  });

  sphero.on("async", function(packet) {
    console.log("::ASYNC PACKET::");
    console.log("  Packet:", packet);
  });

  var callback = function(err, data){
    console.log("Error: ", err);
    console.log("Data: ", data);
  };

  sphero.ping(callback);
  sphero.version(callback);

  sphero.setDeviceName("bb8RPB");

  setTimeout(function() {
    sphero.getBluetoothInfo(callback);
  }, 2000);

  //sphero.setAutoReconnect(1, 5);
  //sphero.getAutoReconnect(1, 5);
  sphero.getPowerState(1, 5, callback);
  sphero.setPowerNotification(1, callback);
  //sphero.sleep(10, 0, 0);
});
