"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var serialport,
    isChrome = typeof chrome !== "undefined";

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (isChrome) {
    serialport = require("browser-serialport");
  } else {
    serialport = require("serialport");
  }
} catch (error) {
  serialport = null;
}

if (serialport == null) {
  var err = [
    "It looks like you want to connect to a Sphero 1.0/2.0 or Sphero SPRK,",
    "but did not install the 'node-serialport' module.", "",
    "To install it run this command:",
    "npm install serialport", "",
    "For more information go to https://github.com/voodootikigod/node-serialport#to-install"
  ].join("\n");

  console.error(err);
  throw new Error("Missing serialport dependency");
}

/**
 * An adaptor to communicate with a serial port
 *
 * @constructor
 * @param {String} conn the serialport string to connect to
 */
var Adaptor = module.exports = function Adaptor(conn) {
  this.conn = conn;
  this.serialport = null;
};

util.inherits(Adaptor, EventEmitter);

/**
 * Opens a connection to the serial port.
 * Triggers the provided callback when ready.
 *
 * @param {Function} callback (err)
 * @return {void}
 */
Adaptor.prototype.open = function open(callback) {
  var self = this,
      port = this.serialport = new serialport.SerialPort(this.conn, {});

  function emit(name) {
    return self.emit.bind(self, name);
  }

  port.on("open", function(error) {
    if (error) {
      callback(error);
      return;
    }

    self.emit("open");

    port.on("error", emit("error"));
    port.on("close", emit("close"));
    port.on("data", emit("data"));

    callback();
  });
};

/**
 * Writes data to the serialport.
 * Triggers the provided callback when done.
 *
 * @param {Any} data info to be written to the serialport. turned into a buffer.
 * @param {Function} [callback] triggered when write is complete
 * @return {void}
 */
Adaptor.prototype.write = function write(data, callback) {
  this.serialport.write(data, callback);
};

/**
 * Adds a listener to the serialport's "data" event.
 * The provided callback will be triggered whenever the serialport reads data
 *
 * @param {Function} callback function to be invoked when data is read
 * @return {void}
 */
Adaptor.prototype.onRead = function onRead(callback) {
  this.on("data", callback);
};

/**
 * Disconnects from the serialport
 * The provided callback will be triggered after disconnecting
 *
 * @param {Function} callback function to be invoked when disconnected
 * @return {void}
 */
Adaptor.prototype.close = function close(callback) {
  this.serialport.close(callback);
};
