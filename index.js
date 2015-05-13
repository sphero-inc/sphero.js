"use strict";

var Sphero = require("./lib/sphero");

module.exports = function sphero(address, options) {
  return new Sphero(address, options);
};
