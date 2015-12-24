"use strict";

var inherits = require("util").inherits,
    EventEmitter = require("events").EventEmitter;

var utils = require("./utils"),
    RES_PARSER = require("./parsers/response.js"),
    ASYNC_PARSER = require("./parsers/async.js");

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

var Packet = module.exports = function(opts) {
  this.partialBuffer = new Buffer(0);
  this.partialCounter = 0;

  opts = opts || {};
  this.emitPacketErrors = opts.emitPacketErrors || false;
};

inherits(Packet, EventEmitter);

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

  this.emitPacketErrors = opts.emitPacketErrors || false;

  // Create array with packet bytes
  var packet = [
    sop1, sop2, did, cid, seq, dlen
  ].concat(data);

  // Get checksum for final byte in packet
  checksum = utils.checksum(packet.slice(2));

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
      if (this._checkExpectedSize(buffer) > -1) {
        // If the packet looks good parse it
        return this._parse(buffer);
      }
    }

    this.partialBuffer = new Buffer(buffer);
  }

  return null;
};

Packet.prototype._parse = function(buffer) {
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

  this._dealWithExtraBytes(buffer);

  return this._verifyChecksum(buffer, packet);
};

Packet.prototype._dealWithExtraBytes = function(buffer) {
  // If the packet was parsed successfully, and the buffer and
  // expected size of the buffer are the same,clean up the
  // partialBuffer, otherwise assign extrabytes to partialBuffer
  var expectedSize = this._checkExpectedSize(buffer);
  if (buffer.length > expectedSize) {
    this.partialBuffer = new Buffer(buffer.length - expectedSize);
    buffer.copy(this.partialBuffer, 0, expectedSize);
  } else {
    this.partialBuffer = new Buffer(0);
  }
};

Packet.prototype._verifyChecksum = function(buffer, packet) {
  var bSlice = buffer.slice(
        FIELDS.mrspIdCode,
        FIELDS.checksum + packet.dlen - 1
      ),
      checksum = utils.checksum(bSlice);

  // If we got an incorrect checksum we cleanup the packet,
  // partialBuffer, return null and emit an error event
  if (checksum !== packet.checksum) {
    packet = null;
    this.partialBuffer = new Buffer(0);
    if (this.emitPacketErrors) {
      this.emit("error", new Error("Incorrect checksum, packet discarded!"));
    }
  }

  return packet;
};

Packet.prototype.parseAsyncData = function(payload, ds) {
  var parser = ASYNC_PARSER[payload.idCode];

  return this._parseData(parser, payload, ds);
};

Packet.prototype.parseResponseData = function(cmd, payload) {
  if (!cmd || cmd.did === undefined || cmd.cid === undefined) {
    return payload;
  }

  var parserId = cmd.did.toString(16) + ":" + cmd.cid.toString(16),
      parser = RES_PARSER[parserId];

  return this._parseData(parser, payload);
};

Packet.prototype._parseData = function(parser, payload, ds) {
  var data = payload.data,
      pData, fields, field;


  if (parser && (data.length > 0)) {

    ds = this._checkDSMasks(ds, parser);

    if (ds === -1) {
      return payload;
    }

    fields = parser.fields;

    pData = {
      desc: parser.desc,
      idCode: parser.idCode,
      event: parser.event,
      did: parser.did,
      cid: parser.cid,
      packet: payload
    };


    var dsIndex = 0,
        dsFlag = 0,
        i = 0;

    while (i < fields.length) {
      field = fields[i];

      dsFlag = this._checkDSBit(ds, field);

      if (dsFlag === 1) {
        field.from = dsIndex;
        field.to = dsIndex = dsIndex + 2;
      } else if (dsFlag === 0) {
        i = this._incParserIndex(i, fields, data, dsFlag, dsIndex);
        continue;
      }

      pData[field.name] = this._parseField(field, data, pData);

      i = this._incParserIndex(i, fields, data, dsFlag, dsIndex);
    }
  } else {
    pData = payload;
  }

  return pData;
};

Packet.prototype._checkDSMasks = function(ds, parser) {
  if (parser.idCode === 0x03) {
    if (!(ds && ds.mask1 != null && ds.mask2 != null)) {
      return -1;
    }
  } else {
    return null;
  }

  return ds;
};

Packet.prototype._incParserIndex = function(i, fields, data, dsFlag, dsIndex) {
  i++;

  if ((dsFlag >= 0) && (i === fields.length) && (dsIndex < data.length)) {
    i = 0;
  }

  return i;
};

Packet.prototype._checkDSBit = function(ds, field) {
  if (!ds) {
    return -1;
  }

  if (Math.abs(ds[field.maskField] & field.bitmask) > 0) {
    return 1;
  }

  return 0;
};

Packet.prototype._parseField = function(field, data, pData) {
  var pField;
  var width;

  data = data.slice(field.from, field.to);
  pField = utils.bufferToInt(data);

  switch (field.type) {
    case "number":
      if (field.format === "hex") {
        pField = "0x" + pField.toString(16).toUpperCase();
      }
      break;
    case "string":
      pField = data.toString(field.format).replace(/\0/g, "0");
      break;
    case "raw":
      pField = new Buffer(data);
      break;
    case "predefined":
      if (field.mask != null) {
        pField &= field.mask;
      }
      pField = field.values[pField];
      break;
    case "bitmask":
      pField = this._parseBitmaskField(pField, field, pData);
      break;
    case "signed":
      width = 8 * (field.to - field.from);
      if (pField >= Math.pow(2, width - 1)) {
        pField = pField - Math.pow(2, width);
      }
      break;
    default:
      this.emit("error", new Error("Data could not be parsed!"));
      pField = "Data could not be parsed!";
      break;
  }

  return pField;
};

Packet.prototype._parseBitmaskField = function(val, field, pData) {
  var pField = {};

  if (val > field.range.top) {
    val = utils.twosToInt(val, 2);
  }

  if (pData[field.name]) {
    pField = pData[field.name];
    pField.value.push(val);
  } else {
    pField = {
      sensor: field.sensor,
      range: field.range,
      units: field.units,
      value: [val]
    };
  }

  return pField;
};

Packet.prototype._checkSOPs = function(buffer) {
  return (this._checkSOP1(buffer)) ? this._checkSOP2(buffer) : false;
};

Packet.prototype._checkSOP1 = function(buffer) {
  return (buffer[FIELDS.sop1.pos] === FIELDS.sop1.hex);
};

Packet.prototype._checkSOP2 = function(buffer) {
  var sop2 = buffer[FIELDS.sop2.pos];

  if (sop2 === FIELDS.sop2.sync) {
    return "sync";
  } else if (sop2 === FIELDS.sop2.async) {
    return "async";
  }

  return false;
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

Packet.prototype._extractDlen = function(buffer) {
  if (buffer[FIELDS.sop2.pos] === FIELDS.sop2.sync) {
    return buffer[FIELDS.dlenLsb];
  }

  // We shift the dlen MSB 8 bits and then do a binary OR
  // between the two values to obtain the dlen value
  return (buffer[FIELDS.seqMsb] << 8) | buffer[FIELDS.dlenLsb];
};
