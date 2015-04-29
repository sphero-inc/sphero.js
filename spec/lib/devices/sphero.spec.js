"use strict";

var mutator = lib("devices/sphero");

describe("Sphero", function() {
  var sphero;

  it("is a function", function() {
    expect(mutator).to.be.a("function");
  });

  beforeEach(function() {
    sphero = { command: spy() };
    mutator(sphero);
  });

  describe("commands", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
    });

    it("#setHeading calls #command with params", function() {
      sphero.setHeading(180, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x01, [0x00, 0xB4], callback);
    });

    it("#setStabilization calls #command with params", function() {
      sphero.setStabilization(1, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command).to.be.calledWith(0x02, 0x02, [0x01], callback);
    });

    it("#setRotationRate calls #command with params", function() {
      sphero.setRotationRate(180, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command).to.be.calledWith(0x02, 0x03, [0xB4], callback);
    });

    it("#getChassisId calls #command with params", function() {
      sphero.getChassisId(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command).to.be.calledWith(0x02, 0x07, null, callback);
    });

    it("#setChassisId calls #command with params", function() {
      sphero.setChassisId(0xB0, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x07, [0x00, 0xB0], callback);
    });

    it("#selfLevel calls #command with params", function() {
      var opts = {
        options: 0xF0,
        angleLimit: 0xB4,
        timeout: 0xFF,
        trueTime: 0x0F
      };

      sphero.selfLevel(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x09, [0xF0, 0xB4, 0xFF, 0x0F], callback);
    });

    it("#setDataStreaming calls #command with params", function() {
      var opts = {
        n: 0x0F,
        m: 0xF0,
        mask1: 0x0F0F,
        pcnt: 0x0F,
        mask2: 0x00FF
      };

      var byteArray = [
        0x00, 0x0F,
        0x00, 0xF0,
        0x00, 0x00, 0x0F, 0x0F,
        0x0F,
        0x00, 0x00, 0x00, 0xFF
      ];

      sphero.setDataStreaming(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x11, byteArray, callback);
    });

    it("#configureCollisions calls #command with params", function() {
      var opts = {
        meth: 0x0F,
        xt: 0xF0,
        xs: 0x01,
        yt: 0x02,
        ys: 0x03,
        dead: 0xFF
      };

      var byteArray = [
        0x0F,
        0xF0,
        0x01,
        0x02,
        0x03,
        0xFF,
      ];
      sphero.configureCollisions(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x12, byteArray, callback);
    });


    it("#configureLocator calls #command with params", function() {
      var opts = {
        flags: 0x0F,
        x: 0xF0F0,
        y: 0x0202,
        yawTare: 0xFFFF
      };

      var byteArray = [
        0x0F,
        0xF0,
        0xF0,
        0x02,
        0x02,
        0xFF,
        0xFF,
      ];
      sphero.configureLocator(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x13, byteArray, callback);
    });

    it("#setAccelRange calls #command with params", function() {
      sphero.setAccelRange(180, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x14, [0xB4], callback);
    });

    it("#readLocator calls #command with params", function() {
      sphero.readLocator(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x15, null, callback);
    });

    it("#setRGBLed calls #command with params", function() {
      var opts = {
        red: 0xFF,
        green: 0xFE,
        blue: 0xFD,
        flag: 0x01
      };

      var byteArray = [
        0xFF,
        0xFE,
        0xFD,
        0x01,
      ];
      sphero.setRGBLed(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x20, byteArray, callback);
    });

    it("#setBackLed calls #command with params", function() {
      sphero.setBackLed(0xFF, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x21, [0xFF], callback);
    });

    it("#getRGBLed calls #command with params", function() {
      sphero.getRGBLed(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x22, null, callback);
    });

    it("#roll calls #command with params", function() {
      sphero.roll(0xFF, 0xB4, 0x02, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x30, [0xFF, 0x00, 0xB4, 0x02], callback);
    });

    it("#boost calls #command with params", function() {
      sphero.boost(0x01, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x31, [0x01], callback);
    });

    it("#setRawMotors calls #command with params", function() {
      var opts = {
        lmode: 0x03,
        lpower: 0xFE,
        rmode: 0x02,
        rpower: 0xFF,
      };

      var byteArray = [
        0x03,
        0xFE,
        0x02,
        0xFF,
      ];
      sphero.setRawMotors(opts, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x33, byteArray, callback);
    });

    it("#setMotionTimeout calls #command with params", function() {
      sphero.setMotionTimeout(0xAABB, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x34, [0xAA, 0xBB], callback);
    });

    it("#setPermOptionFlags calls #command with params", function() {
      sphero.setPermOptionFlags(0xAABBCCDD, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x35, [0xAA, 0xBB, 0xCC, 0xDD], callback);
    });

    it("#getPermOptionFlags calls #command with params", function() {
      sphero.getPermOptionFlags(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x36, null, callback);
    });

    it("#setTempOptionFlags calls #command with params", function() {
      sphero.setTempOptionFlags(0xAABBCCDD, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x37, [0xAA, 0xBB, 0xCC, 0xDD], callback);
    });

    it("#getTempOptionFlags calls #command with params", function() {
      sphero.getTempOptionFlags(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x38, null, callback);
    });

    it("#getConfigBlock calls #command with params", function() {
      sphero.getConfigBlock(0xB4, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(0x02, 0x40, [0xB4], callback);
    });

    it("#setSSBModBlock calls #command with params", function() {
      sphero.setSSBModBlock(0xAABBCCDD, [0x01, 0x02, 0x03], callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(
          0x02, 0x41,
          [0xAA, 0xBB, 0xCC, 0xDD, 0x01, 0x02, 0x03],
          callback
        );
    });

    it("#setDeviceMode  calls #command with params", function() {
      sphero.setDeviceMode(0x00, callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(
          0x02, 0x42,
          [0x00],
          callback
        );
    });

    it("#setConfigBlock calls #command with params", function() {
      sphero.setConfigBlock([0x01, 0x02, 0x03], callback);

      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command)
        .to.be.calledWith(
          0x02, 0x43,
          [0x01, 0x02, 0x03],
          callback
        );
    });

    it("#getDeviceMode  calls #command with params", function() {
      sphero.getDeviceMode(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command).to.be.calledWith(0x02, 0x44, null, callback);
    });

    it("#getSSB  calls #command with params", function() {
      sphero.getSSB(callback);
      expect(sphero.command).to.be.calledOnce;
      expect(sphero.command).to.be.calledWith(0x02, 0x46, null, callback);
    });

    it("#setSSB calls #command with params", function() {
      sphero.setSSB(0xAABBCCDD, [0x01, 0x02, 0x03], callback);

      expect(sphero.command).to.be.calledOnce;

      expect(sphero.command)
        .to.be.calledWith(
          0x02, 0x47,
          [0xAA, 0xBB, 0xCC, 0xDD, 0x01, 0x02, 0x03],
          callback
        );
    });
  });

});
