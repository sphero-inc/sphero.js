"use strict";

var CORE_ADDR = 0x00;

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function Core() {
  var core;

  core = {
    coreCommand: function(cmdName, data, callback) {
      this.command(CORE_ADDR, cmdName, data, callback);
    },

    ping: function(callback) {
      this.coreCommand(commands.ping, null, callback);
    },

    version: function(callback) {
      this.coreCommand(commands.version, null, callback);
    },

    controlUARTTx: function(callback) {
      this.coreCommand(commands.controlUARTTx, null, callback);
    },

    setDeviceName: function(name, callback) {
      var data = [];

      for (var i = 0; i < name.length; ++i) {
        data[i] = name.charCodeAt(i);
      }

      this.coreCommand(commands.setDeviceName, data, callback);
    },

    getBluetoothInfo: function(callback) {
      this.coreCommand(commands.getBtInfo, null, callback);
    },

    setAutoReconnect: function(flag, time, callback) {
      this.coreCommand(commands.setAutoReconnect, [flag, time], callback);
    },

    getAutoReconnect: function(callback) {
      this.coreCommand(commands.getAutoReconnect, null, callback);
    },

    getPowerState: function(callback) {
      this.coreCommand(commands.getPwrState, null, callback);
    },

    setPowerNotification: function(flag, callback) {
      this.coreCommand(commands.setPwrNotify, [flag], callback);
    },

    sleep: function(wakeup, macro, orbBasic, callback) {
      wakeup = utils.intToHexArray(wakeup, 2);
      orbBasic = utils.intToHexArray(orbBasic, 2);

      var data = [].concat(wakeup, macro, orbBasic);

      this.coreCommand(commands.sleep, data, callback);
    },

    getVoltageTripPoints: function(callback) {
      this.coreCommand(commands.getPowerTrips, null, callback);
    },

    setVoltageTripPoints: function(vLow, vCrit, callback) {
      vLow = utils.intToHexArray(vLow, 2);
      vCrit = utils.intToHexArray(vCrit, 2);

      var data = [].concat(vLow, vCrit);

      this.coreCommand(commands.setPowerTrips, data, callback);
    },

    setInactivityTimeout: function(time, callback) {
      var data = utils.intToHexArray(time, 2);
      this.coreCommand(commands.setInactiveTimer, data, callback);
    },

    jumpToBootloader: function(callback) {
      this.coreCommand(commands.goToBl, null, callback);
    },

    runL1Diags: function(callback) {
      this.coreCommand(commands.runL1Diags, null, callback);
    },

    runL2Diags: function(callback) {
      this.coreCommand(commands.runL2Diags, null, callback);
    },

    clearCounters: function(callback) {
      this.coreCommand(commands.clearCounters, null, callback);
    },

    _coreTimeCmd: function(cmd, time, callback) {
      var data = utils.intToHexArray(time, 4);
      this.coreCommand(cmd, data, callback);
    },

    assignTime: function(time, callback) {
      this._coreTimeCmd(commands.assignTime, time, callback);
    },

    pollPacketTimes: function(time, callback) {
      this._coreTimeCmd(commands.pollTimes, time, callback);
    }
  };

  return core;
};
