"use strict";

var utils = require("../utils"),
    commands = require("../commands/sphero");

module.exports = function sphero(device) {
  // Sphero Virtual Device Address = 0x02
  var command = device.command.bind(device, 0x02);

  /**
   * The Set Heading command tells Sphero to adjust it's orientation, by
   * commanding a new reference heading (in degrees).
   *
   * If stabilization is enabled, Sphero will respond immediately to this.
   *
   * @param {Number} heading Sphero's new reference heading, in degrees (0-359)
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setHeading(180, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setHeading = function(heading, callback) {
    heading = utils.intToHexArray(heading, 2);
    return command(commands.setHeading, heading, callback);
  };

  /**
   * The Set Stabilization command turns Sphero's internal stabilization on or
   * off, depending on the flag provided.
   *
   * @param {Number} flag stabilization setting flag (0 - off, 1 - on)
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setStabilization(1, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setStabilization = function(flag, callback) {
    flag &= 0x01;
    return command(commands.setStabilization, [flag], callback);
  };

  /**
   * The Set Rotation Rate command allows control of the rotation rate Sphero
   * uses to meet new heading commands.
   *
   * A lower value offers better control, but with a larger turning radius.
   *
   * Higher values yield quick turns, but Sphero may lose control.
   *
   * The provided value is in units of 0.784 degrees/sec.
   *
   * @param {Number} rotation new rotation rate (0-255)
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setRotationRate(180, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setRotationRate = function(rotation, callback) {
    rotation &= 0xFF;
    return command(commands.setRotationRate, [rotation], callback);
  };

  /**
   * The Get Chassis ID command returns the 16-bit chassis ID Sphero was
   * assigned at the factory.
   *
   * @param {Function} callback function to be triggered with a response
   * @example
   * orb.getChassisId(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  chassisId:", data.chassisId);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getChassisId = function(callback) {
    return command(commands.getChassisId, null, callback);
  };

  /**
   *
   * The Set Chassis ID command assigns Sphero's chassis ID, a 16-bit value.
   *
   * This command only works if you're at the factory.
   *
   * @param {Number} chassisId new chassis ID
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setChassisId(0xFE75, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setChassisId = function(chassisId, callback) {
    chassisId = utils.intToHexArray(chassisId, 2);
    return command(commands.getChassisId, chassisId, callback);
  };

  /**
   * The Self Level command controls Sphero's self-level routine.
   *
   * This routine attempts to achieve a horizontal orientation where pitch/roll
   * angles are less than the provided Angle Limit.
   *
   * After both limits are satisfied, option bits control sleep, final
   * angle(heading), and control system on/off.
   *
   * An asynchronous message is returned when the self level routine completes.
   *
   * For more detail on opts param, see the Sphero API documentation.
   *
   * opts:
   *  - angleLimit: 0 for defaul, 1 - 90 to set.
   *  - timeout: 0 for default, 1 - 255 to set.
   *  - trueTime: 0 for default, 1 - 255 to set.
   *  - options: bitmask 4bit e.g. 0xF;
   * };
   *
   * @param {Object} opts self-level routine options
   * @param {Function} callback function to be triggered after writing
   * @example
   * var opts = {
   *   angleLimit: 0,
   *   timeout: 0, ,
   *   trueTime: 0,
   *   options: 0x7
   * };
   *
   * orb.selfLevel(opts, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.selfLevel = function(opts, callback) {
    var data = [
      opts.options,
      opts.angleLimit,
      opts.timeout,
      opts.trueTime
    ];
    return command(commands.selfLevel, data, callback);
  };

  /**
   * The Set Data Streaming command configures Sphero's built-in support for
   * asynchronously streaming certain system and sensor data.
   *
   * This command selects the internal sampling frequency, packet size,
   * parameter mask, and (optionally) the total number of packets.
   *
   * These options are provided as an object, with the following properties:
   *
   * - **n** - divisor of the maximum sensor sampling rate
   * - **m** - number of sample frames emitted per packet
   * - **mask1** - bitwise selector of data sources to stream
   * - **pcnt** - packet count 1-255 (or 0, for unlimited streaming)
   * - **mask2** - bitwise selector of more data sources to stream (optional)
   *
   * For more explanation of these options, please see the Sphero API
   * documentation.
   *
   * @param {Object} opts object containing streaming data options
   * @param {Function} callback function to be triggered after writing
   * @example
   * var opts = {
   *   n: 400,
   *   m: 1,
   *   mask1: 0x00000000,
   *   mask2: 0x01800000,
   *   pcnt: 0
   * };
   *
   * orb.setDataStreaming(opts, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setDataStreaming = function(opts, callback) {
    var n = utils.intToHexArray(opts.n, 2),
        m = utils.intToHexArray(opts.m, 2),
        mask1 = utils.intToHexArray(opts.mask1, 4),
        pcnt = opts.pcnt &= 0xff,
        mask2 = utils.intToHexArray(opts.mask2, 4);

    device.ds = {
      mask1: opts.mask1,
      mask2: opts.mask2
    };

    var data = [].concat(n, m, mask1, pcnt, mask2);

    return command(commands.setDataStreaming, data, callback);
  };

  /**
   * The Configure Collisions command configures Sphero's collision detection
   * with the provided parameters.
   *
   * These include:
   *
   * - **meth** - which detection method to use. Supported methods are 0x01,
   *   0x02, and 0x03 (see the collision detection document for details). 0x00
   *   disables this service.
   * - **xt, yt** - 8-bit settable threshold for the X (left, right) and
   *   y (front, back) axes of Sphero. 0x00 disables the contribution of that
   *   axis.
   * - **xs, ys** - 8-bit settable speed value for X/Y axes. This setting is
   *   ranged by the speed, than added to `xt` and `yt` to generate the final
   *   threshold value.
   * - **dead** - an 8-bit post-collision dead time to prevent re-triggering.
   *   Specified in 10ms increments.
   *
   * @param {Object} opts object containing collision configuration opts
   * @param {Function} cb function to be triggered after writing
   * @example
   * var opts = {
   *   meth: 0x01,
   *   xt: 0x0F,
   *   xs: 0x0F,
   *   yt: 0x0A,
   *   ys: 0x0A,
   *   dead: 0x05
   * };
   *
   * orb.configureCollisions(opts, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.configureCollisions = function(opts, cb) {
    var data = [
      opts.meth,
      opts.xt,
      opts.xs,
      opts.yt,
      opts.ys,
      opts.dead
    ];
    return command(commands.setCollisionDetection, data, cb);
  };

  /**
   * The Configure Locator command configures Sphero's streaming location data
   * service.
   *
   * The following options must be provided:
   *
   * - **flags** - bit 0 determines whether calibrate commands auto-correct the
   *   yaw tare value. When false, positive Y axis coincides with heading 0.
   *   Other bits are reserved.
   * - **x, y** - the current (x/y) coordinates of Sphero on the ground plane in
   *   centimeters
   * - **yawTare** - controls how the x,y-plane is aligned with Sphero's heading
   *   coordinate system. When zero, yaw = 0 corresponds to facing down the
   *   y-axis in the positive direction. Possible values are 0-359 inclusive.
   *
   * @param {Object} opts object containing locator service configuration
   * @param {Function} callback function to be triggered after writing
   * @example
   * var opts = {
   *   flags: 0x01,
   *   x: 0x0000,
   *   y: 0x0000,
   *   yawTare: 0x0
   * };
   *
   * orb.configureLocator(opts, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.configureLocator = function(opts, callback) {
    var flags = opts.flags & 0xFF,
        x = utils.intToHexArray(opts.x, 2),
        y = utils.intToHexArray(opts.y, 2),
        yawTare = utils.intToHexArray(opts.yawTare, 2);

    var data = [].concat(flags, x, y, yawTare);

    return command(commands.locator, data, callback);
  };

  /**
   * The Set Accelerometer Range command tells Sphero what accelerometer range
   * to use.
   *
   * By default, Sphero's solid-state accelerometer is set for a range of ±8Gs.
   * You may wish to change this, perhaps to resolve finer accelerations.
   *
   * This command takes an index for the supported range, as explained below:
   *
   * - `0`: ±2Gs
   * - `1`: ±4Gs
   * - `2`: ±8Gs (default)
   * - `3`: ±16Gs
   *
   * @param {Number} idx what accelerometer range to use
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setAccelRange(0x02, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setAccelRange = function(idx, callback) {
    idx &= idx;
    return command(commands.setAccelerometer, [idx], callback);
  };

  /**
   * The Read Locator command gets Sphero's current position (X,Y), component
   * velocities, and speed-over-ground (SOG).
   *
   * The position is a signed value in centimeters, the component velocities are
   * signed cm/sec, and the SOG is unsigned cm/sec.
   *
   * @param {Function} callback function to be triggered with data
   * @example
   * orb.readLocator(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  xpos:", data.xpos);
   *     console.log("  ypos:", data.ypos);
   *     console.log("  xvel:", data.xvel);
   *     console.log("  yvel:", data.yvel);
   *     console.log("  sog:", data.sog);
   *   }
   * }
   * @return {object} promise for command
   */
  device.readLocator = function(callback) {
    return command(commands.readLocator, null, callback);
  };

  /**
   * The Set RGB LED command sets the colors of Sphero's RGB LED.
   *
   * An object containaing `red`, `green`, and `blue` values must be provided.
   *
   * If `opts.flag` is set to 1 (default), the color is persisted across power
   * cycles.
   *
   * @param {Object} opts object containing RGB values for Sphero's LED
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setRgbLed({ red: 0, green: 0, blue: 255 }, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setRgbLed = function(opts, callback) {
    var data = [opts.red, opts.green, opts.blue, opts.flag || 0x01];

    for (var i = 0; i < data.length; i++) {
      data[i] &= 0xFF;
    }

    return command(commands.setRgbLed, data, callback);
  };

  /**
   * The Set Back LED command allows brightness adjustment of Sphero's tail
   * light.
   *
   * This value does not persist across power cycles.
   *
   * @param {Number} brightness brightness to set to Sphero's tail light
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.setbackLed(255, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setBackLed = function(brightness, callback) {
    return command(commands.setBackLed, [brightness], callback);
  };

  /**
   * The Get RGB LED command fetches the current "user LED color" value, stored
   * in Sphero's configuration.
   *
   * This value may or may not be what's currently displayed by Sphero's LEDs.
   *
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.getRgbLed(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  color:", data.color);
   *     console.log("  red:", data.red);
   *     console.log("  green:", data.green);
   *     console.log("  blue:", data.blue);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getRgbLed = function(callback) {
    return command(commands.getRgbLed, null, callback);
  };

  /**
   * The Roll command tells Sphero to roll along the provided vector.
   *
   * Both a speed and heading are required, the latter is considered relative to
   * the last calibrated direction.
   *
   * Permissible heading values are 0 to 359 inclusive.
   *
   * @param {Number} speed what speed Sphero should roll at
   * @param {Number} heading what heading Sphero should roll towards (0-359)
   * @param {Number} [state] optional state parameter
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.roll(100, 0, function() {
   *   console.log("rolling...");
   * }
   * @return {object} promise for command
   */
  device.roll = function(speed, heading, state, callback) {
    if (typeof state === "function" || typeof state === "undefined") {
      callback = state;
      state = 0x01;
    }

    speed &= 0xFF;
    heading = utils.intToHexArray(heading, 2);
    state &= 0x03;

    var data = [].concat(speed, heading, state);

    return command(commands.roll, data, callback);
  };

  /**
   * The Boost command executes Sphero's boost macro.
   *
   * It takes a 1-byte parameter, 0x01 to start boosting, or 0x00 to stop.
   *
   * @param {Number} boost whether or not to boost (1 - yes, 0 - no)
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.boost(1, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.boost = function(boost, callback) {
    boost &= 0x01;
    return command(commands.boost, [boost], callback);
  };

  /**
   * The Set Raw Motors command allows manual control over one or both of
   * Sphero's motor output values.
   *
   * Each motor (left and right requires a mode and a power value from 0-255.
   *
   * This command will disable stabilization is both mode's aren't "ignore", so
   * you'll need to re-enable it once you're done.
   *
   * Possible modes:
   *
   * - `0x00`: Off (motor is open circuit)
   * - `0x01`: Forward
   * - `0x02`: Reverse
   * - `0x03`: Brake (motor is shorted)
   * - `0x04`: Ignore (motor mode and power is left unchanged
   *
   * @param {Object} opts object with mode/power values (e.g. lmode, lpower)
   * @param {Function} callback function to be triggered after writing
   * @example
   * var opts = {
   *   lmode: 0x01,
   *   lpower: 180,
   *   rmode: 0x02,
   *   rpower: 180
   * }
   *
   * orb.setRawMotors(opts, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setRawMotors = function(opts, callback) {
    var lmode = opts.lmode & 0x07,
        lpower = opts.lpower & 0xFF,
        rmode = opts.rmode & 0x07,
        rpower = opts.rpower & 0xFF;

    var data = [lmode, lpower, rmode, rpower];

    return command(commands.setRawMotors, data, callback);
  };

  /**
   * The Set Motion Timeout command gives Sphero an ultimate timeout for the
   * last motion command to keep Sphero from rolling away in the case of
   * a crashed (or paused) application.
   *
   * This defaults to 2000ms (2 seconds) upon wakeup.
   *
   * @param {Number} time timeout length in milliseconds
   * @param {Function} callback function to be triggered when done writing
   * @example
   * orb.setMotionTimeout(0x0FFF, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setMotionTimeout = function(time, callback) {
    time = utils.intToHexArray(time, 2);
    return command(commands.setMotionTimeout, time, callback);
  };

  /**
   * The Set Permanent Option Flags command assigns Sphero's permanent option
   * flags to the provided values, and writes them immediately to the config
   * block.
   *
   * See below for the bit definitions.
   *
   * @param {Array} flags permanent option flags
   * @param {Function} callback function to be triggered when done writing
   * @example
   * // Force tail LED always on
   * orb.setPermOptionFlags(0x00000008, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setPermOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    return command(commands.setOptionsFlag, flags, callback);
  };

  /**
   * The Get Permanent Option Flags command returns Sphero's permanent option
   * flags, as a bit field.
   *
   * Here's possible bit fields, and their descriptions:
   *
   * - `0`: Set to prevent Sphero from immediately going to sleep when placed in
   *   the charger and connected over Bluetooth.
   * - `1`: Set to enable Vector Drive, that is, when Sphero is stopped and
   *   a new roll command is issued it achieves the heading before moving along
   *   it.
   * - `2`: Set to disable self-leveling when Sphero is inserted into the
   *   charger.
   * - `3`: Set to force the tail LED always on.
   * - `4`: Set to enable motion timeouts (see DID 02h, CID 34h)
   * - `5`: Set to enable retail Demo Mode (when placed in the charger, ball
   *   runs a slow rainbow macro for 60 minutes and then goes to sleep).
   * - `6`: Set double tap awake sensitivity to Light
   * - `7`: Set double tap awake sensitivity to Heavy
   * - `8`: Enable gyro max async message (NOT SUPPORTED IN VERSION 1.47)
   * - `6-31`: Unassigned
   *
   * @param {Function} callback function triggered with option flags data
   * @example
   * orb.getPermOptionFlags(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  sleepOnCharger:", data.sleepOnCharger);
   *     console.log("  vectorDrive:", data.vectorDrive);
   *     console.log("  selfLevelOnCharger:", data.selfLevelOnCharger);
   *     console.log("  tailLedAlwaysOn:", data.tailLedAlwaysOn);
   *     console.log("  motionTimeouts:", data.motionTimeouts);
   *     console.log("  retailDemoOn:", data.retailDemoOn);
   *     console.log("  awakeSensitivityLight:", data.awakeSensitivityLight);
   *     console.log("  awakeSensitivityHeavy:", data.awakeSensitivityHeavy);
   *     console.log("  gyroMaxAsyncMsg:", data.gyroMaxAsyncMsg);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getPermOptionFlags = function(callback) {
    return command(commands.getOptionsFlag, null, callback);
  };

  /**
   * The Set Temporary Option Flags command assigns Sphero's temporary option
   * flags to the provided values. These do not persist across power cycles.
   *
   * See below for the bit definitions.
   *
   * @param {Array} flags permanent option flags
   * @param {Function} callback function to be triggered when done writing
   * @example
   * // enable stop on disconnect behaviour
   * orb.setTempOptionFlags(0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setTempOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    return command(commands.setTempOptionFlags, flags, callback);
  };

  /**
   * The Get Temporary Option Flags command returns Sphero's temporary option
   * flags, as a bit field:
   *
   * - `0`: Enable Stop On Disconnect behavior
   * - `1-31`: Unassigned
   *
   * @param {Function} callback function triggered with option flags data
   * @example
   * orb.getTempOptionFlags(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  stopOnDisconnect:", data.stopOnDisconnect);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getTempOptionFlags = function(callback) {
    return command(commands.getTempOptionFlags, null, callback);
  };

  /**
   * The Get Configuration Block command retrieves one of Sphero's configuration
   * blocks.
   *
   * The response is a simple one; an error code of 0x08 is returned when the
   * resources are currently unavailable to send the requested block back. The
   * actual configuration block data returns in an asynchronous message of type
   * 0x04 due to its length (if there is no error).
   *
   * ID = `0x00` requests the factory configuration block
   * ID = `0x01` requests the user configuration block, which is updated with
   * current values first
   *
   * @param {Number} id which configuration block to fetch
   * @param {Function} callback function to be triggered after writing
   * @example
   * orb.getConfigBlock(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.getConfigBlock = function(id, callback) {
    id &= 0xFF;
    return command(commands.getConfigBlock, [id], callback);
  };

  device._setSsbBlock = function(cmd, pwd, block, callback) {
    pwd = utils.intToHexArray(pwd, 4);
    var data = [].concat(pwd, block);
    return command(cmd, data, callback);
  };

  /**
   * The Set SSB Modifier Block command allows the SSB to be patched with a new
   * modifier block - including the Boost macro.
   *
   * The changes take effect immediately.
   *
   * @param {Number} pwd a 32 bit (4 bytes) hexadecimal value
   * @param {Array} block array of bytes with the data to be written
   * @param {Function} callback a function to be triggered after writing
   * @example
   * orb.setSsbModBlock(0x0000000F, data, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setSsbModBlock = function(pwd, block, callback) {
    return device._setSsbBlock(commands.setSsbParams, pwd, block, callback);
  };

  /**
   * The Set Device Mode command assigns the operation mode of Sphero based on
   * the supplied mode value.
   *
   * - **0x00**: Normal mode
   * - **0x01**: User Hack mode. Enables ASCII shell commands, refer to the
   *   associated document for details.
   *
   * @param {Number} mode which mode to set Sphero to
   * @param {Function} callback function to be called after writing
   * @example
   * orb.setDeviceMode(0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setDeviceMode = function(mode, callback) {
    mode &= 0x01;
    return command(commands.setDeviceMode, [mode], callback);
  };

  /**
   * The Set Config Block command accepts an exact copy of the configuration
   * block, and loads it into the RAM copy of the configuration block.
   *
   * The RAM copy is then saved to flash.
   *
   * The configuration block can be obtained by using the Get Configuration
   * Block command.
   *
   * @private
   * @param {Array} block - An array of bytes with the data to be written
   * @param {Function} callback - To be triggered when done
   * @example
   * orb.setConfigBlock(dataBlock, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setConfigBlock = function(block, callback) {
    return command(commands.setConfigBlock, block, callback);
  };

  /**
   * The Get Device Mode command gets the current device mode of Sphero.
   *
   * Possible values:
   *
   * - **0x00**: Normal mode
   * - **0x01**: User Hack mode.
   *
   * @param {Function} callback function to be called with response
   * @example
   * orb.getDeviceMode(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  mode:", data.mode);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getDeviceMode = function(callback) {
    return command(commands.getDeviceMode, null, callback);
  };

  /**
   * The Get SSB command retrieves Sphero's Soul Block.
   *
   * The response is simple, and then the actual block of soulular data returns
   * in an asynchronous message of type 0x0D, due to it's 0x440 byte length
   *
   * @private
   * @param {Function} callback function to be called with response
   * @example
   * orb.getSsb(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.getSsb = function(callback) {
    return command(commands.getSsb, null, callback);
  };

  /**
   * The Set SSB command sets Sphero's Soul Block.
   *
   * The actual payload length is 0x404 bytes, but if you use the special DLEN
   * encoding of 0xff, Sphero will know what to expect.
   *
   * You need to supply the password in order for it to work.
   *
   * @private
   * @param {Number} pwd a 32 bit (4 bytes) hexadecimal value
   * @param {Array} block array of bytes with the data to be written
   * @param {Function} callback a function to be triggered after writing
   * @example
   * orb.setSsb(pwd, block, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setSsb = function(pwd, block, callback) {
    return device._setSsbBlock(commands.setSsb, pwd, block, callback);
  };

  /**
   * The Refill Bank command attempts to refill either the Boost bank (0x00) or
   * the Shield bank (0x01) by attempting to deduct the respective refill cost
   * from the current number of cores.
   *
   * If it succeeds, the bank is set to the maximum obtainable for that level,
   * the cores are spent, and a success response is returned with the lower core
   * balance.
   *
   * If there aren't enough cores available to spend, Sphero responds with an
   * EEXEC error (0x08)
   *
   * @private
   * @param {Number} type what bank to refill (0 - Boost, 1 - Shield)
   * @param {Function} callback function to be called with response
   * @example
   * orb.refillBank(0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.refillBank = function(type, callback) {
    type &= 0xFF;
    return command(commands.ssbRefill, [type], callback);
  };

  /**
   * The Buy Consumable command attempts to spend cores on consumables.
   *
   * The consumable ID is given (0 - 7), as well as the quantity requested to
   * purchase.
   *
   * If the purchase succeeds, the consumable count is increased, the cores are
   * spent, and a success response is returned with the increased quantity and
   * lower balance.
   *
   * If there aren't enough cores available to spend, or the purchase would
   * exceed the max consumable quantity of 255, Sphero responds with an EEXEC
   * error (0x08)
   *
   * @private
   * @param {Number} id what consumable to buy
   * @param {Number} qty how many consumables to buy
   * @param {Function} callback function to be called with response
   * @example
   * orb.buyConsumable(0x00, 5, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.buyConsumable = function(id, qty, callback) {
    id &= 0xFF;
    qty &= 0xFF;
    return command(commands.ssbBuy, [id, qty], callback);
  };

  /**
   * The Use Consumable command attempts to use a consumable if the quantity
   * remaining is non-zero.
   *
   * On success, the return message echoes the ID of this consumable and how
   * many of them remain.
   *
   * If the associated macro is already running, or the quantity remaining is
   * zero, this returns an EEXEC error (0x08).
   *
   * @private
   * @param {Number} id what consumable to use
   * @param {Function} callback function to be called with response
   * @example
   * orb.useConsumable(0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.useConsumable = function(id, callback) {
    id &= 0xFF;
    return command(commands.ssbUseConsumeable, [id], callback);
  };

  /**
   * The Grant Cores command adds the supplied number of cores.
   *
   * If the first bit in the flags byte is set, the command immediately commits
   * the SSB to flash. Otherwise, it does not.
   *
   * All other bits are reserved.
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @private
   * @param {Number} pw 32-bit password
   * @param {Number} qty 32-bit number of cores to add
   * @param {Number} flags 8-bit flags byte
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.grantCores(pwd, 5, 0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.grantCores = function(pw, qty, flags, callback) {
    pw = utils.intToHexArray(pw, 4);
    qty = utils.intToHexArray(qty, 4);
    flags &= 0xFF;

    var data = [].concat(pw, qty, flags);

    return command(commands.ssbGrantCores, data, callback);
  };

  device._xpOrLevelUp = function(cmd, pw, gen, cb) {
    pw = utils.intToHexArray(pw, 4);
    gen &= 0xFF;

    return command(cmd, [].concat(pw, gen), cb);
  };

  /**
   * The add XP command increases XP by adding the supplied number of minutes
   * of drive time, and immediately commits the SSB to flash.
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @private
   * @param {Number} pw 32-bit password
   * @param {Number} qty 8-bit number of minutes of drive time to add
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.addXp(pwd, 5, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.addXp = function(pw, qty, callback) {
    return device._xpOrLevelUp(commands.ssbAddXp, pw, qty, callback);
  };

  /**
   * The Level Up Attribute command attempts to increase the level of the
   * specified attribute by spending attribute points.
   *
   * The IDs are:
   *
   * - **0x00**: speed
   * - **0x01**: boost
   * - **0x02**: brightness
   * - **0x03**: shield
   *
   *
   * If successful, the SSB is committed to flash, and a response packet
   * containing the attribute ID, new level, and remaining attribute points is
   * returned.
   *
   * If there are not enough attribute points, this command returns an EEXEC
   * error (0x08).
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @private
   * @param {Number} pw 32-bit password
   * @param {Number} id which attribute to level up
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.levelUpAttr(pwd, 0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.levelUpAttr = function(pw, id, callback) {
    return device._xpOrLevelUp(commands.ssbLevelUpAttr, pw, id, callback);
  };

  /**
   * The Get Password Seed command returns Sphero's password seed.
   *
   * Protected Sphero commands require a password.
   *
   * Refer to the Sphero API documentation, Appendix D for more information.
   *
   * @private
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.getPasswordSeed(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.getPasswordSeed = function(callback) {
    return command(commands.getPwSeed, null, callback);
  };

  /**
   * The Enable SSB Async Messages command turns on/off soul block related
   * asynchronous messages.
   *
   * These include shield collision/regrowth messages, boost use/regrowth
   * messages, XP growth, and level-up messages.
   *
   * This feature defaults to off.
   *
   * @private
   * @param {Number} flag whether or not to enable async messages
   * @param {Function} callback function to be triggered after write
   * @example
   * orb.enableSsbAsyncMsg(0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.enableSsbAsyncMsg = function(flag, callback) {
    flag &= 0x01;
    return command(commands.ssbEnableAsync, [flag], callback);
  };

  /**
   * The Run Macro command attempts to execute the specified macro.
   *
   * Macro IDs are split into groups:
   *
   * 0-31 are System Macros. They are compiled into the Main Application, and
   * cannot be deleted. They are always available to run.
   *
   * 32-253 are User Macros. They are downloaded and persistently stored, and
   * can be deleted in total.
   *
   * 255 is the Temporary Macro, a special user macro as it is held in RAM for
   * execution.
   *
   * 254 is also a special user macro, called the Stream Macro that doesn't
   * require this call to begin execution.
   *
   * This command will fail if there is a currently executing macro, or the
   * specified ID code can't be found.
   *
   * @param {Number} id 8-bit Macro ID to run
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.runMacro(0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.runMacro = function(id, callback) {
    id &= 0xFF;
    return command(commands.runMacro, [id], callback);
  };

  /**
   * The Save Temporary Macro stores the attached macro definition into the
   * temporary RAM buffer for later execution.
   *
   * If this command is sent while a Temporary or Stream Macro is executing it
   * will be terminated so that its storage space can be overwritten. As with
   * all macros, the longest definition that can be sent is 254 bytes.
   *
   * @param {Array} macro array of bytes with the data to be written
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.saveTempMacro(0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.saveTempMacro = function(macro, callback) {
    return command(commands.saveTempMacro, macro, callback);
  };

  /** Save macro
   *
   * The Save Macro command stores the attached macro definition into the
   * persistent store for later execution. This command can be sent even if
   * other macros are executing.
   *
   * You will receive a failure response if you attempt to send an ID number in
   * the System Macro range, 255 for the Temp Macro and ID of an existing user
   * macro in the storage block.
   *
   * As with all macros, the longest definition that can be sent is 254 bytes.
   *
   * @param {Array} macro array of bytes with the data to be written
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.saveMacro(0x01, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.saveMacro = function(macro, callback) {
    return command(commands.saveMacro, macro, callback);
  };

  /**
   * The Reinit Macro Executive command terminates any running macro, and
   * reinitializes the macro system.
   *
   * The table of any persistent user macros is cleared.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.reInitMacroExec(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.reInitMacroExec = function(callback) {
    return command(commands.initMacroExecutive, null, callback);
  };

  /**
   * The Abort Macro command aborts any executing macro, and returns both it's
   * ID code and the command number currently in progress.
   *
   * An exception is a System Macro executing with the UNKILLABLE flag set.
   *
   * A returned ID code of 0x00 indicates that no macro was running, an ID code
   * of 0xFFFF as the CmdNum indicates the macro was unkillable.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.abortMacro(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  id:", data.id);
   *     console.log("  cmdNum:", data.cmdNum);
   *   }
   * }
   * @return {object} promise for command
   */
  device.abortMacro = function(callback) {
    return command(commands.abortMacro, null, callback);
  };

  /**
   * The Get Macro Status command returns the ID code and command number of the
   * currently executing macro.
   *
   * If no macro is running, the 0x00 is returned for the ID code, and the
   * command number is left over from the previous macro.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.getMacroStatus(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  idCode:", data.idCode);
   *     console.log("  cmdNum:", data.cmdNum);
   *   }
   * }
   * @return {object} promise for command
   */
  device.getMacroStatus = function(callback) {
    return command(commands.macroStatus, null, callback);
  };

  /**
   * The Set Macro Parameter command allows system globals that influence
   * certain macro commands to be selectively altered from outside of the macro
   * system itself.
   *
   * The values of Val1 and Val2 depend on the parameter index.
   *
   * Possible indices:
   *
   * - **00h** Assign System Delay 1: Val1 = MSB, Val2 = LSB
   * - **01h** Assign System Delay 2: Val1 = MSB, Val2 = LSB
   * - **02h** Assign System Speed 1: Val1 = speed, Val2 = 0 (ignored)
   * - **03h** Assign System Speed 2: Val1 = speed, Val2 = 0 (ignored)
   * - **04h** Assign System Loops: Val1 = loop count, Val2 = 0 (ignored)
   *
   * For more details, please refer to the Sphero Macro document.
   *
   * @param {Number} index what parameter index to use
   * @param {Number} val1 value 1 to set
   * @param {Number} val2 value 2 to set
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.setMacroParam(0x02, 0xF0, 0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.setMacroParam = function(index, val1, val2, callback) {
    return command(
      commands.setMacroParam,
      utils.argsToHexArray(index, val1, val2),
      callback
    );
  };

  /**
   * The Append Macro Chunk project stores the attached macro definition into
   * the temporary RAM buffer for later execution.
   *
   * It's similar to the Save Temporary Macro command, but allows building up
   * longer temporary macros.
   *
   * Any existing Macro ID can be sent through this command, and executed
   * through the Run Macro call using ID 0xFF.
   *
   * If this command is sent while a Temporary or Stream Macro is executing it
   * will be terminated so that its storage space can be overwritten. As with
   * all macros, the longest chunk that can be sent is 254 bytes.
   *
   * You must follow this with a Run Macro command (ID 0xFF) to actually get it
   * to go and it is best to prefix this command with an Abort call to make
   * certain the larger buffer is completely initialized.
   *
   * @param {Array} chunk of bytes to append for macro execution
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.appendMacroChunk(, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.appendMacroChunk = function(chunk, callback) {
    return command(commands.appendTempMacroChunk, chunk, callback);
  };

  /**
   * The Erase orbBasic Storage command erases any existing program in the
   * specified storage area.
   *
   * Specify 0x00 for the temporary RAM buffer, or 0x01 for the persistent
   * storage area.
   *
   * @param {Number} area which area to erase
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.eraseOrbBasicStorage(0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.eraseOrbBasicStorage = function(area, callback) {
    area &= 0xFF;
    return command(commands.eraseOBStorage, [area], callback);
  };

  /**
   * The Append orbBasic Fragment command appends a patch of orbBasic code to
   * existing ones in the specified storage area (0x00 for RAM, 0x01 for
   * persistent).
   *
   * Complete lines are not required. A line begins with a decimal line number
   * followed by a space and is terminated with a <LF>.
   *
   * See the orbBasic Interpreter document for complete information.
   *
   * Possible error responses would be ORBOTIX_RSP_CODE_EPARAM if an illegal
   * storage area is specified or ORBOTIX_RSP_CODE_EEXEC if the specified
   * storage area is full.
   *
   * @param {Number} area which area to append the fragment to
   * @param {String} code orbBasic code to append
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.appendOrbBasicFragment(0x00, OrbBasicCode, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.appendOrbBasicFragment = function(area, code, callback) {
    area &= 0xFF;
    var data = [].concat(area, code);
    return command(commands.appendOBFragment, data, callback);
  };

  /**
   * The Execute orbBasic Program command attempts to run a program in the
   * specified storage area, beginning at the specified line number.
   *
   * This command will fail if there is already an orbBasic program running.
   *
   * @param {Number} area which area to run from
   * @param {Number} slMSB start line
   * @param {Number} slLSB start line
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.executeOrbBasicProgram(0x00, 0x00, 0x00, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.executeOrbBasicProgram = function(area, slMSB, slLSB, callback) {
    return command(
      commands.execOBProgram,
      utils.argsToHexArray(area, slMSB, slLSB),
      callback
    );
  };

  /**
   * The Abort orbBasic Program command aborts execution of any currently
   * running orbBasic program.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.abortOrbBasicProgram(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.abortOrbBasicProgram = function(callback) {
    return command(commands.abortOBProgram, null, callback);
  };

  /**
   * The Submit value To Input command takes the place of the typical user
   * console in orbBasic and allows a user to answer an input request.
   *
   * If there is no pending input request when this API command is sent, the
   * supplied value is ignored without error.
   *
   * Refer to the orbBasic language document for further information.
   *
   * @param {Number} val value to respond with
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.submitValuetoInput(0x0000FFFF, function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.submitValueToInput = function(val, callback) {
    val = utils.intToHexArray(val, 4);
    return command(commands.answerInput, val, callback);
  };

  /**
   * The Commit To Flash command copies the current orbBasic RAM program to
   * persistent flash storage.
   *
   * It will fail if a program is currently executing out of flash.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.commitToFlash(function(err, data) {
   *   console.log(err || "data: " + data);
   * }
   * @return {object} promise for command
   */
  device.commitToFlash = function(callback) {
    return command(commands.commitToFlash, null, callback);
  };

  device._commitToFlashAlias = function(callback) {
    return command(commands.commitToFlashAlias, null, callback);
  };
};
