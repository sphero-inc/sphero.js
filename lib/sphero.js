"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet");

var core = require("./devices/core"),
    sphero = require("./devices/sphero"),
    custom = require("./devices/custom"),
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
  this.busy = false;
  this.ready = false;
  this.packet = new Packet();
  this.connection = opts.adaptor || loader.load(address);
  this.callbackQueue = [];
  this.commandQueue = [];
  this.sop2Bitfield = SOP2[opts.sop2] || SOP2.answer;
  this.seqCounter = 0x00;
  this.timeout = opts.timeout || 500;

  // add commands to Sphero via mutator
  core(this);
  sphero(this);
  custom(this);
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
          var parsedPacket = self.parseAsyncData(packet);
          self.emit("async", parsedPacket);
        }
      }
    });

    connection.on("close", emit("close"));
    connection.on("error", emit("error"));

    self.emit("ready");

    if (typeof callback === "function") {
      callback();
    }
  });
};

Sphero.prototype.command = function(vDevice, cmdName, data, callback) {
  var seq = this._incSeq(),
      opts = {
        sop2: this.sop2Bitfield,
        did: vDevice,
        cid: cmdName,
        seq: seq,
        data: data
      };

  var cmdPacket = this.packet.create(opts);

  this._queueCommand(cmdPacket, callback);
  this._execCommand();
};

Sphero.prototype._queueCommand = function(cmdPacket, callback) {
  if (this.commandQueue.length === 256) {
    this.commandQueue.shift();
  }

  this.commandQueue.push({ packet: cmdPacket, cb: callback });
};

Sphero.prototype._execCommand = function() {
  var cmd;
  if (!this.busy && (this.commandQueue.length > 0)) {
    // Get the seq number from the cmd packet/buffer
    // to store the callback response in that position
    cmd = this.commandQueue.shift();
    this.busy = true;
    this._queueCallback(cmd.packet[4], cmd.cb);
    this.connection.write(cmd.packet);
  }
};

Sphero.prototype._queueCallback = function(seq, callback) {
  var cb = function(err, packet) {
    clearTimeout(this.callbackQueue[seq].timeoutId);
    this.callbackQueue[seq] = null;
    this.busy = false;

    if (typeof callback === "function") {
      if (!err && !!packet) {
        callback(null, packet);
      } else {
        var error = new Error("Command sync response was lost.");
        callback(error, null);
      }
    }

    this._execCommand();
  };

  var timeoutId = setTimeout(cb.bind(this), this.timeout);

  this.callbackQueue[seq] = {
    callback: cb.bind(this),
    timeoutId: timeoutId
  };
};

Sphero.prototype._execCallback = function(seq, packet) {
  var queue = this.callbackQueue[seq];

  if (queue) {
    queue.callback(null, packet);
  }
};

Sphero.prototype._incSeq = function() {
  if (this.seqCounter > 255) {
    this.seqCounter = 0x00;
  }

  return this.seqCounter++;
};
