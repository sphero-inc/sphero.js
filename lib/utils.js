"use strict";

var exports = module.exports;

/**
 * Converts Red, Green, and Blue vlaues to an equivalent hex number
 *
 * @param {Number} red (0-255)
 * @param {Number} green (0-255)
 * @param {Number} blue (0-255)
 * @return {Number} computed number
 */
exports.rgbToHex = function rgbToHex(red, green, blue) {
  return blue | (green << 8) | (red << 16);
};

/**
 * Generates a random hex color
 *
 * @return {Number} random color
 */
exports.randomColor = function randomColor() {
  var r = Math.random() * 255,
      g = Math.random() * 255,
      b = Math.random() * 255;

  return exports.rgbToHex(r, g, b);
};

/**
 * Calculates a Buffer's checksum by summing it's bytes with mod256 then
 * ones-complimenting the result.
 *
 * @param {Buffer} buffer data to checksum
 * @return {Number} checksum value
 */
exports.checksum = function checksum(buffer) {
  var sum = 0;

  for (var i = 0; i < buffer.length; i++) {
    sum += buffer.readUInt8(i);
  }

  return sum & 0xff ^ 0xff;
};
