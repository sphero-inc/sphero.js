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
 * Generates a random rgb color
 *
 * @return {Object} random color R/G/B values
 */
exports.randomColor = function randomColor() {
  function rand() { return Math.floor(Math.random() * 255); }
  return { red: rand(), green: rand(), blue: rand() };
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
 * @param {Number} value - number to convert
 * @param {Number} numBytes - byte frame size
 * @return {Array} hex numbers - generated
 */
exports.intToHexArray = function intToHexArray(value, numBytes) {
  var hexArray = new Array(numBytes);

  for (var i = numBytes - 1; i >= 0; i--) {
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
exports.argsToHexArray = function argsToHexArray() {
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

/**
 * Converts Signed Two's Complement Bytes to integer.
 *
 * @param {Integer} value - two byte int value
 * @param {Integer} numBytes - Number of bytes to apply Two's complement
 * @return {Integer} negative value
 */
exports.twosToInt = function twosToInt(value, numBytes) {
  var mask = 0x00;
  numBytes = numBytes || 2;

  for (var i = 0; i < numBytes; i++) {
    mask = (mask << 8) | 0xFF;
  }

  return ~(value ^ mask);
};

/**
 * Applies bit Xor to 32 bit value.
 *
 * @param {Number} value - The 32bit hex value
 * @param {Number} mask - byte mask to apply to each element in the array
 * @return {Array} with xor applied to each element
 */
exports.xor32bit = function xor32bit(value, mask) {
  var bytes = exports.intToHexArray(value, 4);
  mask = mask || 0xFF;

  for (var i = 0; i < bytes.length; i++) {
    bytes[i] ^= mask;
  }

  return exports.bufferToInt(bytes);
};
