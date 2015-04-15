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
} catch (err) {
  debug("Error while attempting to load SerialPort", err);
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
 * @return null
 */
Adaptor.prototype.open = function open(callback) {
  this.serialport = new SerialPort(this.conn, {});

  this.debug("opening serial port");

  this.serialport.on("open", function(err) {
    if (err) {
      this.debug("error opening serial port: " + err);
      callback(err);
      return;
    }

    this.debug("opened serial port");
    this.emit("open");
    callback();
  }.bind(this));
};

/**
 * Writes data to the serialport.
 * Triggers the provided callback when done.
 *
 * @param {Any} data
 * @param {Function} callback
 * @return null
 */
Adaptor.prototype.write = function write(data, callback) {
  this.debug("writing data to serialport - " + data);
  this.serialport.write(data, callback);
};

/**
 * Adds a listener to the serialport's "data" event.
 * The provided callback will be triggered whenever the serialport reads data
 *
 * @param {Function} callback
 * @return null
 */
Adaptor.prototype.read = function read(callback) {
  this.debug("adding data event handler");
  this.serialport.on("data", callback);
};
