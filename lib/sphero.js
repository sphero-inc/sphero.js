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
  resetTimeout: 0xFE,
  both: 0xFF,
  none: 0xFC,
  sync: 0xFF,
  async: 0xFE
};

var commands = require("./commands");

var Sphero = module.exports = function(address, opts) {
  opts = opts || {};
  this.ready = false;
  this.packet = new Packet();
  this.connection = new SerialPort(address, {}, false);
  this.sop2Bitfield = SOP2[opts.sop2] || SOP2.answer;
};

util.inherits(Sphero, EventEmitter);

Sphero.prototype.connect = function(callback) {
  this.connection.open(function() {
    this.emit("connect");
    this.ready = true;

    this.connection.on("data", function(payload) {

      this.emit("data", payload);

      var packet = this.packet.parse(payload);

      if (!!packet && packet.sop1) {
        // this is a sync response package
        if (packet.sop2 === SOP2.sync) {
          this.emit("response", packet);
        } else if (packet.sop2 === SOP2.async) { // this is an async response
          this.emit("async", packet);
        }
      }
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

Sphero.prototype._coreCommand = function(commandName, data, callback) {
  var opts = {
    did: vDevices.core,
    cid: commandName,
    sop2: this.sop2Bitfield,
    data: data
  };

  var commandPacket = this.packet.create(opts);
  this.connection.write(commandPacket, callback);
};

Sphero.prototype.ping = function(callback) {
  this._coreCommand(commands.core.ping, null, callback);
};

Sphero.prototype.version = function(callback) {
  this._coreCommand(commands.core.version, null, callback);
};

Sphero.prototype.controlUARTTx =  function(callback) {
  this._coreCommand(commands.core.controlUARTTx, null, callback);
};

Sphero.prototype.setDeviceName =  function(name, callback) {
  var data = [];

  for (var i = 0; i < name.length; ++i) {
    data[i] = name.charCodeAt(i);
  }

  this._coreCommand(commands.core.setDeviceName, data, callback);
};

Sphero.prototype.getBluetoothInfo = function(callback) {
  this._coreCommand(commands.core.getBtInfo, null, callback);
};

Sphero.prototype.setAutoReconnect = function(flag, time, callback) {
  this._coreCommand(commands.core.setAutoReconnect, [flag, time], callback);
};

Sphero.prototype.getAutoReconnect = function(callback) {
  this._coreCommand(commands.core.getAutoReconnect, null, callback);
};

Sphero.prototype.getPowerState = function (callback) {
  this._coreCommand(commands.core.getPwrState, null, callback);
};

Sphero.prototype.setPowerNotification = function (flag, callback) {
  this._coreCommand(commands.core.setPwrNotify, [flag], callback);
};

Sphero.prototype.sleep = function (wakeup, macro, orbBasic, callback) {
  wakeup = this.intToHexArray(wakeup, 2);
  orbBasic = this.intToHexArray(wakeup, 2);

  var data = [].concat(wakeup, macro, orbBasic);

  this._coreCommand(commands.core.sleep, data, callback);
};

Sphero.prototype.getVoltageTripPoints = function (callback) {
  this._coreCommand(commands.core.getPowerTrips, null, callback);
};

Sphero.prototype.setVoltageTripPoints = function (vLow, vCrit, callback) {
  vLow = this.intToHexArray(vLow, 2);
  vCrit = this.intToHexArray(vCrit, 2);

  var data = [].concat(vLow, vCrit);

  this._coreCommand(commands.core.setPowerTrips, data, callback);
};

Sphero.prototype.setInactivityTimeout = function (time, callback) {
  var data = this.intToHexArray(time, 2);

  var cb = function(err){
    if (typeof(callback) === "function") {
      callback(err, {
        device: "core",
        deviceHex: vDevices.core,
        command: "setInactivityTimeout"
      });
    }
  };

  this._coreCommand(commands.core.setInactiveTimer, data, cb);
};

Sphero.prototype.jumpToBotloader = function (callback) {
  this._coreCommand(commands.core.goToBl, null, callback);
};

Sphero.prototype.runL1Diags = function (callback) {
  this._coreCommand(commands.core.runL1Diags, null, callback);
};

Sphero.prototype.runL2Diags = function (callback) {
  this._coreCommand(commands.core.runL2Diags, null, callback);
};

Sphero.prototype.clearCounters = function (callback) {
  this._coreCommand(commands.core.clearCounters, null, callback);
};

Sphero.prototype.assignTime = function (time, callback) {
  var data = this.intToHexArray(time, 4);
  this._coreCommand(commands.core.assignTime, data, callback);
};

Sphero.prototype.pollPacketTimes = function (time, callback) {
  var data = this.intToHexArray(time, 4);
  this._coreCommand(commands.core.clearCounters, data, callback);
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
