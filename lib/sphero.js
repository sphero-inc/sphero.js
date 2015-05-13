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

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Sphero = module.exports = function Sphero(address, opts) {
  // check that we were called with 'new'
  classCallCheck(this, Sphero);

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

Sphero.prototype.connect = function(callback) {
  var self = this,
      connection = this.connection,
      packet = this.packet;

  function emit(name) {
    return self.emit.bind(self, name);
  }

  packet.on("error", emit("error"));

  connection.open(function() {
    self.ready = true;

    connection.onRead(function(payload) {
      self.emit("data", payload);

      var parsedPayload = packet.parse(payload),
          parsedData, cmd;

      if (parsedPayload && parsedPayload.sop1) {
        if (parsedPayload.sop2 === SOP2.sync) {
          // synchronous packet
          self.emit("response", parsedPayload);
          cmd = self._responseCmd(parsedPayload.seq);
          parsedData = packet.parseResponseData(cmd, parsedPayload);
          self._execCallback(parsedPayload.seq, parsedData);
        } else if (parsedPayload.sop2 === SOP2.async) {
          // async packet
          parsedData = packet.parseAsyncData(parsedPayload);
          self.emit("async", parsedData);
        }
        self.emit(parsedData.event, parsedData);
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
    this._queueCallback(cmd.packet, cmd.cb);
    this.connection.write(cmd.packet);
  }
};

Sphero.prototype._queueCallback = function(cmdPacket, callback) {
  var seq = cmdPacket[4];

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
    timeoutId: timeoutId,
    did: cmdPacket[2],
    cid: cmdPacket[3]
  };
};

Sphero.prototype._execCallback = function(seq, packet) {
  var queue = this.callbackQueue[seq];

  if (queue) {
    queue.callback(null, packet);
  }
};

Sphero.prototype._responseCmd = function(seq) {
  var queue = this.callbackQueue[seq];

  return { did: queue.did, cid: queue.cid };
};

Sphero.prototype._incSeq = function() {
  if (this.seqCounter > 255) {
    this.seqCounter = 0x00;
  }

  return this.seqCounter++;
};
