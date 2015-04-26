"use strict";

var SPHERO_ADDR = 0x02;

var utils = require("../utils"),
    commands = require("../commands/sphero");

module.exports = function Core() {
  var sphero;

  sphero = {
    spheroCommand: function(cmdName, data, callback) {
      this.command(SPHERO_ADDR, cmdName, data, callback);
    },

    roll: function(speed, heading, state, callback) {
      if (typeof state === "function") {
        callback = state;
        state = 0x01;
      }

      speed &= 0xFF;
      heading = utils.intToHexArray(heading, 2);
      state &= 0x03;

      var data = [].concat(speed, heading, state);

      this.spheroCommand(commands.roll, data, callback);
    },

    setRGBLed: function(red, green, blue, flag, callback) {

      if (typeof flag === "function") {
        callback = flag;
        flag = 0x01;
      }

      var data = [red, green, blue, flag];

      for (var i = 0; i < data.length; i++) {
        data[i] &= 0xFF;
      }

      this.spheroCommand(commands.setRGBLed, data, callback);
    },

    getRGBColor: function(callback) {
      this.spheroCommand(commands.getRGBLed, null, callback);
    },

    setHeading: function(heading, callback) {
      heading = utils.intToHexArray(heading, 2);
      this.spheroCommand(commands.setCal, heading, callback);
    },

    setStabilization: function(flag, callback) {
      flag &= 0x01;
      this.spheroCommand(commands.setCal, [flag], callback);
    },

    setRotationRate: function(rotation, callback) {
      rotation &= 0xFF;
      this.spheroCommand(commands.setRotationRate, [rotation], callback);
    },

    reEnableDemo: function(callback) {
      this.spheroCommand(commands.reEnableDemo, null, callback);
    },

    getChassisId: function(callback) {
      this.spheroCommand(commands.getChassisId, null, callback);
    },

    setChassisId: function(chassisId, callback) {
      chassisId = utils.intToHexArray(chassisId, 2);
      this.spheroCommand(commands.getChassisId, chassisId, callback);
    },

    selfLevel: function(opts, angleLimit, timeout, trueTime, callback) {
      var data = [opts, angleLimit, timeout, trueTime];
      this.spheroCommand(commands.getChassisId, data, callback);
    },

    setDataStreaming: function(n, m, mask1, pcnt, mask2, callback) {
      n = utils.intToHexArray(n, 2);
      m = utils.intToHexArray(n, 2);
      mask1 = utils.intToHexArray(mask1, 4);
      pcnt &= 0xff;
      mask2 = utils.intToHexArray(mask2, 4);

      var data = [].concat(n, m, mask1, pcnt, mask2);

      this.spheroCommand(commands.getChassisId, data, callback);
    },
  };

  return sphero;
};
