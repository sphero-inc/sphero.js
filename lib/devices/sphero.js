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
      this.spheroCommand(commands.selfLevel, data, callback);
    },

    setDataStreaming: function(n, m, mask1, pcnt, mask2, callback) {
      n = utils.intToHexArray(n, 2);
      m = utils.intToHexArray(n, 2);
      mask1 = utils.intToHexArray(mask1, 4);
      pcnt &= 0xff;
      mask2 = utils.intToHexArray(mask2, 4);

      var data = [].concat(n, m, mask1, pcnt, mask2);

      this.spheroCommand(commands.setDataStreaming, data, callback);
    },

    configureCollisionDetection: function(meth, xt, xs, yt, ys, dead, cb) {
      var data = [meth, xt, xs, yt, ys, dead];
      this.spheroCommand(commands.setCollisionDetection, data, cb);
    },

    configureLocator: function(flags, x, y, yawTare, callback) {
      x = utils.intToHexArray(x, 2);
      y = utils.intToHexArray(y, 2);
      yawTare = utils.intToHexArray(yawTare, 2);

      var data = [].concat(x, y, yawTare);

      this.spheroCommand(commands.locator, data, callback);
    },

    setAccelerometerRange: function(ldx, callback) {
      ldx &= ldx;
      this.spheroCommand(commands.setAccelerometer, [ldx], callback);
    },

    readLocator: function(callback) {
      this.spheroCommand(commands.readLocator, null, callback);
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

    setBackLed: function(brightness, callback) {
      this.spheroCommand(commands.setBackLed, [brightness], callback);
    },

    getRGBLed: function(callback) {
      this.spheroCommand(commands.getRGBLed, null, callback);
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

    boost: function(boost, callback) {
      boost &= 0x01;
      this.spheroCommand(commands.boost, [boost], callback);
    },

    setRawMotors: function(lmode, lpower, rmode, rpower, callback) {
      lmode &= 0x07;
      lpower &= 0xFF;
      rmode &= 0x07;
      rpower &= 0xFF;

      var data = [lmode, lpower, rmode, rpower];

      this.spheroCommand(commands.setRawMotors, data, callback);
    },

    setMotionTimeout: function(time, callback) {
      time = utils.intToHexArray(time, 2);
      this.spheroCommand(commands.setMotionTo, time, callback);
    },

    setPermOptionFlags: function(flags, callback) {
      flags = utils.intToHexArray(flags, 4);
      this.spheroCommand(commands.setOptionsFlag, flags, callback);
    },

    getPermOptionFlags: function(callback) {
      this.spheroCommand(commands.getOptionsFlag, null, callback);
    },

    setTempOptionFlags: function(flags, callback) {
      flags = utils.intToHexArray(flags, 4);
      this.spheroCommand(commands.setTempOptFlags, flags, callback);
    },

    getTempOptionFlags: function(callback) {
      this.spheroCommand(commands.getTempOptFlags, null, callback);
    },

    getConfigBlock: function(id, callback) {
      id &= 0xFF;
      this.spheroCommand(commands.getConfigBlk, [id], callback);
    },

    /** Sets the SSB modifier block
     *
     * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
     * @param { Array } block - An array of bytes with the data to be written
     * @param { genericCallback } callback - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    setSSBModBlock: function(pwd, block, callback) {
      pwd = utils.intToHexArray(pwd, 4);

      var data = [].concat(pwd, block);

      this.spheroCommand(commands.setSSBParams, data, callback);
    },

    setDeviceMode: function(mode, callback) {
      mode &= 0x01;
      this.spheroCommand(commands.setDeviceMode, [mode], callback);
    },

    /** Sets configuration block
     *
     * @param { Array } block - An array of bytes with the data to be written
     * @param { genericCallback } callback - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    setConfigBlock: function(block, callback) {
      this.spheroCommand(commands.setConfigBlock, block, callback);
    },

    getDeviceMode: function(callback) {
      this.spheroCommand(commands.getDeviceMode, null, callback);
    },

    getSSB: function(callback) {
      this.spheroCommand(commands.getSSB, null, callback);
    },

    /** Sets the SSB modifier block
     *
     * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
     * @param { Array } block - An array of bytes with the data to be written
     * @param { genericCallback } callback - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    setSSB: function(pwd, block, callback) {
      pwd = utils.intToHexArray(pwd, 4);

      var data = [].concat(pwd, block);

      this.spheroCommand(commands.setSSB, data, callback);
    },

    refillBank: function(type, callback) {
      type &= 0xFF;
      this.spheroCommand(commands.ssbRefill, [type], callback);
    },

    buyConsumable: function(id, qty, callback) {
      id &= 0xFF;
      qty &= 0xFF;
      this.spheroCommand(commands.ssbBuy, [id, qty], callback);
    },

    useConsumable: function(id, callback) {
      id &= 0xFF;
      this.spheroCommand(commands.ssbBuy, [id], callback);
    },

    grantCores: function(pw, qty, flags, callback) {
      pw = utils.intToHexArray(pw, 4);
      qty = utils.intToHexArray(qty, 4);
      flags &= 0xFF;

      var data = [].concat(pw, qty, flags);

      this.spheroCommand(commands.ssbBuy, data, callback);
    },

  };

  return sphero;
};

/* Generic callback to be triggered when done
 *
 * @callback Sphero~genericCallback
 * @param { Error } err - The error if any, null otherwise
 * @param { packet } packet - The packet we got back from sphero
 */
