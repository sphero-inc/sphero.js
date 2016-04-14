"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet"),
    Promise = require("bluebird");

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

/**
 * Creates a new sphero instance
 *
 * @constructor
 * @private
 * @param {String} address of the connected sphero
 * @param {Object} opts for sphero setup
 * @param {Object} [opts.adaptor=serial] sets the adaptor for the connection
 * @param {Number} [opts.sop2=0xFD] sop2 to be passed to commands
 * @param {Number} [opts.timeout=500] deadtime between commands, in ms
 * @param {Boolean} [opts.emitPacketErrors=false] emit events on packet errors
 * @param {Object} [opts.peripheral=object] use an existing Noble peripheral
 * @example
 * var orb = new Sphero("/dev/rfcomm0", { timeout: 300 });
 * @returns {Sphero} a new instance of Sphero
 */
var Sphero = module.exports = function Sphero(address, opts) {
  // check that we were called with 'new'
  classCallCheck(this, Sphero);

  opts = opts || {};

  this.busy = false;
  this.ready = false;
  this.packet = new Packet();
  this.connection = opts.adaptor || loader.load(address, opts);
  this.responseQueue = [];
  this.commandQueue = [];
  this.sop2Bitfield = SOP2[opts.sop2] || SOP2.both;
  this.seqCounter = 0x00;
  this.timeout = opts.timeout || 500;
  this.emitPacketErrors = opts.emitPacketErrors || false;
  this.ds = {};

  // add commands to Sphero via mutator
  core(this);
  sphero(this);
  custom(this);
};

util.inherits(Sphero, EventEmitter);

/**
 * Establishes a connection to Sphero.
 *
 * Once connected, commands can be sent to Sphero.
 *
 * @param {Function} callback function to be triggered once connected
 * @example
 * orb.connect(function() {
 *   // Sphero is connected, tell it to do stuff!
 *   orb.color("magenta");
 * });
 * @return {void}
 */
Sphero.prototype.connect = function(callback) {
  var self = this,
      connection = this.connection,
      packet = this.packet;

  function emit(name) {
    return self.emit.bind(self, name);
  }

  return new Promise(function (resolve, reject) {
    connection.on("open", function() {
      emit("open");
    });
    connection.on("close", emit("close"));

    connection.on("error", function() {
      emit("error");
      reject();
    });
    packet.on("error", emit("error"));

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
          parsedData = packet.parseAsyncData(parsedPayload, self.ds);
          self.emit("async", parsedData);
        }

        if (parsedData && parsedData.event) {
          self.emit(parsedData.event, parsedData);
        }
      }
    });

    connection.open(function() {
      self.ready = true;
      self.emit("ready");
      resolve();
    });
  }).asCallback(callback);
};


/**
 * Ends the connection to Sphero.
 *
 * After this is complete, no further commands can be sent to Sphero.
 *
 * @param {Function} callback function to be triggered once disconnected
 * @example
 * orb.disconnect(function() {
 *   console.log("Now disconnected from Sphero");
 * });
 * @return {void}
 */
Sphero.prototype.disconnect = function(callback) {
  this.connection.close(callback);
};

/**
 * Adds a command to the queue and calls for the next command in the queue
 * to try to execute.
 *
 * @private
 * @param {Number} vDevice the virtual device address
 * @param {Number} cmdName the command to execute
 * @param {Array} data to be passed to the command
 * @param {Function} callback function to be triggered once disconnected
 * @example
 * sphero.command(0x00, 0x02, [0x0f, 0x01, 0xff], callback);
 * @return {void}
 */
Sphero.prototype.command = function(vDevice, cmdName, data, callback) {
  var seq = this._incSeq(),
      opts = {
        sop2: this.sop2Bitfield,
        did: vDevice,
        cid: cmdName,
        seq: seq,
        data: data,
        emitPacketErrors: this.emitPacketErrors
      },
      self = this;

  return new Promise(function (resolve, reject) {
    var cmdPacket = self.packet.create(opts);

    self._queueCommand(cmdPacket, resolve, reject);
    self._execCommand();
  }).asCallback(callback);
};

/**
 * Adds a sphero command to the queue
 *
 * @private
 * @param {Array} cmdPacket the bytes array to be send through the wire
 * @param {Function} resolve function to be triggered on success
 * @param {Function} reject function to be triggered on failure
 * @example
 * this._queueCommand(cmdPacket, resolve, reject);
 * @return {void}
 */
Sphero.prototype._queueCommand = function(cmdPacket, resolve, reject) {
  if (this.commandQueue.length === 256) {
    this.commandQueue.shift();
  }

  this.commandQueue.push({ packet: cmdPacket, resolver: resolve, rejecter: reject });
};

/**
 * Tries to execute the next command in the queue if sphero not busy
 * and there's something in the queue.
 *
 * @private
 * @example
 * sphero._execCommand();
 * @return {void}
 */
Sphero.prototype._execCommand = function() {
  var cmd;
  if (!this.busy && (this.commandQueue.length > 0)) {
    // Get the seq number from the cmd packet/buffer
    // to store the callback response in that position
    cmd = this.commandQueue.shift();
    this.busy = true;
    this._queuePromise(cmd.packet, cmd.resolver, cmd.rejecter);
    this.connection.write(cmd.packet);
  }
};

/**
 * Adds a promise to the queue, to be executed when a response
 * gets back from the sphero.
 *
 * @private
 * @param {Array} cmdPacket the bytes array to be send through the wire
 * @param {Function} resolve function to be triggered on success
 * @param {Function} reject function to be triggered on failure
 * @example
 * sphero._execCommand(packet, resolve, reject);
 * @return {void}
 */
Sphero.prototype._queuePromise = function(cmdPacket, resolve, reject) {
  var seq = cmdPacket[4];

  var handler = function(err, packet) {
    clearTimeout(this.responseQueue[seq].timeoutId);
    this.responseQueue[seq] = null;
    this.busy = false;

    if (typeof resolve === "function") {
      if (!err && !!packet) {
        resolve(packet);
      } else {
        var error = new Error("Command sync response was lost.");
        reject(error);
      }
    }

    this._execCommand();
  };

  var timeoutId = setTimeout(handler.bind(this), this.timeout);

  this.responseQueue[seq] = {
    handler: handler.bind(this),
    timeoutId: timeoutId,
    did: cmdPacket[2],
    cid: cmdPacket[3]
  };
};

/**
 * Executes a handler from the queue, usually when we get a response
 * back from the sphero or the deadtime for the commands sent expires.
 *
 * @private
 * @param {Number} seq from the sphero response packet
 * @param {Packet} packet parsed from the sphero response packet
 * @example
 * sphero._execCallback(0x14, packet);
 * @return {void}
 */
Sphero.prototype._execCallback = function(seq, packet) {
  var queue = this.responseQueue[seq];

  if (queue) {
    queue.handler(null, packet);
  }
};

/**
 * Returns the response cmd (did, cid) passed to the sphero
 * based on the seq from the response (used for parsing responses).
 *
 * @private
 * @param {Number} seq from the sphero response packet
 * @example
 * sphero._responseCmd(0x14);
 * @return {Object|void} containing cmd ids { did: number, cid: number }
 */
Sphero.prototype._responseCmd = function(seq) {
  var queue = this.responseQueue[seq];

  if (queue) {
    return { did: queue.did, cid: queue.cid };
  }

  return null;
};

/**
 * Auto-increments seq counter for command and callback queues.
 *
 * @private
 * @example
 * sphero._responseCmd(0x14);
 * @return {Number} the increased value of seqCounter
 */
Sphero.prototype._incSeq = function() {
  if (this.seqCounter > 255) {
    this.seqCounter = 0x00;
  }

  return this.seqCounter++;
};
