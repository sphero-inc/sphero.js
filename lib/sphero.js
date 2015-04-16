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
      this.emit("error", err);
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
};

Sphero.prototype.getPowerState = function () {
  this._coreCommand(commands.core.getPwrState);
};

Sphero.prototype.setPowerNotification = function (flag) {
  this._coreCommand(commands.core.setPwrNotify, [flag]);
};

Sphero.prototype.sleep = function (wakeup, macro, orbBasic) {
  wakeup = this.intToHexArray(wakeup, 2);
  orbBasic = this.intToHexArray(wakeup, 2);

  var data = [].concat(wakeup, macro, orbBasic);

  this._coreCommand(commands.core.sleep, data);
};

Sphero.prototype.getVoltageTripPoints = function () {
  this._coreCommand(commands.core.getPowerTrips);
};

Sphero.prototype.setVoltageTripPoints = function (vLow, vCrit) {
  vLow = this.intToHexArray(vLow, 2);
  vCrit = this.intToHexArray(vCrit, 2);

  var data = [].concat(vLow, vCrit);

  this._coreCommand(commands.core.setPowerTrips, data);
};

Sphero.prototype.setInactivityTimeout = function (time) {
  var data = this.intToHexArray(time, 2);
  this._coreCommand(commands.core.setInactiveTimer, data);
};

Sphero.prototype.jumpToBotloader = function () {
  this._coreCommand(commands.core.goToBl);
};

Sphero.prototype.runL1Diags = function () {
  this._coreCommand(commands.core.runL1Diags);
};

Sphero.prototype.runL2Diags = function () {
  this._coreCommand(commands.core.runL2Diags);
};

Sphero.prototype.clearCounters = function () {
  this._coreCommand(commands.core.clearCounters);
};

Sphero.prototype.assignTime = function (time) {
  var data = this.intToHexArray(time, 4);
  this._coreCommand(commands.core.assignTime, data);
};

Sphero.prototype.pollPacketTimes = function (time) {
  var data = this.intToHexArray(time, 4);
  this._coreCommand(commands.core.clearCounters, data);
};

Sphero.prototype.intToHexArray = function(val, bytes) {
  var byteFrame = 0xF,
      hexStr = "",
      hexArray = [];

  for(var i = 1; i < bytes; i++) {
    byteFrame <<= 8;
    byteFrame &= 0xF;
  }

  val &= byteFrame;

  hexStr = 0x0000 + (val.toString(16).toUpperCase());

  for (i = 0; i < hexStr.length; ++i) {
    hexArray[i] = hexStr.charCodeAt(i);
  }

  return hexArray;
};
