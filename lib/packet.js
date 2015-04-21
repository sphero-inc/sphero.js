"use strict";

var _ = require("lodash"),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

var MIN_BUFFER_SIZE = 6,
    FIELDS_SIZE = 5,
    FIELDS_POS = {
      sop1: 0,
      sop2: 1,
      mrsp: 2,
      seq: 3,
      dlen: 4,
      idCode: 2,
      dlenMsb: 3,
      dlenLsb: 4,
      checksum: 5
    },
    FIELDS_HEX = {
      sop1: 0xFF,
      sop2: {
        sync: 0xFF,
        async: 0xFE
      },
      mrsp: 0X00,
      seq: 0x00,
      did: 0x00,
      cid: 0x00
    };

var Packet = module.exports =  function(opts) {
  opts = opts || {};

  this.partialBuffer = new Buffer(0);
  this.partialCounter = 0;
};

util.inherits(Packet, EventEmitter);

Packet.prototype.create = function(opts) {
  opts = opts || {};

  var sop1 = (undefined === opts.sop1) ? FIELDS_HEX.sop1 : opts.sop1,
      sop2 = (undefined === opts.sop2) ? FIELDS_HEX.sop2 : opts.sop2,
      did  = (undefined === opts.did)  ? FIELDS_HEX.did : opts.did,
      cid  = (undefined === opts.cid)  ? FIELDS_HEX.cid : opts.cid,
      seq  = (undefined === opts.seq)  ? FIELDS_HEX.seq : opts.seq,
      data = (undefined === opts.data) ? [] : opts.data,
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
  var packet = {};

  if (this.partialBuffer.length > 0) {
    buffer = this.partialBuffer = Buffer.concat([this.partialBuffer, buffer], buffer.length + this.partialBuffer.length);
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
  packet.sop1 = buffer[FIELDS_POS.sop1];
  packet.sop2 = buffer[FIELDS_POS.sop2];

  if (FIELDS_HEX.sop2.sync === buffer[FIELDS_POS.sop2]) {
    packet.mrsp = buffer[FIELDS_POS.mrsp];
    packet.seq = buffer[FIELDS_POS.seq];
    packet.dlen = buffer[FIELDS_POS.dlen];
  } else {
    packet.idCode = buffer[FIELDS_POS.idCode];
    packet.dlenMsb = buffer[FIELDS_POS.dlenMsb];
    packet.dlenLsb = buffer[FIELDS_POS.dlenLsb];
  }

  packet.dlen = this._extractDlen(buffer);

  // Create new Buffer for data that is dlen -1 (minus checksum) in size
  packet.data = new Buffer(packet.dlen - 1);
  // Copy data from buffer into packet.data
  buffer.copy(packet.data, 0, FIELDS_SIZE, FIELDS_SIZE + packet.dlen - 1);
  packet.checksum = buffer[FIELDS_SIZE + packet.dlen - 1];

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
  };

  return packet;
};

Packet.prototype.checksum = function(buffer) {
  var checksum = 0x00;

  _.forEach(buffer, function(n) {
    checksum += n;
  });

  return((checksum % 256) ^ 0xFF);
};

Packet.prototype._checkBuffer = function(buffer) {
  if (!this._checkSOPs()) {
    return false;
  }

  if (!this._checkMinSize()) {
    return false;
  }
};

Packet.prototype._checkSOPs = function(buffer) {
  if (this._checkSOP1(buffer)) {
    return this._checkSOP2(buffer);
  } else {
    return false;
  }
};

Packet.prototype._checkSOP1 = function(buffer) {
  if (buffer[0] === FIELDS_HEX.sop1) {
    return true;
  } else {
    return false;
  }
};

Packet.prototype._checkSOP2 = function(buffer) {
  var sop2 = buffer[1];

  if (sop2 === FIELDS_HEX.sop2.sync) {
    return "sync";
  } else if (sop2 === FIELDS_HEX.sop2.async) {
    return "async";
  } else {
    return false;
  }
};

Packet.prototype._checkBufferSize = function(buffer) {
  // Size = buffer fields size (SOP1, SOP2, MSRP, SEQ and DLEN) + DLEN value
  var expectedSize = FIELDS_SIZE + this._extractDlen(buffer),
      bufferSize = buffer.length;

  if (bufferSize < expectedSize) {
    return -1;
  } else {
    return expectedSize;
  }
};

Packet.prototype._checkMinSize = function(buffer) {
  if(buffer.length >= MIN_BUFFER_SIZE) {
    return true;
  } else {
    return false;
  }
};

Packet.prototype._checkBufferChecksum = function(buffer, packet) {
  var checksum = this.checksum(buffer.slice(FIELDS_POS.mrsp, FIELDS_POS.checksum + packet.dlen - 1));

  // Validate is a valid packet with checksum
  if (checksum === packet.checksum) {
    return true;
  } else {
    return false;
  }
};

Packet.prototype._extractDlen = function(buffer) {
  var dlen = 0x0;

  if (buffer[FIELDS_POS.SOP2] === FIELDS_HEX.sop2.sync) {
    dlen = buffer[FIELDS_POS.dlen];
  } else {
    // We shift the dlen MSB 8 bits and then do a binary OR
    // between the two values to obtain the dlen value
    dlen = (buffer[FIELDS_POS.dlenMsb] << 8) | buffer[FIELDS_POS.dlenLsb];
  }

  return dlen;
};
