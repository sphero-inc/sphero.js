"use strict";

var utils = require("../utils"),
    commands = require("../commands/sphero");

module.exports = function sphero(device) {
  // Sphero Virtual Device Address = 0x02
  var command = device.command.bind(device, 0x02);

  device.setHeading = function(heading, callback) {
    heading = utils.intToHexArray(heading, 2);
    command(commands.setHeading, heading, callback);
  };

  device.setStabilization = function(flag, callback) {
    flag &= 0x01;
    command(commands.setStabilization, [flag], callback);
  };

  device.setRotationRate = function(rotation, callback) {
    rotation &= 0xFF;
    command(commands.setRotationRate, [rotation], callback);
  };

  device.getChassisId = function(callback) {
    command(commands.getChassisId, null, callback);
  };

  device.setChassisId = function(chassisId, callback) {
    chassisId = utils.intToHexArray(chassisId, 2);
    command(commands.getChassisId, chassisId, callback);
  };

  device.selfLevel = function(opts, callback) {
    var data = [
      opts.options,
      opts.angleLimit,
      opts.timeout,
      opts.trueTime
    ];
    command(commands.selfLevel, data, callback);
  };

  device.setDataStreaming = function(opts, callback) {
    var n = utils.intToHexArray(opts.n, 2),
        m = utils.intToHexArray(opts.m, 2),
        mask1 = utils.intToHexArray(opts.mask1, 4),
        pcnt = opts.pcnt &= 0xff,
        mask2 = utils.intToHexArray(opts.mask2, 4);

    var data = [].concat(n, m, mask1, pcnt, mask2);

    command(commands.setDataStreaming, data, callback);
  };

  device.configureCollisions = function(opts, cb) {
    var data = [
      opts.meth,
      opts.xt,
      opts.xs,
      opts.yt,
      opts.ys,
      opts.dead
    ];
    command(commands.setCollisionDetection, data, cb);
  };

  device.configureLocator = function(opts, callback) {
    var flags = opts.flags & 0xFF,
        x = utils.intToHexArray(opts.x, 2),
        y = utils.intToHexArray(opts.y, 2),
        yawTare = utils.intToHexArray(opts.yawTare, 2);

    var data = [].concat(flags, x, y, yawTare);

    command(commands.locator, data, callback);
  };

  device.setAccelRange = function(ldx, callback) {
    ldx &= ldx;
    command(commands.setAccelerometer, [ldx], callback);
  };

  device.readLocator = function(callback) {
    command(commands.readLocator, null, callback);
  };

  device.setRGBLed = function(opts, callback) {
    var data = [opts.red, opts.green, opts.blue, opts.flag || 0x01];

    for (var i = 0; i < data.length; i++) {
      data[i] &= 0xFF;
    }

    command(commands.setRGBLed, data, callback);
  };

  device.getRGBColor = function(callback) {
    command(commands.getRGBLed, null, callback);
  };

  device.setBackLed = function(brightness, callback) {
    command(commands.setBackLed, [brightness], callback);
  };

  device.getRGBLed = function(callback) {
    command(commands.getRGBLed, null, callback);
  };

  device.roll = function(speed, heading, state, callback) {
    if (typeof state === "function") {
      callback = state;
      state = 0x01;
    }

    speed &= 0xFF;
    heading = utils.intToHexArray(heading, 2);
    state &= 0x03;

    var data = [].concat(speed, heading, state);

    command(commands.roll, data, callback);
  };

  device.boost = function(boost, callback) {
    boost &= 0x01;
    command(commands.boost, [boost], callback);
  };

  device.setRawMotors = function(opts, callback) {
    var lmode = opts.lmode & 0x07,
        lpower = opts.lpower & 0xFF,
        rmode = opts.rmode & 0x07,
        rpower = opts.rpower & 0xFF;

    var data = [lmode, lpower, rmode, rpower];

    command(commands.setRawMotors, data, callback);
  };

  device.setMotionTimeout = function(time, callback) {
    time = utils.intToHexArray(time, 2);
    command(commands.setMotionTimeout, time, callback);
  };

  device.setPermOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    command(commands.setOptionsFlag, flags, callback);
  };

  device.getPermOptionFlags = function(callback) {
    command(commands.getOptionsFlag, null, callback);
  };

  device.setTempOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    command(commands.setTempOptFlags, flags, callback);
  };

  device.getTempOptionFlags = function(callback) {
    command(commands.getTempOptFlags, null, callback);
  };

  device.getConfigBlock = function(id, callback) {
    id &= 0xFF;
    command(commands.getConfigBlock, [id], callback);
  };

  device._setSSBBlock = function(cmd, pwd, block, callback) {
    pwd = utils.intToHexArray(pwd, 4);
    var data = [].concat(pwd, block);
    command(cmd, data, callback);
  };

  /** Sets the SSB modifier block
   *
   * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
   * @param { Array } block - An array of bytes with the data to be written
   * @param { genericCallback } cb - To be triggered when done
   * @returns { Undefined } Does not return anything
   */
  device.setSSBModBlock = function(pwd, block, cb) {
    device._setSSBBlock(commands.setSSBParams, pwd, block, cb);
  };

  device.setDeviceMode = function(mode, callback) {
    mode &= 0x01;
    command(commands.setDeviceMode, [mode], callback);
  };

  /** Sets configuration block
   *
   * @param { Array } block - An array of bytes with the data to be written
   * @param { genericCallback } callback - To be triggered when done
   * @returns { Undefined } Does not return anything
   */
  device.setConfigBlock = function(block, callback) {
    command(commands.setConfigBlock, block, callback);
  };

  device.getDeviceMode = function(callback) {
    command(commands.getDeviceMode, null, callback);
  };

  device.getSSB = function(callback) {
    command(commands.getSSB, null, callback);
  };

  /** Sets the SSB modifier block
   *
   * @param { Hex } pwd - 32 bit (4 bytes) hexadecimal value
   * @param { Array } block - An array of bytes with the data to be written
   * @param { genericCallback } cb - To be triggered when done
   * @returns { Undefined } Does not return anything
   */
  device.setSSB = function(pwd, block, cb) {
    device._setSSBBlock(commands.setSSB, pwd, block, cb);
  };

  device.refillBank = function(type, callback) {
    type &= 0xFF;
    command(commands.ssbRefill, [type], callback);
  };

  device.buyConsumable = function(id, qty, callback) {
    id &= 0xFF;
    qty &= 0xFF;
    command(commands.ssbBuy, [id, qty], callback);
  };

  device.useConsumable = function(id, callback) {
    id &= 0xFF;
    command(commands.ssbBuy, [id], callback);
  };

  device.grantCores = function(pw, qty, flags, callback) {
    pw = utils.intToHexArray(pw, 4);
    qty = utils.intToHexArray(qty, 4);
    flags &= 0xFF;

    var data = [].concat(pw, qty, flags);

    command(commands.ssbGrantCores, data, callback);
  };

  device._xpAndLevelUp = function(cmd, pw, gen, cb) {
    pw = utils.intToHexArray(pw, 4);
    gen &= 0xFF;

    command(cmd, [].concat(pw, gen), cb);
  };

  device.addXp = function(pw, qty, callback) {
    device.xpOrLevelUp(commands.ssbAddXp, pw, qty, callback);
  };

  device.levelUpAttr = function(pw, id, callback) {
    device.xpOrLevelUp(commands.ssbLevelUpAttr, pw, id, callback);
  };

  device.getPasswordSeed = function(callback) {
    command(commands.getPwSeed, null, callback);
  };

  device.enableSSBAsyncMsg = function(flag, callback) {
    flag &= 0x01;
    command(commands.ssbEnableAsync, [flag], callback);
  };

  device.runMacro = function(id, callback) {
    id &= 0xFF;
    command(commands.runMacro, [id], callback);
  };

  /** Save temporary macro
   *
   * @param { Array } macro - An array of bytes with the data to be written
   * @param { genericCallback } callback - To be triggered when done
   * @returns { Undefined } Does not return anything
   */
  device.saveTempMacro = function(macro, callback) {
    command(commands.saveTempMacro, macro, callback);
  };

  /** Save temporary macro
   *
   * @param { Array } macro - An array of bytes with the data to be written
   * @param { genericCallback } callback - To be triggered when done
   * @returns { Undefined } Does not return anything
   */
  device.saveMacro = function(macro, callback) {
    command(commands.saveMacro, macro, callback);
  };

  device.reInitMacroExec = function(callback) {
    command(commands.initMacroExecutive, null, callback);
  };

  device.abortMacro = function(callback) {
    command(commands.abortMacro, null, callback);
  };

  device.getMacroStatus = function(callback) {
    command(commands.macroStatus, null, callback);
  };

  device.setMacroParam = function(index, val1, val2, callback) {
    command(
      commands.setMacroParam,
      utils.argsToHexArray(index, val1, val2),
      callback
    );
  };

  device.appendMacroChunk = function(chunk, callback) {
    command(commands.appendTempMacroChunk, chunk, callback);
  };

  device.eraseOrbBasicStorage = function(area, callback) {
    area &= 0xFF;
    command(commands.appendTempMacroChunk, [area], callback);
  };

  device.appendOrbBasicFragment = function(area, code, callback) {
    area &= 0xFF;
    var data = [].concat(area, code);
    command(commands.eraseOrbBasic, data, callback);
  };

  device.executeOrbBasicProgram = function(area, slMSB, slLSB, callback) {
    command(
      commands.execOrbBasic,
      utils.argsToHexArray(area, slMSB, slLSB),
      callback
    );
  };

  device.abortOrbBasicProgram = function(callback) {
    command(commands.abortOrbBasic, null, callback);
  };

  device.submitValueToInput = function(val, callback) {
    val = utils.intToHexArray(val, 4);
    command(commands.answerInput, val, callback);
  };

  device.commitToFlash = function(callback) {
    command(commands.commitToFlash, null, callback);
  };

  device._commitToFlashAlias = function(callback) {
    command(commands.commitToFlashAlias, null, callback);
  };
};

/* Generic callback to be triggered when done
 *
 * @callback Sphero~genericCallback
 * @param { Error } err - The error if any, null otherwise
 * @param { packet } packet - The packet we got back from sphero
 */
