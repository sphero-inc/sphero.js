"use strict";

var _ = require("lodash"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

var MIN_BUFFER_SIZE = 6,
    FIELDS = {
      size: 5,
      sop1: {
        pos: 0,
        hex: 0xFF
      },
      sop2: {
        pos: 1,
        sync: 0xFF,
        async: 0xFE,
      },
      mrspHex: 0x00,
      seqHex: 0x00,
      mrspIdCode: 2,
      seqMsb: 3,
      dlenLsb: 4,
      checksum: 5,
      didHex: 0x00,
      cidHex: 0x01
    };

var Packet = module.exports = function() {
  this.partialBuffer = new Buffer(0);
  this.partialCounter = 0;
};

util.inherits(Packet, EventEmitter);

Packet.prototype.create = function(opts) {
  opts = opts || {};

  var sop1 = (opts.sop1 === undefined) ? FIELDS.sop1.hex : opts.sop1,
      sop2 = (opts.sop2 === undefined) ? FIELDS.sop2.sync : opts.sop2,
      did = (opts.did === undefined) ? FIELDS.didHex : opts.did,
      cid = (opts.cid === undefined) ? FIELDS.cidHex : opts.cid,
      seq = (opts.seq === undefined) ? FIELDS.seqHex : opts.seq,
      data = (!opts.data) ? [] : opts.data,
      // Add 1 to dlen, since it also counts the checksum byte
      dlen = data.length + 1,
      checksum = 0x00;

  // Create array with packet bytes
  var packet = [
    sop1, sop2, did, cid, seq, dlen
  ].concat(data);

  // Get checksum for final byte in packet
  checksum = this.checksum(packet.slice(2));

  // Add checksum to packet
  packet.push(checksum);

  return packet;
};

Packet.prototype.parse = function(buffer) {
  if (this.partialBuffer.length > 0) {
    buffer = Buffer.concat(
      [this.partialBuffer, buffer],
      buffer.length + this.partialBuffer.length
    );

    this.partialBuffer = new Buffer(0);
  } else {
    this.partialBuffer = new Buffer(buffer);
  }

  if (this._checkSOPs(buffer)) {
    // Check the packet is at least 6 bytes long
    if (this._checkMinSize(buffer)) {
      // Check the buffer length matches the
      // DLEN value specified in the buffer
      var expectedSize = this._checkExpectedSize(buffer);
      if (expectedSize > -1) {
        // If the packet looks good parse it
        return this._parse(buffer, expectedSize);
      }
    }

    this.partialBuffer = new Buffer(buffer);
  }

  return null;
};

Packet.prototype._parse = function(buffer, expectedSize) {
  var packet = {};
  packet.sop1 = buffer[FIELDS.sop1.pos];
  packet.sop2 = buffer[FIELDS.sop2.pos];

  var bByte2 = buffer[FIELDS.mrspIdCode],
      bByte3 = buffer[FIELDS.seqMsb],
      bByte4 = buffer[FIELDS.dlenLsb];

  if (FIELDS.sop2.sync === buffer[FIELDS.sop2.pos]) {
    packet.mrsp = bByte2;
    packet.seq = bByte3;
    packet.dlen = bByte4;
  } else {
    packet.idCode = bByte2;
    packet.dlenMsb = bByte3;
    packet.dlenLsb = bByte4;
  }

  packet.dlen = this._extractDlen(buffer);

  // Create new Buffer for data that is dlen -1 (minus checksum) in size
  packet.data = new Buffer(packet.dlen - 1);
  // Copy data from buffer into packet.data
  buffer.copy(packet.data, 0, FIELDS.size, FIELDS.size + packet.dlen - 1);
  packet.checksum = buffer[FIELDS.size + packet.dlen - 1];

  // If the packet was parsed successfully, and the buffer and
  // expected size of the buffer are the same,clean up the
  // partialBuffer, otherwise assign extrabytes to partialBuffer
  if (buffer.length > expectedSize) {
    this.partialBuffer = new Buffer(buffer.length - expectedSize);
    buffer.copy(this.partialBuffer, 0, expectedSize);
  } else {
    this.partialBuffer = new Buffer(0);
  }

  // If we got an incorrect checksum we cleanup the packet,
  // partialBuffer, return null and emit an error event
  if (!this._checkBufferChecksum(buffer, packet)) {
    this.partialBuffer = new Buffer(0);
    packet = null;
    this.emit("error", new Error("Incorrect checksum, packet discarded"));
  }

  return packet;
};

Packet.prototype.checksum = function(buffer) {
  var checksum = 0x00;

  _.forEach(buffer, function(n) {
    checksum += n;
  });

  return ((checksum % 256) ^ 0xFF);
};

Packet.prototype._checkSOPs = function(buffer) {
  return (this._checkSOP1(buffer)) ? this._checkSOP2(buffer) : false;
};

Packet.prototype._checkSOP1 = function(buffer) {
  return (buffer[FIELDS.sop1.pos] === FIELDS.sop1.hex);
};

Packet.prototype._checkSOP2 = function(buffer) {
  var sop2 = buffer[FIELDS.sop2.pos],
      check = null;

  if (sop2 === FIELDS.sop2.sync) {
    check = "sync";
  } else if (sop2 === FIELDS.sop2.async) {
    check = "async";
  } else {
    check = false;
  }

  return check;
};

Packet.prototype._checkExpectedSize = function(buffer) {
  // Size = buffer fields size (SOP1, SOP2, MSRP, SEQ and DLEN) + DLEN value
  var expectedSize = FIELDS.size + this._extractDlen(buffer),
      bufferSize = buffer.length;

  return (bufferSize < expectedSize) ? -1 : expectedSize;
};

Packet.prototype._checkMinSize = function(buffer) {
  return (buffer.length >= MIN_BUFFER_SIZE);
};

Packet.prototype._checkBufferChecksum = function(buffer, packet) {
  var bSlice = buffer.slice(
        FIELDS.mrspIdCode,
        FIELDS.checksum + packet.dlen - 1
      ),
      checksum = this.checksum(bSlice);

  // Validate is a valid packet with checksum
  return (checksum === packet.checksum);
};

Packet.prototype._extractDlen = function(buffer) {
  var dlen = 0x0;

  if (buffer[FIELDS.sop2.pos] === FIELDS.sop2.sync) {
    dlen = buffer[FIELDS.dlenLsb];
  } else {
    // We shift the dlen MSB 8 bits and then do a binary OR
    // between the two values to obtain the dlen value
    dlen = (buffer[FIELDS.seqMsb] << 8) | buffer[FIELDS.dlenLsb];
  }

  return dlen;
};
