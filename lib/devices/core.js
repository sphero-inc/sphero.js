"use strict";

var CORE_ADDR = 0x00;

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function Core() {
  var core = {
    _coreCommand: function(commandName, data, callback) {
      var vDevice = CORE_ADDR,
          seq = this._incSeq(),
          opts = {
            sop2: this.sop2Bitfield,
            did: vDevice,
            cid: commandName,
            seq: seq,
            data: data
          };

      var commandPacket = this.packet.create(opts);

      this._queueCallback(seq, callback);
      this.connection.write(commandPacket);
    },

    ping: function(callback) {
      this._coreCommand(commands.ping, null, callback);
    },

    version: function(callback) {
      this._coreCommand(commands.version, null, callback);
    },

    controlUARTTx: function(callback) {
      this._coreCommand(commands.controlUARTTx, null, callback);
    },

    setDeviceName: function(name, callback) {
      var data = [];

      for (var i = 0; i < name.length; ++i) {
        data[i] = name.charCodeAt(i);
      }

      this._coreCommand(commands.setDeviceName, data, callback);
    },

    getBluetoothInfo: function(callback) {
      this._coreCommand(commands.getBtInfo, null, callback);
    },

    setAutoReconnect: function(flag, time, callback) {
      this._coreCommand(commands.setAutoReconnect, [flag, time], callback);
    },

    getAutoReconnect: function(callback) {
      this._coreCommand(commands.getAutoReconnect, null, callback);
    },

    getPowerState: function(callback) {
      this._coreCommand(commands.getPwrState, null, callback);
    },

    setPowerNotification: function(flag, callback) {
      this._coreCommand(commands.setPwrNotify, [flag], callback);
    },

    sleep: function(wakeup, macro, orbBasic, callback) {
      wakeup = utils.intToHexArray(wakeup, 2);
      orbBasic = utils.intToHexArray(wakeup, 2);

      var data = [].concat(wakeup, macro, orbBasic);

      this._coreCommand(commands.sleep, data, callback);
    },

    getVoltageTripPoints: function(callback) {
      this._coreCommand(commands.getPowerTrips, null, callback);
    },

    setVoltageTripPoints: function(vLow, vCrit, callback) {
      vLow = utils.intToHexArray(vLow, 2);
      vCrit = utils.intToHexArray(vCrit, 2);

      var data = [].concat(vLow, vCrit);

      this._coreCommand(commands.setPowerTrips, data, callback);
    },

    setInactivityTimeout: function(time, callback) {
      var data = utils.intToHexArray(time, 2);

      var cb = function(err) {
        if (typeof callback === "function") {
          callback(err, {
            device: "core",
            deviceHex: CORE_ADDR,
            command: "setInactivityTimeout"
          });
        }
      };

      this._coreCommand(commands.setInactiveTimer, data, cb);
    },

    jumpToBotloader: function(callback) {
      this._coreCommand(commands.goToBl, null, callback);
    },

    runL1Diags: function(callback) {
      this._coreCommand(commands.runL1Diags, null, callback);
    },

    runL2Diags: function(callback) {
      this._coreCommand(commands.runL2Diags, null, callback);
    },

    clearCounters: function(callback) {
      this._coreCommand(commands.clearCounters, null, callback);
    },

    _coreTimeCmd: function(cmd, time, callback) {
      var data = utils.intToHexArray(time, 4);
      this._coreCommand(cmd, data, callback);
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
