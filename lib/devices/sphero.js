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

    selfLevel: function(opts, callback) {
      var data = [
        opts.options,
        opts.angleLimit,
        opts.timeout,
        opts.trueTime
      ];
      this.spheroCommand(commands.selfLevel, data, callback);
    },

    setDataStreaming: function(opts, callback) {
      var n = utils.intToHexArray(opts.n, 2),
          m = utils.intToHexArray(opts.m, 2),
          mask1 = utils.intToHexArray(opts.mask1, 4),
          pcnt = opts.pcnt &= 0xff,
          mask2 = utils.intToHexArray(opts.mask2, 4);

      var data = [].concat(n, m, mask1, pcnt, mask2);

      this.spheroCommand(commands.setDataStreaming, data, callback);
    },

    configureCollisionDetection: function(opts, cb) {
      var data = [
        opts.meth,
        opts.xt,
        opts.xs,
        opts.yt,
        opts.ys,
        opts.dead
      ];
      this.spheroCommand(commands.setCollisionDetection, data, cb);
    },

    configureLocator: function(opts, callback) {
      var flags = opts.flags & 0xFF,
          x = utils.intToHexArray(opts.x, 2),
          y = utils.intToHexArray(opts.y, 2),
          yawTare = utils.intToHexArray(opts.yawTare, 2);

      var data = [].concat(flags, x, y, yawTare);

      this.spheroCommand(commands.locator, data, callback);
    },

    setAccelerometerRange: function(ldx, callback) {
      ldx &= ldx;
      this.spheroCommand(commands.setAccelerometer, [ldx], callback);
    },

    readLocator: function(callback) {
      this.spheroCommand(commands.readLocator, null, callback);
    },

    setRGBLed: function(opts, callback) {
      var data = [opts.red, opts.green, opts.blue, opts.flag || 0x01];

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

    setRawMotors: function(opts, callback) {
      var lmode = opts.lmode & 0x07,
          lpower = opts.lpower & 0xFF,
          rmode = opts.rmode & 0x07,
          rpower = opts.lpower & 0xFF;

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

    _setSSBBlock: function(cmd, pwd, block, callback) {
      pwd = utils.intToHexArray(pwd, 4);
      var data = [].concat(pwd, block);
      this.spheroCommand(commands.setSSBParams, data, callback);
    },

    /** Sets the SSB modifier block
     *
     * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
     * @param { Array } block - An array of bytes with the data to be written
     * @param { genericCallback } cb - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    setSSBModBlock: function(pwd, block, cb) {
      this._setSSBBlock(commands.setSSBParams, pwd, block, cb);
    },

    /** Sets the SSB modifier block
     *
     * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
     * @param { Array } block - An array of bytes with the data to be written
     * @param { genericCallback } cb - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    setSSB: function(pwd, block, cb) {
      this._setSSBBlock(commands.setSSB, pwd, block, cb);
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

      this.spheroCommand(commands.ssbGrantCores, data, callback);
    },

    addXp: function(pw, qty, callback) {
      pw = utils.intToHexArray(pw, 4);
      qty &= 0xFF;

      this.spheroCommand(commands.ssbAddXp, [].concat(pw, qty), callback);
    },

    levelUpAttr: function(pw, id, callback) {
      pw = utils.intToHexArray(pw, 4);
      id &= 0xFF;

      this.spheroCommand(commands.ssbLevelUpAttr, [].concat(pw, id), callback);
    },

    getPasswordSeed: function(callback) {
      this.spheroCommand(commands.getPwSeed, null, callback);
    },

    enableSSBAsyncMsg: function(flag, callback) {
      flag &= 0x01;
      this.spheroCommand(commands.ssbEnableAsync, [flag], callback);
    },

    runMacro: function(id, callback) {
      id &= 0xFF;
      this.spheroCommand(commands.runMacro, [id], callback);
    },

    /** Save temporary macro
     *
     * @param { Array } macro - An array of bytes with the data to be written
     * @param { genericCallback } callback - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    saveTempMacro: function(macro, callback) {
      this.spheroCommand(commands.saveTempMacro, macro, callback);
    },

    /** Save temporary macro
     *
     * @param { Array } macro - An array of bytes with the data to be written
     * @param { genericCallback } callback - To be triggered when done
     * @returns { Undefined } Does not return anything
     */
    saveMacro: function(macro, callback) {
      this.spheroCommand(commands.saveMacro, macro, callback);
    },

    reInitMacroExec: function(callback) {
      this.spheroCommand(commands.initMacroExecutive, null, callback);
    },

    abortMacro: function(callback) {
      this.spheroCommand(commands.abortMacro, null, callback);
    },

    getMacroStatus: function(callback) {
      this.spheroCommand(commands.macroStatus, null, callback);
    },

    setMacroParam: function(index, val1, val2, callback) {
      index &= 0xFF;
      val1 &= 0xFF;
      val2 &= 0xFF;

      this.spheroCommand(commands.setMacroParam, [index, val1, val2], callback);
    },

    appendMacroChunk: function(chunk, callback) {
      this.spheroCommand(commands.appendTempMacroChunk, chunk, callback);
    },

    eraseOrbBasicStorage: function(area, callback) {
      area &= 0xFF;
      this.spheroCommand(commands.appendTempMacroChunk, [area], callback);
    },

    appendOrbBasicFragment: function(area, code, callback) {
      area &= 0xFF;
      var data = [].concat(area, code);
      this.spheroCommand(commands.eraseOrbBasic, data, callback);
    },

    executeOrbBasicProgram: function(area, slMSB, slLSB, callback) {
      area &= 0xFF;
      slMSB &= 0xFF;
      slLSB &= 0xFF;

      this.spheroCommand(commands.execOrbBasic, [area, slMSB, slLSB], callback);
    },

    abortOrbBasicProgram: function(callback) {
      this.spheroCommand(commands.abortOrbBasic, null, callback);
    },

    submitValueToInput: function(val, callback) {
      val = utils.intToHexArray(val, 4);
      this.spheroCommand(commands.answerInput, val, callback);
    },

    commitToFlash: function(callback) {
      this.spheroCommand(commands.commitToFlash, null, callback);
    },

    _commitToFlashAlias: function(callback) {
      this.spheroCommand(commands.commitToFlashAlias, null, callback);
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
