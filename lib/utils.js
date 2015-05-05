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
 * Calculates an Array-like object's checksum through mod-256ing it's contents
 * then ones-complimenting the result.
 *
 * @param {Array|Buffer} data value to checksum
 * @return {Number} checksum value
 */
exports.checksum = function checksum(data) {
  var isBuffer = Buffer.isBuffer(data),
      value = 0x00;

  for (var i = 0; i < data.length; i++) {
    value += isBuffer ? data.readUInt8(i) : data[i];
  }

  return (value % 256) ^ 0xFF;
};

/**
 * Converts a number to an array of hex values within the provided byte frame.
 *
 * @param {Number} value number to convert
 * @param {Number} bytes byte frame size
 * @return {Array} hex numbers generated
 */
exports.intToHexArray = function intToHexArray(value, bytes) {
  var hexArray = new Array(bytes);

  for (var i = bytes - 1; i >= 0; i--) {
    hexArray[i] = value & 0xFF;
    value >>= 8;
  }

  return hexArray;
};

/**
 * Converts arguments to array.
 *
 * @return {Array} hex numbers generated
 */
exports.argsToHexArray = function argsToArray() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i] & 0xFF);
  }

  return args;
};

/**
 * Converts Buffer to integer.
 *
 * @param {Buffer} buffer - Buffer to be converted to integer
 * @return {Array} hex numbers generated
 */
exports.bufferToInt = function bufferToInt(buffer) {
  var value = buffer[0];

  for (var i = 1; i < buffer.length; i++) {
    value <<= 8;
    value |= buffer[i];
  }

  return value;
};
