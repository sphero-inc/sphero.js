"use strict";

var SerialPort = require("serialport").SerialPort;

var vDevices = {
  core: 0x00,
  bootloader: 0x01,
  sphero: 0x02
};

var commands = require("./commands");

var Sphero = module.exports = function(address, opts) {
  this.opts = opts;
  this.connection = new SerialPort(address);
};

Sphero.prototype.connect = function() {
  this.connection.connect();
};

Sphero.prototype.ping = function() {

};
