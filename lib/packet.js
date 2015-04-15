"use strict";

var _ = require("lodash");

var Packet = module.exports =  function(did) {
  this.did = did;
};

Packet.prototype.create = function(cid, data, opts) {
  data = data || [];
  opts = opts || {};

  var sop1 = (undefined === opts.sop1) ? 0xFF : opts.sop1,
      sop2 = (undefined === opts.sop2) ? 0xFC : opts.sop2,
      did = (undefined === opts.did) ? this.did: opts.did,
      seq  = (undefined === opts.seq)  ? 0x00 : opts.seq,
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
  // Check Start Of Package 1 (SOP1) to be 0xFF when valid
  if (buffer[0] === 0xFF) {
    // If valid check SOP2 to be 0xFF or 0xFE
    // SOP2 === 0xFF when response
    // SOP2 === 0xFE when async
    if (buffer[1] === 0xFF ) {
      packet = this.parseResponse(buffer); 
    } else if (buffer[1] === 0xFE) {
      packet = this.parseAsync(buffer); 
    }
  } else {
  }

  return packet;
};

Packet.prototype.parseResponse = function(buffer) {
  return this._parse("response", buffer); 
};

Packet.prototype.parseAsync = function(buffer) {
  return this._parse("async", buffer); 
};

Packet.prototype._parse = function(type, buffer) {
  var packet = {};
  packet.sop1 = buffer[0];
  packet.sop2 = buffer[1];

  if ("response" === type) {
    packet.mrsp = buffer[2];
    packet.seq = buffer[3];
    packet.dlen = buffer[4];
  } else {
    packet.idCode = buffer[2];
    packet.dlenMsb = buffer[3];
    packet.dlenLsb = buffer[4];
    // We shift the dlen MSB 8 bits and then do a binary OR
    // between the two values to obtain the dlen value
    packet.dlen = (packet.dlenMsb << 8) | packet.dlenLsb;
  }

  // Create new Buffer for data that is dlen -1 (minus checksum) in size
  packet.data = new Buffer(packet.dlen - 1);
  // Copy data from buffer into packet.data
  buffer.copy(packet.data, 0, 5);
  packet.checksum = buffer[5 + packet.dlen - 1];

  return packet;
};

Packet.prototype.checksum = function(buffer) {
  var checksum = 0x00;

  _.forEach(buffer, function(n) {
    checksum += n;
  });

  return((checksum % 256) ^ 0xFF);
};
