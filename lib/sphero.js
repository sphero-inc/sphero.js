"use strict";

var SerialPort = require("serialport").SerialPort;
var util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet");

var vDevices = {
  core: 0x00,
  bootloader: 0x01,
  sphero: 0x02
};

var SOP2 = {
  answer: 0xFD,
  resetTO: 0xFE,
  answerAndRTO: 0xFF
};

var commands = require("./commands");

var Sphero = module.exports = function(address, opts) {
  this.opts = opts;
  this.ready = false;
  this.packet = new Packet();
  this.connection = new SerialPort(address, {}, false);
};

util.inherits(Sphero, EventEmitter);

Sphero.prototype.connect = function(callback) {
  this.connection.open(function() {

    this.emit("connect");
    this.ready = true;

    this.connection.on("data", function(payload) {
      this.emit("data", payload);
    }.bind(this));

    this.connection.on("close", function(data) {
      this.emit("close", data);
    }.bind(this));

    this.connection.on("error", function(err) {
      console.log("ERROR ==>", err);
      this.emit("error");
    }.bind(this));

    if (typeof(callback) === "function") {
      callback();
    }

  }.bind(this));
};

Sphero.prototype.ping = function() {
  var opts = {
    did: vDevices.core,
    cid: commands.core.ping,
    sop2: SOP2.answer
  };

  var command = this.packet.create(opts);

  console.log("command: ", command);
  this.connection.write(command);
};


Sphero.prototype.version = function() {
  var opts = {
    did: vDevices.core,
    cid: commands.core.version,
    sop2: SOP2.answer
  };

  var command = this.packet.create(opts);

  console.log("command: ", command);
  this.connection.write(command);
};
