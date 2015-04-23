"use strict";

var SerialPort = require("serialport").SerialPort,
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet");

var coreDevice = require("./devices/core");

var SOP2 = {
  answer: 0xFD,
  resetTimeout: 0xFE,
  both: 0xFF,
  none: 0xFC,
  sync: 0xFF,
  async: 0xFE
};

var Sphero = function(address, opts) {
  opts = opts || {};
  this.ready = false;
  this.packet = new Packet();
  this.connection = new SerialPort(address, {}, false);
  this.callbacks = new Array(256);
  this.sop2Bitfield = SOP2[opts.sop2] || SOP2.answer;
  this.seqCounter = 0x00;

  this.core = coreDevice("something");
  this._bindDevice(this.core);
};

util.inherits(Sphero, EventEmitter);

module.exports = function(address, options) {
  return new Sphero(address, options);
};

Sphero.prototype.connect = function(callback) {
  this.packet.on("error", function() {
    this.emit("error");
  }.bind(this));

  this.connection.open(function() {
    this.ready = true;

    this.connection.on("data", function(payload) {

      this.emit("data", payload);

      var packet = this.packet.parse(payload);

      if (!!packet && packet.sop1) {
        // this is a sync response package
        if (packet.sop2 === SOP2.sync) {
          this.emit("response", packet);
          this._execCallback(packet.seq, packet);
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

    if (typeof callback === "function") {
      callback();
    }

    this.ready = true;
    this.emit("ready");

  }.bind(this));
};

Sphero.prototype._incSeq = function() {
  var counter = this.seqCounter++;

  if (counter > 255) {
    this.seqCounter = counter & 0x00;
  }

  return counter;
};

Sphero.prototype._queueCallback = function(seq, callback) {
  var cb = function(err, packet) {
    clearTimeout(this.callbacks[seq].timeoutId);
    this.callbacks[seq] = null;
    if (typeof callback === "function") {
      if (!err && !!packet) {
        callback(null, packet);
      } else {
        var error = new Error("Command sync response was lost.");
        callback(error, null);
      }
    }
  };

  var timeoutId = setTimeout(cb.bind(this), 100);

  this.callbacks[seq] = {
    callback: cb.bind(this),
    timeoutId: timeoutId
  };
};

Sphero.prototype._execCallback = function(seq, packet) {
  this.callbacks[seq].callback(null, packet);
};

Sphero.prototype._bindDevice = function(device) {
  for (var prop in device) {
    if (!this.hasOwnProperty(prop)) {
      this[prop] = device[prop];

      if (typeof this[prop] === "function") {
        this[prop].bind(this);
      }
    }
  }
};
