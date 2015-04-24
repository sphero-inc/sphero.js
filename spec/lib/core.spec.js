"use strict";

var factory = lib("devices/core");

describe("Core", function() {
  var core;

  beforeEach(function() {
    core = factory();
  });

  describe("#_coreCommand", function() {
    var opts, cmdByteArray, callback;

    beforeEach(function() {
      opts = {
        sop2: 0xFF,
        did: 0x00,
        cid: 0x01,
        seq: 0x01,
        data: null
      };

      cmdByteArray = [0xFF, 0xFF, 0x00, 0x01, 0x01, 0xFE];

      callback = spy();

      core._incSeq = stub();
      core._incSeq.returns(0x01);

      core.sop2Bitfield = 0xFF;
      core.packet = {
        create: stub()
      };
      core._queueCallback = stub();
      core.connection = {
        write: stub()
      };

      core.packet.create.returns(cmdByteArray);

      core._coreCommand(0x01, null, callback);
    });

    it("calls @packet#create with params", function() {
      expect(core.packet.create).to.be.calledOnce;
      expect(core.packet.create).to.be.calledWith(opts);
    });

    it("calls #_queueCallback with params (0x00, callback)", function() {
      expect(core._queueCallback).to.be.calledOnce;
      expect(core._queueCallback).to.be.calledWith(0x01, callback);
    });

    it("calls @connection#write with param commandPacket", function() {
      expect(core.connection.write).to.be.calledOnce;
      expect(core.connection.write).to.be.calledWith(cmdByteArray);
    });
  });

  describe("commands", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(core, "_coreCommand");
    });

    afterEach(function() {
      core._coreCommand.restore();
    });

    it("#ping calls #_coreCommand with params", function() {
      core.ping(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x01, null, callback);
    });

    it("#version calls #_coreCommand with params", function() {
      core.version(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x02, null, callback);
    });

    it("#controlUARTTx calls #_coreCommand with params", function() {
      core.controlUARTTx(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x03, null, callback);
    });

    it("#setDeviceName calls #_coreCommand with params", function() {
      core.setDeviceName("Esfiro", callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand)
        .to.be.calledWith(0x10, [69, 115, 102, 105, 114, 111], callback);
    });

    it("#getBluetoothInfo calls #_coreCommand with params", function() {
      core.getBluetoothInfo(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x11, null, callback);
    });

    it("#setAutoReconnect calls #_coreCommand with params", function() {
      core.setAutoReconnect(0x01, 0x05, callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x12, [0x01, 0x05], callback);
    });

    it("#getAutoReconnect calls #_coreCommand with params", function() {
      core.getAutoReconnect(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x13, null, callback);
    });

    it("#getPowerState calls #_coreCommand with params", function() {
      core.getPowerState(callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x20, null, callback);
    });

    it("#setPowerNotification calls #_coreCommand with params", function() {
      core.setPowerNotification(0x01, callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand).to.be.calledWith(0x21, [0x01], callback);
    });

    it("#sleep calls #_coreCommand with params", function() {
      core.sleep(256, 255, 256, callback);
      expect(core._coreCommand).to.be.calledOnce;
      expect(core._coreCommand)
      .to.be.calledWith(0x22, [0x01, 0x00, 0xFF, 0x01, 0x00], callback);
    });
  });
});
