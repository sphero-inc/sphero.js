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
      this.emit("error");
    }.bind(this));

    if (typeof(callback) === "function") {
      callback();
    }

  }.bind(this));
};

Sphero.prototype._coreCommand = function(commandName, data) {
  var opts = {
    did: vDevices.core,
    cid: commandName,
    sop2: SOP2.answer,
    data: data
  };

  var commandPacket = this.packet.create(opts);

  this.connection.write(commandPacket);
};
Sphero.prototype.ping = function() {
  this._coreCommand(commands.core.ping);
};

Sphero.prototype.version = function() {
  this._coreCommand(commands.core.version);
};

Sphero.prototype.controlUARTTx =  function() {
  this._coreCommand(commands.core.controlUARTTx);
};

Sphero.prototype.setDeviceName =  function(name) {
  var data = [];

  for (var i = 0; i < name.length; ++i) {
    data[i] = name.charCodeAt(i);
  }

  this._coreCommand(commands.core.setDeviceName, data);
};

Sphero.prototype.getBluetoothInfo = function() {
  this._coreCommand(commands.core.getBtInfo);
};

Sphero.prototype.setAutoReconnect = function(flag, time) {
  this._coreCommand(commands.core.setAutoReconnect, [flag, time]);
};

Sphero.prototype.getAutoReconnect = function() {
  this._coreCommand(commands.core.getAutoReconnect);
}
