"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var ble,
    isChrome = typeof chrome !== "undefined";

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (isChrome) {
    // browser BLE interface here...
  } else {
    ble = require("noble");
  }
} catch (error) {
  ble = null;
}

if (ble == null) {
  var err = [
    "It looks like noble didn't install properly.",
    "For more information, please go to:",
    "https://github.com/sandeepmistry/noble"
  ].join(" ");

  console.error(err);
  throw new Error("Missing noble dependency");
}

/**
 * An adaptor to communicate with a Bluetooth LE (aka 4.x) Interface
 *
 * @constructor
 * @param {String} address the BLE address to connect to
 */
var Adaptor = module.exports = function Adaptor(address) {
  this.address = address;
//  this.serialport = null;
};

util.inherits(Adaptor, EventEmitter);

/**
 * Opens a connection to the BLE device.
 * Triggers the provided callback when ready.
 *
 * @param {Function} callback (err)
 * @return {void}
 */
Adaptor.prototype.open = function open(callback) {
  callback();
};

/**
 * Writes data to the BLE device.
 * Triggers the provided callback when done.
 *
 * @param {Any} data info to be written to the device. turned into a buffer.
 * @param {Function} [callback] triggered when write is complete
 * @return {void}
 */
Adaptor.prototype.write = function write(data, callback) {
  callback();
};

/**
 * Adds a listener to the BLE's "notify" event.
 * The provided callback will be triggered whenever the BLE device receives data
 *
 * @param {Function} callback function to be invoked when data is read
 * @return {void}
 */
Adaptor.prototype.onRead = function onRead(callback) {
  callback();
};

/**
 * Disconnects from the BLE device
 * The provided callback will be triggered after disconnecting
 *
 * @param {Function} callback function to be invoked when disconnected
 * @return {void}
 */
Adaptor.prototype.close = function close(callback) {
  callback();
};
