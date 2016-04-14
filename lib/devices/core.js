"use strict";

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function core(device) {
  // Core Virtual Device Address = 0x00
  var command = device.command.bind(device, 0x00);

  /**
   * The Ping command verifies the Sphero is awake and receiving commands.
   *
   * @param {Function} callback triggered when Sphero has been pinged
   * @example
   * orb.ping(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.ping = function(callback) {
    return command(commands.ping, null, callback);
  };

  /**
   * The Version command returns a batch of software and hardware information
   * about Sphero.
   *
   * @param {Function} callback triggered with version information
   * @example
   * orb.version(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  recv:", data.recv);
   *     console.log("  mdl:", data.mdl);
   *     console.log("  hw:", data.hw);
   *     console.log("  msaVer:", data.msaVer);
   *     console.log("  msaRev:", data.msaRev);
   *     console.log("  bl:", data.bl);
   *     console.log("  bas:", data.bas);
   *     console.log("  macro:", data.macro);
   *     console.log("  apiMaj:", data.apiMaj);
   *     console.log("  apiMin:", data.apiMin);
   *   }
   * }
   * @return {object} promise for command
   */
  device.version = function(callback) {
    return command(commands.version, null, callback);
  };

  /**
   * The Control UART Tx command enables or disables the CPU's UART transmit
   * line so another client can configure the Bluetooth module.
   *
   * @param {Function} callback function to be triggered after write
   * @example
   * orb.controlUartTx(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.controlUartTx = function(callback) {
    return command(commands.controlUARTTx, null, callback);
  };

  /**
   * The Set Device Name command assigns Sphero an internal name. This value is
   * then produced as part of the Get Bluetooth Info command.
   *
   * Names are clipped at 48 characters to support UTF-8 sequences. Any extra
   * characters will be discarded.
   *
   * This field defaults to the Bluetooth advertising name of Sphero.
   *
   * @param {String} name what name to give to the Sphero
   * @param {Function} callback function to be triggered when the name is set
   * @example
   * orb.setDeviceName("rollingOrb", function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setDeviceName = function(name, callback) {
    var data = [];

    for (var i = 0; i < name.length; ++i) {
      data[i] = name.charCodeAt(i);
    }

    return command(commands.setDeviceName, data, callback);
  };

  /**
   * Triggers the callback with a structure containing
   *
   * - Sphero's ASCII name
   * - Sphero's Bluetooth address (ASCII)
   * - Sphero's ID colors
   *
   * @param {Function} callback function to be triggered with Bluetooth info
   * @example
   * orb.getBluetoothInfo(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  name:", data.name);
   *     console.log("  btAddress:", data.btAddress);
   *     console.log("  separator:", data.separator);
   *     console.log("  colors:", data.colors);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getBluetoothInfo = function(callback) {
    return command(commands.getBtInfo, null, callback);
  };

  /**
   * The Set Auto Reconnect command tells Sphero's BT module whether or not it
   * should automatically reconnect to the previously-connected Apple mobile
   * device.
   *
   * @param {Number} flag whether or not to reconnect (0 - no, 1 - yes)
   * @param {Number} time how many seconds after start to enable auto reconnect
   * @param {Function} callback function to be triggered after write
   * @example
   * orb.setAutoReconnect(1, 20, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setAutoReconnect = function(flag, time, callback) {
    return command(commands.setAutoReconnect, [flag, time], callback);
  };

  /**
   * The Get Auto Reconnect command returns the Bluetooth auto reconnect values
   * as defined above in the Set Auto Reconnect command.
   *
   * @param {Function} callback function to be triggered with reconnect data
   * @example
   * orb.getAutoReconnect(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  flag:", data.flag);
   *     console.log("  time:", data.time);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getAutoReconnect = function(callback) {
    return command(commands.getAutoReconnect, null, callback);
  };

  /**
   * The Get Power State command returns Sphero's current power state, and some
   * additional parameters:
   *
   * - **RecVer**: record version code (following is for 0x01)
   * - **Power State**: high-level state of the power system
   * - **BattVoltage**: current battery voltage, scaled in 100ths of a volt
   *   (e.g. 0x02EF would be 7.51 volts)
   * - **NumCharges**: Number of battery recharges in the life of this Sphero
   * - **TimeSinceChg**: Seconds awake since last recharge
   *
   * Possible power states:
   *
   * - 0x01 - Battery Charging
   * - 0x02 - Battery OK
   * - 0x03 - Battery Low
   * - 0x04 - Battery Critical
   *
   * @param {Function} callback function to be triggered with power state data
   * @example
   * orb.getPowerState(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  recVer:", data.recVer);
   *     console.log("  batteryState:", data.batteryState);
   *     console.log("  batteryVoltage:", data.batteryVoltage);
   *     console.log("  chargeCount:", data.chargeCount);
   *     console.log("  secondsSinceCharge:", data.secondsSinceCharge);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getPowerState = function(callback) {
    return command(commands.getPwrState, null, callback);
  };

  /**
   * The Set Power Notification command enables sphero to asynchronously notify
   * the user of power state periodically (or immediately, when a change occurs)
   *
   * Timed notifications are sent every 10 seconds, until they're disabled or
   * Sphero is unpaired.
   *
   * @param {Number} flag whether or not to send notifications (0 - no, 1 - yes)
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.setPowerNotification(1, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setPowerNotification = function(flag, callback) {
    return command(commands.setPwrNotify, [flag], callback);
  };

  /**
   * The Sleep command puts Sphero to sleep immediately.
   *
   * @param {Number} wakeup the number of seconds for Sphero to re-awaken after.
   * 0x00 tells Sphero to sleep forever, 0xFFFF attemps to put Sphero into deep
   * sleep.
   * @param {Number} macro if non-zero, Sphero will attempt to run this macro ID
   * when it wakes up
   * @param {Number} orbBasic if non-zero, Sphero will attempt to run an
   * orbBasic program from this line number
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.sleep(10, 0, 0, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.sleep = function(wakeup, macro, orbBasic, callback) {
    wakeup = utils.intToHexArray(wakeup, 2);
    orbBasic = utils.intToHexArray(orbBasic, 2);

    var data = [].concat(wakeup, macro, orbBasic);

    return command(commands.sleep, data, callback);
  };

  /**
   * The Get Voltage Trip Points command returns the trip points Sphero uses to
   * determine Low battery and Critical battery.
   *
   * The values are expressed in 100ths of a volt, so defaults of 7V and 6.5V
   * respectively are returned as 700 and 650.
   *
   * @param {Function} callback function to be triggered with trip point data
   * @example
   * orb.getVoltageTripPoints(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  vLow:", data.vLow);
   *     console.log("  vCrit:", data.vCrit);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getVoltageTripPoints = function(callback) {
    return command(commands.getPowerTrips, null, callback);
  };

  /**
   * The Set Voltage Trip Points command assigns the voltage trip points for Low
   * and Critical battery voltages.
   *
   * Values are specified in 100ths of a volt, and there are limitations on
   * adjusting these from their defaults:
   *
   * - vLow must be in the range 675-725
   * - vCrit must be in the range 625-675
   *
   * There must be 0.25v of separation between the values.
   *
   * Shifting these values too low can result in very little warning before
   * Sphero forces itself to sleep, depending on the battery pack. Be careful.
   *
   * @param {Number} vLow new voltage trigger for Low battery
   * @param {Number} vCrit new voltage trigger for Crit battery
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.setVoltageTripPoints(675, 650, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setVoltageTripPoints = function(vLow, vCrit, callback) {
    vLow = utils.intToHexArray(vLow, 2);
    vCrit = utils.intToHexArray(vCrit, 2);

    var data = [].concat(vLow, vCrit);

    return command(commands.setPowerTrips, data, callback);
  };

  /**
   * The Set Inactivity Timeout command sets the timeout delay before Sphero
   * goes to sleep automatically.
   *
   * By default, the value is 600 seconds (10 minutes), but this command can
   * alter it to any value of 60 seconds or greater.
   *
   * @param {Number} time new delay before sleeping
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.setInactivityTimeout(120, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setInactivityTimeout = function(time, callback) {
    var data = utils.intToHexArray(time, 2);
    return command(commands.setInactiveTimer, data, callback);
  };

  /**
   * The Jump To Bootloader command requests a jump into the Bootloader to
   * prepare for a firmware download.
   *
   * All commands after this one must comply with the Bootloader Protocol
   * Specification.
   *
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.jumpToBootLoader(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.jumpToBootloader = function(callback) {
    return command(commands.goToBl, null, callback);
  };

  /**
   * The Perform Level 1 Diagnostics command is a developer-level command to
   * help diagnose aberrant behaviour in Sphero.
   *
   * Most process flags, system counters, and system states are decoded to
   * human-readable ASCII.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Function} callback function to be triggered with diagnostic data
   * @example
   * orb.runL1Diags(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.runL1Diags = function(callback) {
    return command(commands.runL1Diags, null, callback);
  };

  /**
   * The Perform Level 2 Diagnostics command is a developer-level command to
   * help diagnose aberrant behaviour in Sphero.
   *
   * It's much less informative than the Level 1 command, but is in binary
   * format and easier to parse.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Function} callback function to be triggered with diagnostic data
   * @example
   * orb.runL2Diags(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  recVer:", data.recVer);
   *     console.log("  rxGood:", data.rxGood);
   *     console.log("  rxBadId:", data.rxBadId);
   *     console.log("  rxBadDlen:", data.rxBadDlen);
   *     console.log("  rxBadCID:", data.rxBadCID);
   *     console.log("  rxBadCheck:", data.rxBadCheck);
   *     console.log("  rxBufferOvr:", data.rxBufferOvr);
   *     console.log("  txMsg:", data.txMsg);
   *     console.log("  txBufferOvr:", data.txBufferOvr);
   *     console.log("  lastBootReason:", data.lastBootReason);
   *     console.log("  bootCounters:", data.bootCounters);
   *     console.log("  chargeCount:", data.chargeCount);
   *     console.log("  secondsSinceCharge:", data.secondsSinceCharge);
   *     console.log("  secondsOn:", data.secondsOn);
   *     console.log("  distancedRolled:", data.distancedRolled);
   *     console.log("  sensorFailures:", data.sensorFailures);
   *     console.log("  gyroAdjustCount:", data.gyroAdjustCount);
   *   }
   * }
   * @return {object} promise for command
   */
  device.runL2Diags = function(callback) {
    return command(commands.runL2Diags, null, callback);
  };

  /**
   * The Clear Counters command is a developer-only command to clear the various
   * system counters created by the L2 diagnostics.
   *
   * It is denied when the Sphero is in Normal mode.
   *
   * @private
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.clearCounters(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.clearCounters = function(callback) {
    return command(commands.clearCounters, null, callback);
  };

  device._coreTimeCmd = function(cmd, time, callback) {
    var data = utils.intToHexArray(time, 4);
    return command(cmd, data, callback);
  };

  /**
   * The Assign Time command sets a specific value to Sphero's internal 32-bit
   * relative time counter.
   *
   * @param {Number} time the new value to set
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.assignTime(0x00ffff00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.assignTime = function(time, callback) {
    return device._coreTimeCmd(commands.assignTime, time, callback);
  };

  /**
   * The Poll Packet Times command helps users profile the transmission and
   * processing latencies in Sphero.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Number} time a timestamp to use for profiling
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.assignTime(0x00ffff, function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  t1:", data.t1);
   *     console.log("  t2:", data.t2);
   *     console.log("  t3:", data.t3);
   *   }
   * }
   * @return {object} promise for command
   */
  device.pollPacketTimes = function(time, callback) {
    return device._coreTimeCmd(commands.pollTimes, time, callback);
  };
};
