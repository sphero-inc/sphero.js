"use strict";

var debug = require("debug")("adaptor:serialport");

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var SerialPort,
    isChrome = typeof chrome !== "undefined";

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (isChrome) {
    debug("Loading browser-serialport");
    SerialPort = require("browser-serialport").SerialPort;
  } else {
    debug("Loading serialport");
    SerialPort = require("serialport").SerialPort;
  }
} catch (error) {
  debug("Error while attempting to load SerialPort", error);
  SerialPort = null;
}

if (SerialPort == null) {
  var err = [
    "It looks like serialport didn't compile properly.",
    "This is a common problem, and it's fix is documented here:",
    "https://github.com/voodootikigod/node-serialport#to-install"
  ].join(" ");

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
  debug("Creating new instance with conn " + conn);

  this.conn = conn;
  this.serialport = null;
  this.debug = require("debug")("adaptor:serialport:" + conn);
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
      serialport = this.serialport = new SerialPort(this.conn, {});

  self.debug("opening serial port");

  function emit(name) {
    return self.emit.bind(self, name);
  }

  serialport.on("open", function(error) {
    if (error) {
      self.debug("error opening serial port: " + error);
      callback(error);
      return;
    }

    self.debug("opened serial port");
    self.emit("open");

    serialport.on("error", emit("error"));
    serialport.on("close", emit("close"));
    serialport.on("data", emit("data"));

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
  this.debug("writing data to serialport - " + data);
  this.serialport.write(data, callback);
};

/**
 * Adds a listener to the serialport's "data" event.
 * The provided callback will be triggered whenever the serialport reads data
 *
 * @param {Function} callback function to be invoked when data is read
 * @return {void}
 */
Adaptor.prototype.onRead = function read(callback) {
  this.debug("adding data event handler");
  this.on("data", callback);
};
