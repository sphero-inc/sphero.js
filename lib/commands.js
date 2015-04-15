"use strict";

var core = require("./core-commands"),
    bootloader = require("./bootloader-commands"),
    sphero = require("./sphero-commands");

module.exports = {
  core: core,
  bootloader: bootloader,
  sphero: sphero
};
