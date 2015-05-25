"use strict";

var mutator = lib("devices/custom"),
    utils = lib("utils");

describe("Custom Device Functions", function() {
  var device = {};

  beforeEach(function() {
    mutator(device);
  });

  describe("#color", function() {
    var rgb;

    beforeEach(function() {
      rgb = device.setRGBLed = spy();
    });

    it("proxies callbacks", function() {
      var color = { red: 255, green: 0, blue: 0 },
          callback = spy();

      device.color(color, callback);
      expect(rgb).to.be.calledWith(color, callback);
    });

    context("with a hex string", function() {
      beforeEach(function() {
        stub(console, "error");
      });

      afterEach(function() {
        console.error.restore();
      });

      it("converts to an RGB object", function() {
        device.color("#FF0000");
        var color = { red: 255, blue: 0, green: 0 };
        expect(rgb).to.be.calledWith(color);
      });

      it("converts 'FF00FF' to an RGB object", function() {
        device.color("FF0000");
        var color = { red: 255, blue: 0, green: 0 };
        expect(rgb).to.be.calledWith(color);
      });

      it("prints an error with invalid color", function() {
        device.color("mycolor");
        expect(console.error)
          .to.be.calledWith("invalid color provided", "mycolor");
      });
    });

    context("with a color name", function() {
      it("converts to an RGB object", function() {
        device.color("azure");
        var color = { red: 240, blue: 255, green: 255 };
        expect(rgb).to.be.calledWith(color);
      });
    });

    context("with a hex number", function() {
      it("converts to an RGB object", function() {
        device.color(0x00FF00);
        var color = { red: 0, blue: 0, green: 255 };
        expect(rgb).to.be.calledWith(color);
      });
    });

    context("with a RGB object", function() {
      it("passes it along", function() {
        var color = { red: 250, blue: 10, green: 125 };
        device.color(color);
        expect(rgb).to.be.calledWith(color);
      });

      it("converts shorthand values", function() {
        var color = { r: 250, g: 10, b: 125 };
        device.color(color);
        expect(rgb).to.be.calledWithMatch({ red: 250, green: 10, blue: 125 });
      });
    });
  });

  describe("#randomColor", function() {
    var rgb, color;

    beforeEach(function() {
      rgb = device.setRGBLed = spy();
      color = { red: "red", green: "green", blue: "blue" };
      stub(utils, "randomColor").returns(color);
    });

    afterEach(function() {
      utils.randomColor.restore();
    });

    it("sets Sphero to a random color", function() {
      var callback = spy();
      device.randomColor(callback);
      expect(rgb).to.be.calledWith(color, callback);
    });
  });

  describe("#getColor", function() {
    it("calls #getRGBLed with", function() {
      device.getRGBLed = stub();
      device.getColor();
      expect(device.getRGBLed).to.be.calledOnce;
    });
  });

  describe("#detectCollisions", function() {
    beforeEach(function() {
      device.configureCollisions = spy();
      device.on = stub();
      device.emit = stub();

      device.detectCollisions();
    });

    it("configures collision detection for Sphero", function() {
      expect(device.configureCollisions).to.be.calledWith({
        meth: 0x01,
        xt: 0x40,
        yt: 0x40,
        xs: 0x50,
        ys: 0x50,
        dead: 0x50
      });
    });
  });

  describe("#startCalibration", function() {
    beforeEach(function() {
      device.setStabilization = spy();
      device.setBackLed = stub();

      device.startCalibration();
    });

    it("disables stabilization", function() {
      expect(device.setStabilization).to.be.calledWith(0);
    });

    it("turns on the back LED", function() {
      expect(device.setBackLed).to.be.calledWith(127);
    });
  });

  describe("#finishCalibration", function() {
    beforeEach(function() {
      device.setStabilization = spy();
      device.setHeading = spy();
      device.setBackLed = stub();

      device.finishCalibration();
    });

    it("enables stabilization", function() {
      expect(device.setStabilization).to.be.calledWith(1);
    });

    it("sets a new heading", function() {
      expect(device.setHeading).to.be.calledWith(0);
    });

    it("turns off the back LED", function() {
      expect(device.setBackLed).to.be.calledWith(0);
    });
  });

  describe("#streamData", function() {
    var buffer, opts, args;

    beforeEach(function() {
      opts = {
        n: 200,
        m: 1,
        mask1: 0x00180000,
        pcnt: 0,
        mask2: 0x00180000,
      };

      device.ds = {};

      args = {
        sps: 2,
        mask1: 0x00180000,
        mask2: 0x00180000,
        fields: ["xVel", "yVel"]
      };

      buffer = new Buffer([0xFF, 0xFE, 0xFC]);
      device.setDataStreaming = stub();
      device.on.yields(buffer);

      device.streamData(args);
    });

    it("calls #setDataStreaming with", function() {
      expect(device.setDataStreaming).to.be.calledWith(opts);
    });

    it("calls #setDataStreaming with", function() {
      args.sps = undefined;
      device.streamData(args);
      expect(device.setDataStreaming).to.be.calledWith(opts);
    });

    it("if 'remove true'calls #setDataStreaming with", function() {
      args.remove = true;
      device.streamData(args);
      opts.mask1 = 0x00000000;
      opts.mask2 = 0x00000000;
      expect(device.setDataStreaming).to.be.calledWith(opts);
    });
  });

  describe("streaming data with", function() {
    beforeEach(function() {
      stub(device, "streamData");
    });

    afterEach(function() {
      device.streamData.restore();
    });

    it("#streamOdometer calls #streamData with", function() {
      var opts = {
        event: "odometer",
        mask2: 0x0C000000,
        fields: ["xOdometer", "yOdometer"],
        sps: 2,
        remove: false
      };

      device.streamOdometer(2, false);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamVelocity calls #streamData with", function() {
      var opts = {
        event: "velocity",
        mask2: 0x01800000,
        fields: ["xVelocity", "yVelocity"],
        sps: 4,
        remove: true
      };

      device.streamVelocity(4, true);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamIMUAngles calls #streamData with", function() {
      var opts = {
        event: "imuAngles",
        mask1: 0x00070000,
        fields: ["pitchAngle", "rollAngle", "yawAngle"],
        sps: 2,
        remove: false
      };

      device.streamIMUAngles(2, false);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamAccelerometer calls #streamData with", function() {
      var opts = {
        event: "accelerometer",
        mask1: 0x0000E000,
        fields: ["xAccel", "yAccel", "zAccel"],
        sps: 4,
        remove: true
      };

      device.streamAccelerometer(4, true);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamGyroscope calls #streamData with", function() {
      var opts = {
        event: "gyroscope",
        mask1: 0x00001C00,
        fields: ["xGyro", "yGyro", "zGyro"],
        sps: 2,
        remove: false
      };

      device.streamGyroscope(2, false);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamAccelOne calls #streamData with", function() {
      var opts = {
        event: "accelOne",
        mask2: 0x02000000,
        fields: ["accelOne"],
        sps: 2,
        remove: false
      };

      device.streamAccelOne(2, false);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });

    it("#streamMotorsBackEmf calls #streamData with", function() {
      var opts = {
        event: "motorsBackEmf",
        mask1: 0x00000060,
        fields: ["rMotorBackEmf", "lMotorBackEmf"],
        sps: 2,
        remove: false
      };

      device.streamMotorsBackEmf(2, false);

      expect(device.streamData).to.be.calledOnce;
      expect(device.streamData).to.be.calledWith(opts);
    });
  });
});
