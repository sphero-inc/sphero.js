"use strict";

var mutator = lib("devices/core");

describe("Core", function() {
  var core;

  beforeEach(function() {
    core = { command: spy() };
    mutator(core);
  });

  describe("commands", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
    });

    it("#ping calls #command with params", function() {
      core.ping(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x01, null, callback);
    });

    it("#version calls #command with params", function() {
      core.version(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x02, null, callback);
    });

    it("#controlUARTTx calls #command with params", function() {
      core.controlUARTTx(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x03, null, callback);
    });

    it("#setDeviceName calls #command with params", function() {
      core.setDeviceName("Esfiro", callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x10, [69, 115, 102, 105, 114, 111], callback);
    });

    it("#getBluetoothInfo calls #command with params", function() {
      core.getBluetoothInfo(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x11, null, callback);
    });

    it("#setAutoReconnect calls #command with params", function() {
      core.setAutoReconnect(0x01, 0x05, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x12, [0x01, 0x05], callback);
    });

    it("#getAutoReconnect calls #command with params", function() {
      core.getAutoReconnect(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x13, null, callback);
    });

    it("#getPowerState calls #command with params", function() {
      core.getPowerState(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x20, null, callback);
    });

    it("#setPowerNotification calls #command with params", function() {
      core.setPowerNotification(0x01, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x21, [0x01], callback);
    });

    it("#sleep calls #command with params", function() {
      core.sleep(256, 255, 256, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
      .to.be.calledWith(0x00, 0x22, [0x01, 0x00, 0xFF, 0x01, 0x00], callback);
    });

    it("#getVoltageTripPoints calls #command with params", function() {
      core.getVoltageTripPoints(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x23, null, callback);
    });

    it("#setVoltageTripPoints calls #command with params", function() {
      core.setVoltageTripPoints(0xFF00, 0x00FF, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x24, [0xFF, 0x00, 0x00, 0xFF], callback);
    });

    it("#setInactiveTimeout calls #command with params", function() {
      core.setInactivityTimeout(0x0F, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x25, [0x00, 0x0F], callback);
    });

    it("#jumpToBotloader calls #command with params", function() {
      core.jumpToBootloader(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x30, null, callback);
    });

    it("#runL1Diags calls #command with params", function() {
      core.runL1Diags(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x40, null, callback);
    });

    it("#runL2Diags calls #command with params", function() {
      core.runL2Diags(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x41, null, callback);
    });

    it("#clearCounters calls #command with params", function() {
      core.clearCounters(callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x42, null, callback);
    });

    it("#_coreTimeCmd calls #command with params", function() {
      core._coreTimeCmd(0x50, 0xFF, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x50, [0x00, 0x00, 0x00, 0xFF], callback);
    });

    it("#assignTime calls #_coreTimeCmd with params", function() {
      core.assignTime(0xFF, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x50, [0x00, 0x00, 0x00, 0xFF], callback);
    });

    it("#pollPacketTimes calls #_coreTimeCmd with params", function() {
      core.pollPacketTimes(0xFF, callback);
      expect(core.command).to.be.calledOnce;
      expect(core.command)
        .to.be.calledWith(0x00, 0x51, [0x00, 0x00, 0x00, 0xFF], callback);
    });
  });
});
