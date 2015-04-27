"use strict";

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function core(device) {
  var command = device.command.bind(device, 0x00);

  device.ping = function(callback) {
    command(commands.ping, null, callback);
  };

  device.version = function(callback) {
    command(commands.version, null, callback);
  };

  device.controlUARTTx = function(callback) {
    command(commands.controlUARTTx, null, callback);
  };

  device.setDeviceName = function(name, callback) {
    var data = [];

    for (var i = 0; i < name.length; ++i) {
      data[i] = name.charCodeAt(i);
    }

    command(commands.setDeviceName, data, callback);
  };

  device.getBluetoothInfo = function(callback) {
    command(commands.getBtInfo, null, callback);
  };

  device.setAutoReconnect = function(flag, time, callback) {
    command(commands.setAutoReconnect, [flag, time], callback);
  };

  device.getAutoReconnect = function(callback) {
    command(commands.getAutoReconnect, null, callback);
  };

  device.getPowerState = function(callback) {
    command(commands.getPwrState, null, callback);
  };

  device.setPowerNotification = function(flag, callback) {
    command(commands.setPwrNotify, [flag], callback);
  };

  device.sleep = function(wakeup, macro, orbBasic, callback) {
    wakeup = utils.intToHexArray(wakeup, 2);
    orbBasic = utils.intToHexArray(orbBasic, 2);

    var data = [].concat(wakeup, macro, orbBasic);

    command(commands.sleep, data, callback);
  };

  device.getVoltageTripPoints = function(callback) {
    command(commands.getPowerTrips, null, callback);
  };

  device.setVoltageTripPoints = function(vLow, vCrit, callback) {
    vLow = utils.intToHexArray(vLow, 2);
    vCrit = utils.intToHexArray(vCrit, 2);

    var data = [].concat(vLow, vCrit);

    command(commands.setPowerTrips, data, callback);
  };

  device.setInactivityTimeout = function(time, callback) {
    var data = utils.intToHexArray(time, 2);
    command(commands.setInactiveTimer, data, callback);
  };

  device.jumpToBootloader = function(callback) {
    command(commands.goToBl, null, callback);
  };

  device.runL1Diags = function(callback) {
    command(commands.runL1Diags, null, callback);
  };

  device.runL2Diags = function(callback) {
    command(commands.runL2Diags, null, callback);
  };

  device.clearCounters = function(callback) {
    command(commands.clearCounters, null, callback);
  };

  device._coreTimeCmd = function(cmd, time, callback) {
    var data = utils.intToHexArray(time, 4);
    command(cmd, data, callback);
  };

  device.assignTime = function(time, callback) {
    device._coreTimeCmd(commands.assignTime, time, callback);
  };

  device.pollPacketTimes = function(time, callback) {
    device._coreTimeCmd(commands.pollTimes, time, callback);
  };
};
