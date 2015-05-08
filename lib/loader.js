"use strict";

var debug = require("debug")("loader");

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
    debug("Loading serialport adaptor for connection: " + conn);
    Adaptor = require("./adaptors/serialport");
  } else if (isChrome) {
    debug("Loading Chrome BLE adaptor for connection: " + conn);
    // load chrome BLE adaptor
  } else {
    debug("Loading BLE adaptor for connection: " + conn);
    // load BLE adaptor (noble?)
  }

  return new Adaptor(conn);
};
