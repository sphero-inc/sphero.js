var Sphero = require("../lib/sphero");

var sphero= new Sphero("/dev/rfcomm0");

sphero.connect( function() {
  console.log("::CONNECT EVENT::");

  sphero.on("data", function(payload) {
    console.log("::DATA EVENT::");
    //console.log("data payload: ", payload);
    var res = sphero.packet.parse(payload);

    console.log("Response Packet:", res);

    if (!!res && !!res.data) {
      console.log("Data string:", res.data.toString());
    } else {
      console.log("Waiting for more data:", res);
    }
  });

  //var buffer = packet.command(0x20, [0xFF, 0x00, 0xFF, 0x01], { sop2: 0xFF });

  // serialport.write(buffer, function(err, results) {
  //   console.log("err " + err);
  //   console.log("results ", results);
  // });

  // sphero.ping();
  // sphero.version();

  //sphero.setDeviceName("EsfirationRPB");

  //setTimeout(function() {
    //console.log("GET INFO!!!");
    sphero.getBluetoothInfo();
  //}, 2000);

  //sphero.setAutoReconnect(1, 5);
  //sphero.getAutoReconnect(1, 5);
  sphero.getPowerState(1, 5);
  sphero.setPowerNotification(1);
  //sphero.sleep(10, 0, 0);
});
