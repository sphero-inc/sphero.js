"use strict";

// "custom" Sphero commands.
//
// These usually remix or pre-process arguments for existing methods.

var colors = require("../colors"),
    utils = require("../utils");

// regular expression to match hex strings
var hexRegex = /^[A-Fa-f0-9]{6}$/m;

/**
 * Converts a hex color number to RGB values
 *
 * @private
 * @param {Number} num color value to convert
 * @return {Object} RGB color values
 */
function hexToRgb(num) {
  return {
    red: (num >> 16 & 0xff),
    green: (num >> 8 & 0xff),
    blue: num & 0xff
  };
}

module.exports = function custom(device) {
  function mergeMasks(id, mask, remove) {
    if (remove) {
      mask = utils.xor32bit(mask);
      return device.ds[id] & mask;
    }

    return device.ds[id] | mask;
  }

  /**
   * Generic Data Streaming setup, using Sphero's setDataStraming command.
   *
   * Users need to listen for the `dataStreaming` event, or a custom event, to
   * get the data.
   *
   * @private
   * @param {Object} args event, masks, fields, and sps data
   * @return {void}
   */
  device.streamData = function(args) {
    // options for streaming data
    var opts = {
      n: Math.round(400 / (args.sps || 2)),
      m: 1,
      mask1: mergeMasks("mask1", args.mask1, args.remove),
      pcnt: 0,
      mask2: mergeMasks("mask2", args.mask2, args.remove)
    };

    device.on("dataStreaming", function(data) {
      var params = {};

      for (var i = 0; i < args.fields.length; i++) {
        params[args.fields[i]] = data[args.fields[i]];
      }

      device.emit(args.event, params);
    });

    device.setDataStreaming(opts);
  };

  /**
   * The Color command wraps Sphero's built-in setRgb command, allowing for
   * a greater range of possible inputs.
   *
   * @param {Number|String|Object} color what color to change Sphero to
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.color("#00ff00", function(err, data) {
   *   console.log(err || "Color Changed!");
   * });
   * @example
   * orb.color(0xff0000, function(err, data) {
   *   console.log(err || "Color Changed!");
   * });
   * @example
   * orb.color({ red: 0, green: 0, blue: 255 }, function(err, data) {
   *   console.log(err || "Color Changed!");
   * });
   * @return {void}
   */
  device.color = function(color, callback) {
    switch (typeof color) {
      case "number":
        color = hexToRgb(color);
        break;

      case "string":
        if (colors[color]) {
          color = hexToRgb(colors[color]);
          break;
        }

        if (color[0] === "#") {
          color = color.slice(1);
        }

        if (hexRegex.test(color)) {
          var matches = hexRegex.exec(color);
          color = hexToRgb(parseInt(matches[0], 16));
        } else {
          // passed some weird value, just use white
          console.error("invalid color provided", color);
          color = hexToRgb(0xFFFFFF);
        }

        break;

      case "object":
        // upgrade shorthand properties
        ["red", "green", "blue"].forEach(function(hue) {
          var h = hue[0];

          if (color[h] && typeof color[hue] === "undefined") {
            color[hue] = color[h];
          }
        });

        break;
    }

    device.setRgbLed(color, callback);
  };

  /**
   * The Random Color command sets Sphero to a randomly-generated color.
   *
   * @param {Function} callback (err, data) to be triggered with response
   * @example
   * orb.randomColor(function(err, data) {
   *   console.log(err || "Random Color!");
   * });
   * @return {void}
   */
  device.randomColor = function(callback) {
    device.setRgbLed(utils.randomColor(), callback);
  };

  /**
   * Passes the color of the sphero Rgb LED to the callback (err, data)
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.getColor(function(err, data) {
   *   if (err) {
   *     console.log("error: ", err);
   *   } else {
   *     console.log("data:");
   *     console.log("  color:", data.color);
   *     console.log("  red:", data.red);
   *     console.log("  green:", data.green);
   *     console.log("  blue:", data.blue);
   *   }
   * });
   * @return {void}
   */
  device.getColor = function(callback) {
    device.getRgbLed(callback);
  };

  /**
   * The Detect Collisions command sets up Sphero's collision detection system,
   * and automatically parses asynchronous packets to re-emit collision events
   * to 'collision' event listeners.
   *
   * @param {Function} callback (err, data) to be triggered with response
   * @example
   * orb.detectCollisions();
   *
   * orb.on("collision", function(data) {
   *   console.log("data:");
   *   console.log("  x:", data.x);
   *   console.log("  y:", data.y);
   *   console.log("  z:", data.z);
   *   console.log("  axis:", data.axis);
   *   console.log("  xMagnitud:", data.xMagnitud);
   *   console.log("  yMagnitud:", data.yMagnitud);
   *   console.log("  speed:", data.timeStamp);
   *   console.log("  timeStamp:", data.timeStamp);
   * });
   * @return {void}
   */
  device.detectCollisions = function(callback) {
    device.configureCollisions({
      meth: 0x01,
      xt: 0x40,
      yt: 0x40,
      xs: 0x50,
      ys: 0x50,
      dead: 0x50
    }, callback);
  };

  /**
   * The Start Calibration command sets up Sphero for manual heading
   * calibration.
   *
   * It does this by turning on the tail light (so you can tell where it's
   * facing) and disabling stabilization (so you can adjust the heading).
   *
   * When done, call #finishCalibration to set the new heading, and re-enable
   * stabilization.
   *
   * @param {Function} callback (err, data) to be triggered with response
   * @example
   * orb.startCalibration();
   * @return {void}
   */
  device.startCalibration = function(callback) {
    device.setBackLed(127);
    device.setStabilization(0, callback);
  };

  /**
   * The Finish Calibration command ends Sphero's calibration mode, by setting
   * the new heading as current, turning off the back LED, and re-enabling
   * stabilization.
   *
   * @param {Function} callback function to be triggered with response
   * @example
   * orb.finishCalibration();
   * @return {void}
   */
  device.finishCalibration = function(callback) {
    device.setHeading(0);
    device.setBackLed(0);
    device.setStabilization(1, callback);
  };

  /**
   * Starts streaming of odometer data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `odometer` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamOdometer();
   *
   * orb.on("odometer", function(data) {
   *   console.log("data:");
   *   console.log("  xOdomoter:", data.xOdomoter);
   *   console.log("  yOdomoter:", data.yOdomoter);
   * });
   * @return {void}
   */
  device.streamOdometer = function(sps, remove) {
    device.streamData({
      event: "odometer",
      mask2: 0x0C000000,
      fields: ["xOdometer", "yOdometer"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of velocity data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `velocity` event to get the velocity values.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamVelocity();
   *
   * orb.on("velocity", function(data) {
   *   console.log("data:");
   *   console.log("  xVelocity:", data.xVelocity);
   *   console.log("  yVelocity:", data.yVelocity);
   * });
   * @return {void}
   */
  device.streamVelocity = function(sps, remove) {
    device.streamData({
      event: "velocity",
      mask2: 0x01800000,
      fields: ["xVelocity", "yVelocity"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of accelOne data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `accelOne` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamAccelOne();
   *
   * orb.on("accelOne", function(data) {
   *   console.log("data:");
   *   console.log("  accelOne:", data.accelOne);
   * });
   * @return {void}
   */
  device.streamAccelOne = function(sps, remove) {
    device.streamData({
      event: "accelOne",
      mask2: 0x02000000,
      fields: ["accelOne"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of IMU angles data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `imuAngles` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamImuAngles();
   *
   * orb.on("imuAngles", function(data) {
   *   console.log("data:");
   *   console.log("  pitchAngle:", data.pitchAngle);
   *   console.log("  rollAngle:", data.rollAngle);
   *   console.log("  yawAngle:", data.yawAngle);
   * });
   * @return {void}
   */
  device.streamImuAngles = function(sps, remove) {
    device.streamData({
      event: "imuAngles",
      mask1: 0x00070000,
      fields: ["pitchAngle", "rollAngle", "yawAngle"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of accelerometer data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `accelerometer` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamAccelerometer();
   *
   * orb.on("accelerometer", function(data) {
   *   console.log("data:");
   *   console.log("  xAccel:", data.xAccel);
   *   console.log("  yAccel:", data.yAccel);
   *   console.log("  zAccel:", data.zAccel);
   * });
   * @return {void}
   */
  device.streamAccelerometer = function(sps, remove) {
    device.streamData({
      event: "accelerometer",
      mask1: 0x0000E000,
      fields: ["xAccel", "yAccel", "zAccel"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of gyroscope data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `gyroscope` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamGyroscope();
   *
   * orb.on("gyroscope", function(data) {
   *   console.log("data:");
   *   console.log("  xGyro:", data.xGyro);
   *   console.log("  yGyro:", data.yGyro);
   *   console.log("  zGyro:", data.zGyro);
   * });
   * @return {void}
   */
  device.streamGyroscope = function(sps, remove) {
    device.streamData({
      event: "gyroscope",
      mask1: 0x00001C00,
      fields: ["xGyro", "yGyro", "zGyro"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * Starts streaming of motor back EMF data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `motorsBackEmf` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @example
   * orb.streamMotorsBackEmf();
   *
   * orb.on("motorsBackEmf", function(data) {
   *   console.log("data:");
   *   console.log("  rMotorBackEmf:", data.rMotorBackEmf);
   *   console.log("  lMotorBackEmf:", data.lMotorBackEmf);
   * });
   * @return {void}
   */
  device.streamMotorsBackEmf = function(sps, remove) {
    device.streamData({
      event: "motorsBackEmf",
      mask1: 0x00000060,
      fields: ["rMotorBackEmf", "lMotorBackEmf"],
      sps: sps,
      remove: remove
    });
  };

  /**
   * The Stop On Disconnect command sends a flag to Sphero. This flag tells
   * Sphero whether or not it should automatically stop when it detects
   * that it's disconnected.
   *
   * @param {Boolean} [remove=false] whether or not to stop on disconnect
   * @param {Function} callback triggered on complete
   * @example
   * orb.stopOnDisconnect(function(err, data) {
   *   console.log(err || "data" + data);
   * });
   * @return {void}
   */
  device.stopOnDisconnect = function(remove, callback) {
    if (typeof remove === "function") {
      callback = remove;
      remove = false;
    }

    var bitmask = (remove) ? 0x00 : 0x01;

    device.setTempOptionFlags(bitmask, callback);
  };


  /**
   * Stops sphero the optimal way by setting flag 'go' to 0
   * and speed to a very low value.
   *
   * @param {Function} callback triggered on complete
   * @example
   * sphero.stop(function(err, data) {
   *   console.log(err || "data" + data);
   * });
   * @return {void}
   */
  device.stop = function(callback) {
    this.roll(0, 0, 0, callback);
  };
};
