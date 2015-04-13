var exports = module.exports;

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
 * Converts Red, Green, and Blue vlaues to an equivalent hex number
 *
 * @param {Number} red (0-255)
 * @param {Number} green (0-255)
 * @param {Number} blue (0-255)
 * @return {Number}
 */
exports.rgbToHex = function rgbToHex(red, green, blue) {
  return blue | (green << 8) | (red << 16);
};

/**
 * Generates a random hex color
 *
 * @return {Number}
 */
exports.randomColor = function randomColor() {
  var r = Math.random() * 255,
      g = Math.random() * 255,
      b = Math.random() * 255;

  return exports.rgbToHex(r, g, b);
};

/**
 * Creates a command packet for the Sphero, based on provided parameters
 *
 * @param {Number} did
 * @param {Number} cid
 * @param {Object} opts
 * @return {Object} generated packet
 */
exports.createPacket = function createPacket(did, cid, opts) {
  var packet = {};

  if (opts == null) {
    opts = {};
  }

  for (var opt in opts) {
    if (opts.hasOwnProperty(opt)) {
      packet[opt] = opts[opt];
    }
  }

  packet.DID = did;
  packet.CID = cid;

  return packet;
};

/**
 * Calculates a Buffer's checksum by summing it's bytes with mod256 then
 * ones-complimenting the result.
 *
 * @param {Buffer} buffer
 * @return {Number}
 */
exports.checksum = function checksum(buffer) {
  var sum = 0;

  for (var i = 0; i < buffer.length; i++) {
    sum += buffer.readUInt8(i);
  }

  return sum & 0xff ^ 0xff;
};

/**
 * Turns an internal packet representation into a Buffer ready to be written to
 * the Sphero.
 *
 * @param {Object} packet
 * @param {Number} packet.DID
 * @param {Number} packet.CID
 * @param {Number} packet.SEQ
 * @param {Buffer} packet.DATA
 * @return {Buffer}
 */
exports.generatePacket = function generatePacket(packet) {
  if (packet == null) {
    packet = {};
  }

  packet.DID  = packet.DID  || 0x00;
  packet.CID  = packet.CID  || 0x00;
  packet.SEQ  = packet.SEQ  || 0x00;
  packet.DATA = packet.DATA || new Buffer(0);

  var buffer = new Buffer(packet.DATA.length + 7); // min. command packet size

  var timeout = !!packet.resetTimeout,
      ack = !!packet.requestAcknowledgement;

  var SOP2 = 0xFC | (timeout && 0x02) | (ack && 0x01);

  buffer.writeUInt8(0xff, CommandTemplate.SOP1);
  buffer.writeUInt8(SOP2, CommandTemplate.SOP2);

  buffer.writeUInt8(packet.DID, CommandTemplate.DID);
  buffer.writeUInt8(packet.CID, CommandTemplate.CID);
  buffer.writeUInt8(packet.SEQ, CommandTemplate.SEQ);

  buffer.writeUInt8(packet.DATA.length + 1, CommandTemplate.DLEN);

  packet.DATA.copy(buffer, CommandTemplate.DATA);

  var checksum = exports.checksum(
    buffer.slice(CommandTemplate.DID, 7 + packet.DATA.length - 1)
  );

  buffer.writeUInt8(checksum, CommandTemplate.CHK + packet.DATA.length);

  return buffer;
};
