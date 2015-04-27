"use strict";

var CORE_ADDR = 0x00;

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function() {
  var core = {};

  var command = utils.commandProxy(core, CORE_ADDR);

  core.ping = function(callback) {
    command(commands.ping, null, callback);
  };

  core.version = function(callback) {
    command(commands.version, null, callback);
  };

  core.controlUARTTx = function(callback) {
    command(commands.controlUARTTx, null, callback);
  };

  core.setDeviceName = function(name, callback) {
    var data = [];

    for (var i = 0; i < name.length; ++i) {
      data[i] = name.charCodeAt(i);
    }

    command(commands.setDeviceName, data, callback);
  };

  core.getBluetoothInfo = function(callback) {
    command(commands.getBtInfo, null, callback);
  };

  core.setAutoReconnect = function(flag, time, callback) {
    command(commands.setAutoReconnect, [flag, time], callback);
  };

  core.getAutoReconnect = function(callback) {
    command(commands.getAutoReconnect, null, callback);
  };

  core.getPowerState = function(callback) {
    command(commands.getPwrState, null, callback);
  };

  core.setPowerNotification = function(flag, callback) {
    command(commands.setPwrNotify, [flag], callback);
  };

  core.sleep = function(wakeup, macro, orbBasic, callback) {
    wakeup = utils.intToHexArray(wakeup, 2);
    orbBasic = utils.intToHexArray(orbBasic, 2);

    var data = [].concat(wakeup, macro, orbBasic);

    command(commands.sleep, data, callback);
  };

  core.getVoltageTripPoints = function(callback) {
    command(commands.getPowerTrips, null, callback);
  };

  core.setVoltageTripPoints = function(vLow, vCrit, callback) {
    vLow = utils.intToHexArray(vLow, 2);
    vCrit = utils.intToHexArray(vCrit, 2);

    var data = [].concat(vLow, vCrit);

    command(commands.setPowerTrips, data, callback);
  };

  core.setInactivityTimeout = function(time, callback) {
    var data = utils.intToHexArray(time, 2);
    command(commands.setInactiveTimer, data, callback);
  };

  core.jumpToBootloader = function(callback) {
    command(commands.goToBl, null, callback);
  };

  core.runL1Diags = function(callback) {
    command(commands.runL1Diags, null, callback);
  };

  core.runL2Diags = function(callback) {
    command(commands.runL2Diags, null, callback);
  };

  core.clearCounters = function(callback) {
    command(commands.clearCounters, null, callback);
  };

  core._coreTimeCmd = function(cmd, time, callback) {
    var data = utils.intToHexArray(time, 4);
    command(cmd, data, callback);
  };

  core.assignTime = function(time, callback) {
    this._coreTimeCmd(commands.assignTime, time, callback);
  };

  core.pollPacketTimes = function(time, callback) {
    this._coreTimeCmd(commands.pollTimes, time, callback);
  };

  return core;
};
