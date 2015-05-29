"use strict";

var Sphero = require("./lib/sphero");

/**
 * Creates a new Sphero instance with the provided options.
 *
 * @param {String} address port/UUID/address of the connected Sphero
 * @param {Object} [opts] options for sphero setup
 * @param {Object} [opts.adaptor] if provided, a custom adaptor used for Sphero
 * communication
 * @param {Number} [opts.sop2=0xFD] SOP2 value to be passed to commands
 * @param {Number} [opts.timeout=500] delay before a command is considered dead
 * @example var orb = sphero("/dev/rfcomm0"); // linux
 * @example var orb = sphero("COM4"); // windows
 * @example
 * var orb = sphero("/dev/tty.Sphero-OGB-AMP-SPP", { timeout: 300 }); // OS X
 * @returns {Sphero} a new instance of Sphero
 */
module.exports = function sphero(address, opts) {
  return new Sphero(address, opts);
};
