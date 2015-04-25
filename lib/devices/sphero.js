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
    }
  };

  return sphero;
};
