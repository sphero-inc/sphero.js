"use strict";

var core = require("./commands-core"),
    bootloader = require("./commands-bootloader"),
    sphero = require("./commands-sphero");

module.exports = {
  core: core,
  bootloader: bootloader,
  sphero: sphero
};
