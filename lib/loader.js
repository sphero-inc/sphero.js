"use strict";

function isSerialPort(str) {
  // use regexp to determine whether or not 'str' is a serial port
  return /(\/dev\/|com\d+).*/i.test(str);
}

/**
 * Loads an adaptor based on provided connection string and system state
 *
 * @param {String} conn connection string (serial port or BLE UUID)
 * @param {Object} opts for loader
 * @param {Object} [opts.peripheral=object] use an existing Noble peripheral
 * @return {Object} adaptor instance
 */
module.exports.load = function load(conn, opts) {
  var isSerial = isSerialPort(conn),
      isChrome = typeof chrome !== "undefined",
      Adaptor;

  if (isSerial) {
    Adaptor = require("./adaptors/serialport");
  } else if (isChrome) {
    // load chrome BLE adaptor
  } else {
    Adaptor = require("./adaptors/ble");
  }

  return new Adaptor(conn, opts);
};
