var checksum = require("./utils").checksum;

// a template layout for a Sphero command buffer
var CommandTemplate = {
  SOP1: 0,
  SOP2: 1,
  DID:  2,
  CID:  3,
  SEQ:  4,
  DLEN: 5, // two bytes by default
  DATA: 6,
  CHK:  6  // offset must be adjusted if DLEN > 1
};

/**
 * Creates an internal Sphero packet representation, based on provided
 * parameters
 *
 * @constructor
 *
 * @param {Number} did
 * @param {Number} cid
 * @param {Object} opts
 *
 * @return {Object} generated packet
 */
var Packet = module.exports = function Packet(did, cid, opts) {
  if (opts == null) { opts = {}; }

  this.DID = did;
  this.CID = cid;
  this.opts = {};

  for (var opt in opts) {
    if (opts.hasOwnProperty(opt)) {
      this.opts[opt] = opts[opt];
    }
  }
};

/**
 * Converts the internal representation into a Buffer ready to be written to
 * a device.
 *
 * @param {Object} packet
 * @param {Number} packet.DID
 * @param {Number} packet.CID
 * @param {Number} packet.SEQ
 * @param {Buffer} packet.DATA
 * @return {Buffer}
 */
Packet.prototype.build = function build() {
  var did  = this.DID  || 0x00,
      cid  = this.CID  || 0x00,
      seq  = this.opts.SEQ  || 0x00,
      data = this.opts.DATA || new Buffer(0);

  var buffer = new Buffer(data.length + 7); // min. command packet size

  var timeout = !!this.opts.resetTimeout,
      answer = !!this.opts.answer;

  var SOP2 = 0xFC | (timeout && 0x02) | (answer && 0x01);

  buffer.writeUInt8(0xff, CommandTemplate.SOP1);
  buffer.writeUInt8(SOP2, CommandTemplate.SOP2);

  buffer.writeUInt8(did, CommandTemplate.DID);
  buffer.writeUInt8(cid, CommandTemplate.CID);
  buffer.writeUInt8(seq, CommandTemplate.SEQ);

  buffer.writeUInt8(data.length + 1, CommandTemplate.DLEN);

  data.copy(buffer, CommandTemplate.DATA);

  var chk = checksum(buffer.slice(CommandTemplate.DID, 7 + data.length - 1));

  buffer.writeUInt8(chk, CommandTemplate.CHK + data.length);

  return buffer;
};
