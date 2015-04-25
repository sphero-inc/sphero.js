"use strict";

var factory = lib("devices/core");

describe("Core", function() {
  var core;

  beforeEach(function() {
    core = factory();
  });

  describe("#coreCommand", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      core.command = stub();

      core.coreCommand(0x01, null, callback);
    });

    it("calls #command with params", function() {
      expect(core.command).to.be.calledOnce;
      expect(core.command).to.be.calledWith(0x00, 0x01, null, callback);
    });
  });

  describe("commands", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(core, "coreCommand");
    });

    afterEach(function() {
      core.coreCommand.restore();
    });

    it("#ping calls #coreCommand with params", function() {
      core.ping(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x01, null, callback);
    });

    it("#version calls #coreCommand with params", function() {
      core.version(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x02, null, callback);
    });

    it("#controlUARTTx calls #coreCommand with params", function() {
      core.controlUARTTx(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x03, null, callback);
    });

    it("#setDeviceName calls #coreCommand with params", function() {
      core.setDeviceName("Esfiro", callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x10, [69, 115, 102, 105, 114, 111], callback);
    });

    it("#getBluetoothInfo calls #coreCommand with params", function() {
      core.getBluetoothInfo(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x11, null, callback);
    });

    it("#setAutoReconnect calls #coreCommand with params", function() {
      core.setAutoReconnect(0x01, 0x05, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x12, [0x01, 0x05], callback);
    });

    it("#getAutoReconnect calls #coreCommand with params", function() {
      core.getAutoReconnect(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x13, null, callback);
    });

    it("#getPowerState calls #coreCommand with params", function() {
      core.getPowerState(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x20, null, callback);
    });

    it("#setPowerNotification calls #coreCommand with params", function() {
      core.setPowerNotification(0x01, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x21, [0x01], callback);
    });

    it("#sleep calls #coreCommand with params", function() {
      core.sleep(256, 255, 256, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
      .to.be.calledWith(0x22, [0x01, 0x00, 0xFF, 0x01, 0x00], callback);
    });

    it("#getVoltageTripPoints calls #coreCommand with params", function() {
      core.getVoltageTripPoints(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand).to.be.calledWith(0x23, null, callback);
    });

    it("#setVoltageTripPoints calls #coreCommand with params", function() {
      core.setVoltageTripPoints(0xFF00, 0x00FF, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x24, [0xFF, 0x00, 0x00, 0xFF], callback);
    });

    it("#setInactiveTimeout calls #coreCommand with params", function() {
      core.setInactivityTimeout(0x0F, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x25, [0x00, 0x0F], callback);
    });

    it("#jumpToBotloader calls #coreCommand with params", function() {
      core.jumpToBootloader(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x30, null, callback);
    });

    it("#runL1Diags calls #coreCommand with params", function() {
      core.runL1Diags(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x40, null, callback);
    });

    it("#runL2Diags calls #coreCommand with params", function() {
      core.runL2Diags(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x41, null, callback);
    });

    it("#clearCounters calls #coreCommand with params", function() {
      core.clearCounters(callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x42, null, callback);
    });

    it("#_coreTimeCmd calls #coreCommand with params", function() {
      core._coreTimeCmd(0x50, 0xFF, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x50, [0x00, 0x00, 0x00, 0xFF], callback);
    });

    it("#assignTime calls #_coreTimeCmd with params", function() {
      core.assignTime(0xFF, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x50, [0x00, 0x00, 0x00, 0xFF], callback);
    });

    it("#pollPacketTimes calls #_coreTimeCmd with params", function() {
      core.pollPacketTimes(0xFF, callback);
      expect(core.coreCommand).to.be.calledOnce;
      expect(core.coreCommand)
        .to.be.calledWith(0x51, [0x00, 0x00, 0x00, 0xFF], callback);
    });
  });
});
