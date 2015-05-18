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
function hexToRGB(num) {
  return {
    red: (num >> 16 & 0xff),
    green: (num >> 8 & 0xff),
    blue: num & 0xff
  };
}

module.exports = function custom(device) {

  /**
   * The Color command wraps Sphero's built-in setRGB command, allowing for
   * a greater range of possible inputs.
   *
   * @param {Number|String|Object} color what color to change Sphero to
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.color = function(color, callback) {
    switch (typeof color) {
      case "number":
        color = hexToRGB(color);
        break;

      case "string":
        if (colors[color]) {
          color = hexToRGB(colors[color]);
          break;
        }

        if (color[0] === "#") {
          color = color.slice(1);
        }

        if (hexRegex.test(color)) {
          var matches = hexRegex.exec(color);
          color = hexToRGB(parseInt(matches[0], 16));
        } else {
          // passed some weird value, just use white
          console.error("invalid color provided", color);
          color = hexToRGB(0xFFFFFF);
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

    return device.setRGBLed(color, callback);
  };

  /**
   * The Random Color command sets Sphero to a randomly-generated color.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.randomColor = function(callback) {
    return device.setRGBLed(utils.randomColor(), callback);
  };

  /**
   * Passes the color of the sphero RGB LED to the callback (err, data)
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.getColor = function(callback) {
    return device.getRGBLed(callback);
  };

  /**
   * The Detect Collisions command sets up Sphero's collision detection system,
   * and automatically parses asynchronous packets to re-emit collision events
   * to 'collision' event listeners.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.detectCollisions = function(callback) {
    return device.configureCollisions({
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
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.startCalibration = function(callback) {
    device.setBackLed(127);
    return device.setStabilization(0, callback);
  };

  /**
   * The Finish Calibration command ends Sphero's calibration mode, by setting
   * the new heading as current, turning off the back LED, and re-enabling
   * stabilization.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.finishCalibration = function(callback) {
    device.setHeading(0);
    device.setBackLed(0);
    return device.setStabilization(1, callback);
  };

  /**
   * Starts streaming of velocity data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` event to get the velocity values.
   *
   * @param {Integer} [sps=5] - Samples per second
   * @param {Boolean} [remove=false] - Forces velocity streaming to stop
   * @return {void}
   */
  device.streamVelocity = function(sps, remove) {
    sps = sps || 1;
    remove = remove || false;

    var mask2 = 0x01800000,
        n = Math.round(400 / sps),
        opts;


    if (remove) {
      mask2 = utils.xor32bit(mask2);
      mask2 = device.mask2 & mask2;
    } else {
      mask2 = device.mask2 | mask2;
    }

    // options for streaming data
    opts = {
      n: n,
      m: 1,
      mask1: device.mask1 || 0x00000000,
      pcnt: 0,
      mask2: mask2
    };

    device.on("dataStreaming", function(data) {
      var filteredVelocity = {
        x: data.xVelocity,
        y: data.yVelocity
      };

      device.emit("velocity", filteredVelocity);
    });

    device.setDataStreaming(opts);
  };
};
