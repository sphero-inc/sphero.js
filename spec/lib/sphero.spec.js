"use strict";

var factory = lib("sphero");

var Packet = lib("packet"),
    SerialPort = lib("adaptors/serialport");

describe("Sphero", function() {
  var sphero;

  beforeEach(function() {
    sphero = factory("/dev/rfcomm0");
  });

  describe("#constructor", function() {
    it("is not ready until #connect is called", function() {
      expect(sphero.ready).to.be.false;
    });

    it("sets @packet to be an instance of Packet", function() {
      expect(sphero.packet).to.be.an.instanceOf(Packet);
    });

    it("sets @connection to be an instance of Loader", function() {
      expect(sphero.connection).to.be.an.instanceOf(SerialPort);
    });

    it("sets @sop2Bitfield to SOP2.answer by default", function() {
      expect(sphero.sop2Bitfield).to.be.eql(0xFD);
    });

    it("sets @seqCounter to 0x00", function() {
      expect(sphero.seqCounter).to.be.eql(0x00);
    });

    it("sets callbackQueue array to an empty array", function() {
      expect(sphero.callbackQueue).to.be.eql([]);
    });

    it("adds core device methods", function() {
      expect(sphero.ping).to.be.a("function");
      expect(sphero.setDeviceName).to.be.a("function");
    });

    it("adds sphero device methods", function() {
      expect(sphero.setHeading).to.be.a("function");
      expect(sphero.setRGBLed).to.be.a("function");
    });

    it("adds custom device methods", function() {
      expect(sphero.color).to.be.a("function");
    });
  });

  describe("connect", function() {
    var callback, buffer, packet;

    beforeEach(function() {
      callback = spy();
      buffer = new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x01, 0xFE]);
      packet = {
        sop1: 0xFF,
        sop2: 0xFF,
        mrsp: 0x00,
        seq: 0x00,
        dlen: 0x01,
        checksum: 0xFE
      };

      stub(sphero, "emit");
      stub(sphero, "_execCallback");
      stub(sphero.packet, "on");
      stub(sphero.packet, "parse");
      stub(sphero.connection, "open");
      stub(sphero.connection, "onRead");
      stub(sphero.connection, "on");

      sphero.packet.on.yields();
      sphero.packet.parse.returns(packet);
      sphero.connection.open.yields();
      sphero.connection.on.yields();
      sphero.connection.onRead.yields(buffer);

      sphero.connect(callback);
    });

    afterEach(function() {
      sphero.emit.restore();
      sphero._execCallback.restore();
      sphero.packet.on.restore();
      sphero.packet.parse.restore();
      sphero.connection.open.restore();
      sphero.connection.on.restore();
    });

    it("sets a listener for @packet 'error' event", function() {
      expect(sphero.packet.on).to.be.calledOnce;
      expect(sphero.packet.on).to.be.calledWith("error");
    });

    it("emits error on @packet 'error' event", function() {
      expect(sphero.packet.on).to.be.calledOnce;
      expect(sphero.emit).to.be.calledWith("error");
    });

    it("calls @connection#open once", function() {
      expect(sphero.connection.open).to.be.calledOnce;
    });

    it("sets @ready to true", function() {
      expect(sphero.ready).to.be.true;
    });

    it("adds listener to @connection onRead", function() {
      expect(sphero.connection.onRead).to.be.calledOnce;
    });

    it("emits data on @connection onRead", function() {
      expect(sphero.emit).to.be.calledWith("data", buffer);
    });

    it("calls @packet.parse passing the buffer", function() {
      expect(sphero.packet.parse).to.be.calledOnce;
      expect(sphero.packet.parse).to.be.calledWith(buffer);
    });

    context("with sync responses", function() {
      it("emits a response event", function() {
        expect(sphero.emit).to.be.calledWith("response", packet);
      });

      it("executes the corresponding callback", function() {
        expect(sphero._execCallback).to.be.calledOnce;
        expect(sphero._execCallback).to.be.calledWith(0x00, packet);
      });
    });

    context("with an async response", function() {
      beforeEach(function() {
        packet.sop2 = 0xFE;
        packet.idCode = 0x07;
        packet.data = new Buffer([
          0x00, 0xFF,
          0x00, 0xFE,
          0x00, 0xFD,
          0x01,
          0x00, 0x01,
          0x00, 0x02,
          0x10,
          0x01, 0x02, 0X03, 0x04
          ]);
        sphero.connect(callback);
      });

      it("emits an async event", function() {
        expect(sphero.emit).to.be.calledWith("async", {
          axis: 1,
          CID: 18,
          DID: 2,
          idCode: 7,
          event: "collision",
          packet: packet,
          x: 255,
          y: 254,
          z: 253,
          speed: 16,
          xMagnitude: 1,
          yMagnitude: 2,
          timestamp: 16909060
        });
      });
    });

    it("adds listener on @connection close", function() {
      expect(sphero.connection.on).to.be.calledWith("close");
    });

    it("emits close on @connection close event", function() {
      expect(sphero.emit).to.be.calledWith("close");
    });

    it("emits error on @connection error event", function() {
      expect(sphero.emit).to.be.calledWith("error");
    });

    it("emits ready event when connection setup is completed", function() {
      expect(sphero.emit).to.be.calledWith("ready");
    });

    it("calls the callabck once", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#command", function() {
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


      sphero.sop2Bitfield = 0xFF;
      stub(sphero.packet, "create");
      stub(sphero, "_queueCallback");
      stub(sphero.connection, "write");
      stub(sphero, "_incSeq").returns(0x01);

      sphero.packet.create.returns(cmdByteArray);

      sphero.command(0x00, 0x01, null, callback);
    });

    it("calls @packet#create with params", function() {
      expect(sphero.packet.create).to.be.calledOnce;
      expect(sphero.packet.create).to.be.calledWith(opts);
    });

    it("calls #_queueCallback with params (0x00, callback)", function() {
      expect(sphero._queueCallback).to.be.calledOnce;
      expect(sphero._queueCallback).to.be.calledWith(0x01, callback);
    });

    it("calls @connection#write with param commandPacket", function() {
      expect(sphero.connection.write).to.be.calledOnce;
      expect(sphero.connection.write).to.be.calledWith(cmdByteArray);
    });
  });

  describe("#_incSeq", function() {
    var seq;

    beforeEach(function() {
      sphero.seqCounter = 10;

      seq = sphero._incSeq();
    });

    it("returns the current @seqCounter value", function() {
      expect(seq).to.be.eql(10);
    });

    it("increments @seqCounter after returning current value", function() {
      expect(sphero.seqCounter).to.be.eql(11);
    });

    context("when @seqCounter is 256", function() {
      beforeEach(function() {
        sphero.seqCounter = 256;
        seq = sphero._incSeq();
      });
      it("returns 0", function() {
        expect(seq).to.be.eql(0);
      });

      it("resets @seqCounter to 1", function() {
        expect(sphero.seqCounter).to.be.eql(1);
      });
    });
  });

  describe("#_queueCallback", function() {
    var callback, fakeTimers;

    beforeEach(function() {
      sphero.seqCounter = 0;
      fakeTimers = sinon.useFakeTimers();

      callback = spy();

      sphero._queueCallback(0x00, callback);
    });

    afterEach(function() {
      fakeTimers.restore();
    });

    it("adds the callback to the @callbackQueue queue", function() {
      expect(sphero.callbackQueue[0]).to.not.be.null;
    });

    it("removes the callback from @callbackQueue after 500ms", function() {
      fakeTimers.tick(500);
      expect(sphero.callbackQueue[0]).to.be.null;
    });

    it("triggers the callback passed", function() {
      var error = new Error("Command sync response was lost.");
      fakeTimers.tick(500);
      expect(callback).to.be.calledWith(error, null);
    });
  });

  describe("#_execCallback", function() {
    var fakeTimers, callback, packet;

    beforeEach(function() {
      packet = {
        sop1: 0xFF,
        sop2: 0xFF,
        mrsp: 0x00,
        seq: 0x00,
        dlen: 0x01,
        checksum: 0xFE
      };

      fakeTimers = sinon.useFakeTimers();
      callback = spy();

      sphero._queueCallback(0x04, callback);
      sphero._execCallback(0x04, packet);
    });

    afterEach(function() {
      fakeTimers.restore();
    });

    it("triggers callback with args", function() {
      expect(callback).to.be.calledWith(null, packet);
    });

    it("removes the callback from the queue", function() {
      expect(sphero.callbackQueue[0x04]).to.be.null;
    });

    context("when queued callback has already been removed", function() {
      it("does not exist and does not try to trigger it", function() {
        sphero._queueCallback(0x04, callback);
        expect(sphero.callbackQueue[0x04]).to.not.be.null;
        sphero._execCallback(0x04, packet);
        expect(sphero.callbackQueue[0x04]).to.be.null;
        sphero._execCallback(0x04, packet);
      });
    });
  });
});
