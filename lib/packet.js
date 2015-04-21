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
      mrsp: {
        pos: 2,
        hex: 0x00
      },
      seq: {
        pos: 3,
        hex: 0x00
      },
      dlen: { pos: 4 },
      idCode: { pos: 2 },
      dlenMsb: { pos: 3 },
      dlenLsb: { pos: 4 },
      checksum: { pos: 5 },
      did: { hex: 0x00 },
      cid: { hex: 0x00 }
    };

var Packet = module.exports = function(opts) {
  opts = opts || {};

  this.partialBuffer = new Buffer(0);
  this.partialCounter = 0;
};

util.inherits(Packet, EventEmitter);

Packet.prototype.create = function(opts) {
  opts = opts || {};

  var sop1 = (opts.sop1 == null) ? FIELDS.sop1.hex : opts.sop1,
      sop2 = (opts.sop2 == null) ? FIELDS.sop2.sync : opts.sop2,
      did = (opts.did == null) ? FIELDS.did.hex : opts.did,
      cid = (opts.cid == null) ? FIELDS.cid.hex : opts.cid,
      seq = (opts.seq == null) ? FIELDS.seq.hex : opts.seq,
      data = (opts.data == null) ? [] : opts.data,
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
    buffer = this.partialBuffer = Buffer.concat(
      [this.partialBuffer, buffer],
      buffer.length + this.partialBuffer.length
    );
  } else {
    this.partialBuffer = new Buffer(buffer);
  }

  if (this._checkSOPs(buffer)) {
    // Check the packet is at least 6 bytes long, otherwise
    if (this._checkMinSize(buffer)) {
      // Check the buffer lenght matches the
      // DLEN value specified in the buffer
      var expectedSize = this._checkBufferSize(buffer);
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

  if (FIELDS.sop2.sync === buffer[FIELDS.sop2.pos]) {
    packet.mrsp = buffer[FIELDS.mrsp.pos];
    packet.seq = buffer[FIELDS.seq.pos];
    packet.dlen = buffer[FIELDS.dlen.pos];
  } else {
    packet.idCode = buffer[FIELDS.idCode.pos];
    packet.dlenMsb = buffer[FIELDS.dlenMsb.pos];
    packet.dlenLsb = buffer[FIELDS.dlenLsb.pos];
  }

  packet.dlen = this._extractDlen(buffer);

  // Create new Buffer for data that is dlen -1 (minus checksum) in size
  packet.data = new Buffer(packet.dlen - 1);
  // Copy data from buffer into packet.data
  buffer.copy(packet.data, 0, FIELDS.size, FIELDS.size + packet.dlen - 1);
  packet.checksum = buffer[FIELDS.size + packet.dlen - 1];

  if (!this._checkBufferChecksum(buffer, packet)) {
    throw new Error("Buffer checksum is incorrect");
  }

  // If the packet was parsed successfully, and the buffer and
  // expected size of the buffer are the same,clean up the
  // partialBuffer, otherwise assign extrabytes to partialBuffer
  if (buffer.length > expectedSize) {
    this.partialBuffer = new Buffer(buffer.length - expectedSize);
    buffer.copy(this.partialBuffer, 0, expectedSize);
  } else {
    this.partialBuffer = new Buffer(0);
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
  var check = null;
  if (this._checkSOP1(buffer)) {
    check = this._checkSOP2(buffer);
  } else {
    check = false;
  }
  return check;
};

Packet.prototype._checkSOP1 = function(buffer) {
  var check = null;

  if (buffer[FIELDS.sop1.pos] === FIELDS.sop1.hex) {
    check = true;
  } else {
    check = false;
  }

  return check;
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

Packet.prototype._checkBufferSize = function(buffer) {
  // Size = buffer fields size (SOP1, SOP2, MSRP, SEQ and DLEN) + DLEN value
  var expectedSize = FIELDS.size + this._extractDlen(buffer),
      bufferSize = buffer.lengthm,
      check = null;

  if (bufferSize < expectedSize) {
    check = -1;
  } else {
    check = expectedSize;
  }

  return check;
};

Packet.prototype._checkMinSize = function(buffer) {
  var check = null;

  if (buffer.length >= MIN_BUFFER_SIZE) {
    check = true;
  } else {
    check = false;
  }

  return check;
};

Packet.prototype._checkBufferChecksum = function(buffer, packet) {
  var checksum = this.checksum(
      buffer.slice(FIELDS.mrsp.pos, FIELDS.checksum.pos + packet.dlen - 1));

  var check = null;

  // Validate is a valid packet with checksum
  if (checksum === packet.checksum) {
    check = true;
  } else {
    check = false;
  }

  return check;
};

Packet.prototype._extractDlen = function(buffer) {
  var dlen = 0x0;

  if (buffer[FIELDS.sop2.pos] === FIELDS.sop2.sync) {
    dlen = buffer[FIELDS.dlen.pos];
  } else {
    // We shift the dlen MSB 8 bits and then do a binary OR
    // between the two values to obtain the dlen value
    dlen = (buffer[FIELDS.dlenMsb.pos] << 8) | buffer[FIELDS.dlenLsb.pos];
  }

  return dlen;
};
