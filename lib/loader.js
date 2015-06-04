"use strict";

function isSerialPort(str) {
  // use regexp to determine whether or not 'str' is a serial port
  return /(\/dev\/|com\d+).*/i.test(str);
}

/**
 * Loads an adaptor based on provided connection string and system state
 *
 * @param {String} conn connection string (serial port or BLE UUID)
 * @return {Object} adaptor instance
 */
module.exports.load = function load(conn) {
  var isSerial = isSerialPort(conn),
      isChrome = typeof chrome !== "undefined",
      Adaptor;

  if (isSerial) {
    Adaptor = require("./adaptors/serialport");
  } else if (isChrome) {
    // load chrome BLE adaptor
  } else {
    // load BLE adaptor (noble?)
  }

  return new Adaptor(conn);
};
