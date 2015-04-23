"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet");

var coreDevice = require("./devices/core"),
    loader = require("./loader");

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
  this.connection = loader.load(address);
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
  var self = this,
      connection = this.connection;

  function emit(name) {
    return self.emit.bind(self, name);
  }

  this.packet.on("error", emit("error"));

  connection.open(function() {
    self.ready = true;

    connection.onRead(function(payload) {
      self.emit("data", payload);

      var packet = self.packet.parse(payload);

      if (packet && packet.sop1) {
        if (packet.sop2 === SOP2.sync) {
          // synchronous packet
          self.emit("response", packet);
          self._execCallback(packet.seq, packet);
        } else if (packet.sop2 === SOP2.async) {
          // async packet
          self.emit("async", packet);
        }
      }
    });

    connection.on("close", emit("close"));
    connection.on("error", emit("error"));

    connection.emit("ready");

    if (typeof callback === "function") {
      callback();
    }
  });
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
