"use strict";

var Sphero = lib("sphero");

var Packet = lib("packet"),
    SerialPort = lib("adaptors/serialport");

describe("Sphero", function() {
  var sphero;

  beforeEach(function() {
    sphero = new Sphero("/dev/rfcomm0");
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
      expect(sphero.setRgbLed).to.be.a("function");
    });

    it("adds custom device methods", function() {
      expect(sphero.color).to.be.a("function");
    });

    context("when calling Sphero class as a function", function() {
      it("throws because Sphero is a constructor", function() {
        var spheroClass = Sphero;
        expect(spheroClass).to.throw();
      });
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
      stub(sphero, "_responseCmd");
      stub(sphero, "_execCallback");
      stub(sphero.packet, "on");
      stub(sphero.packet, "parse");
      stub(sphero.packet, "parseResponseData");
      spy(sphero.packet, "parseAsyncData");
      stub(sphero.connection, "open");
      stub(sphero.connection, "onRead");
      stub(sphero.connection, "on");

      sphero.packet.on.yields();
      sphero.packet.parse.returns(packet);
      sphero.packet.parseResponseData.returns(packet);
      // sphero.packet.parseAsyncData.returns(packet);
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
      sphero.packet.parseResponseData.restore();
      // sphero.packet.parseAsyncData.restore();
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
          cid: 18,
          did: 2,
          idCode: 7,
          desc: "Collision detected",
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

      it("emits a collision event", function() {
        expect(sphero.emit).to.be.calledWith("collision", {
          axis: 1,
          cid: 18,
          did: 2,
          idCode: 7,
          desc: "Collision detected",
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
      expect(sphero.connection.on).to.be.calledWith("open");
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

    it("calls the callback once", function() {
      expect(callback).to.be.calledOnce;
    });

    it("returns void when callback is not a function", function() {
      callback.reset();
      sphero.connect();
      expect(sphero.connection.open).to.not.return;
      expect(callback).to.not.be.called;
    });

    context("with invalid SOP2", function() {
      beforeEach(function() {
        sphero.packet.parseResponseData.reset();
        sphero.packet.parseAsyncData.reset();
        sphero._execCallback.reset();

        packet.sop2 = 0xF0;
        sphero.packet.parse.returns(packet);

        sphero.connect(callback);
      });

      it("does not call _execCallback", function() {
        expect(sphero._execCallback).to.not.be.called;
      });

      it("does not call @packet.parseResponseData", function() {
        expect(sphero.packet.parseResponseData).to.not.be.called;
      });

      it("does not call @packet.parseAsyncData", function() {
        expect(sphero.packet.parseAsyncData).to.not.be.called;
      });
    });

    context("with invalid parsedPayload", function() {
      beforeEach(function() {
        sphero.packet.parse.returns(null);
        sphero.packet.parseResponseData.reset();
        sphero.packet.parseAsyncData.reset();
        sphero.connect(callback);
        sphero.packet.parse.returns(packet);
      });

      it("does not call _execCallback", function() {
        expect(sphero._execCallback).to.be.calledOnce;
      });

      it("does not call @packet.parseResponseData", function() {
        expect(sphero.packet.parseResponseData).to.not.be.called;
      });

      it("does not call @packet.parseAsyncData", function() {
        expect(sphero.packet.parseAsyncData).to.not.be.called;
      });
    });
  });

  describe("#disconnect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      sphero.connection.close = stub();
      sphero.disconnect(callback);
    });

    it("tells the Sphero adaptor to disconnect", function() {
      expect(sphero.connection.close).to.be.calledWith(callback);
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

    it("calls #_queueCallback with params (cmdPacket, callback)", function() {
      expect(sphero._queueCallback).to.be.calledOnce;
      expect(sphero._queueCallback).to.be.calledWith(cmdByteArray, callback);
    });

    it("calls @connection#write with param commandPacket", function() {
      expect(sphero.connection.write).to.be.calledOnce;
      expect(sphero.connection.write).to.be.calledWith(cmdByteArray);
    });
  });

  describe("#_queueCommand", function() {
    var callback, packet;

    beforeEach(function() {
      callback = spy();
      sphero.commandQueue = [];
      packet = [0xFF, 0xFF, 0x00, 0x01, 0x00, 0x01, 0xFE];
      sphero._queueCommand(packet, callback);
    });

    it("Adds a command and callback to the @commandQueue", function() {
      expect(sphero.commandQueue.length).to.be.eql(1);
      expect(sphero.commandQueue)
        .to.be.eql([
          { packet: packet, cb: callback}
        ]);
    });

    context("@commandQueue is full del next command in the queue", function() {
      var packet2, packet3;

      beforeEach(function() {
        packet2 = [0xFF, 0xFF, 0x00, 0x04, 0x00, 0x01, 0xFE];
        packet2 = [0xFF, 0xFF, 0x00, 0x08, 0x00, 0x01, 0xFE];

        for (var i = 1; i < 256; i++) {
          sphero._queueCommand(packet2, callback);
        }

        sphero._queueCommand(packet3, callback);
      });

      it("discards next cmd and ads new cmd at the end", function() {
        expect(sphero.commandQueue.length).to.be.eql(256);
        expect(sphero.commandQueue[0])
          .to.be.eql({ packet: packet2, cb: callback});
        expect(sphero.commandQueue[255])
          .to.be.eql({ packet: packet3, cb: callback});
      });
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
    var callback, fakeTimers, cmdPacket;

    beforeEach(function() {
      cmdPacket = new Buffer([0xFF, 0xFD, 0x00, 0x01, 0x04, 0x01, 0xFD]);
      sphero.seqCounter = 0;
      fakeTimers = sinon.useFakeTimers();

      callback = spy();
      stub(sphero, "_execCommand");

      sphero._queueCallback(cmdPacket, callback);
    });

    afterEach(function() {
      sphero._execCommand.restore();
      fakeTimers.restore();
    });

    it("triggers the callback with the packet", function() {
      var packet = {
        sop1: 0xFF,
        sop2: 0xFF,
        mrsp: 0x00,
        seq: 0x00,
        dlen: 0x01,
        checksum: 0xFE
      };
      sphero._execCallback(4, packet);
      expect(callback).to.be.calledWith(null, packet);
    });

    it("adds the callback to the @callbackQueue queue", function() {
      expect(sphero.callbackQueue[4]).to.not.be.null;
    });

    it("removes the callback from @callbackQueue after 500ms", function() {
      fakeTimers.tick(500);
      expect(sphero.callbackQueue[4]).to.be.null;
    });

    it("triggers the callback passed", function() {
      var error = new Error("Command sync response was lost.");
      fakeTimers.tick(500);
      expect(callback).to.be.calledWith(error, null);
    });

    it("calls #_execCommand once", function() {
      fakeTimers.tick(500);
      expect(sphero._execCommand).to.be.calledOnce;
    });

    it("triggers #_execCommand if callback is null", function() {
      fakeTimers.tick(500);
      sphero._queueCallback(cmdPacket);
      fakeTimers.tick(500);
      expect(callback).to.be.calledOnce;
      expect(sphero._execCommand).to.be.calledTwice;
    });

  });

  describe("#_execCallback", function() {
    var fakeTimers, callback, packet, cmdPacket;

    beforeEach(function() {
      cmdPacket = new Buffer([0xFF, 0xFD, 0x00, 0x01, 0x04, 0x01, 0xFD]);

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

      sphero._queueCallback(cmdPacket, callback);
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
        sphero._queueCallback(cmdPacket, callback);
        expect(sphero.callbackQueue[0x04]).to.not.be.null;
        sphero._execCallback(0x04, packet);
        expect(sphero.callbackQueue[0x04]).to.be.null;
        sphero._execCallback(0x04, packet);
      });
    });
  });

  describe("#responseCmd", function() {
    beforeEach(function() {
      sphero.callbackQueue[1] = {
        did: 0x00,
        cid: 0x01,
        callback: spy(),
        timeoutId: 1
      };
    });

    it("returns did and cid stored in seq pos of callbackQueue", function() {
      expect(sphero._responseCmd(1)).to.be.eql({ did: 0x00, cid: 0x01 });
    });

    it("returns null if the callbackQueue position is not found", function() {
      expect(sphero._responseCmd(100)).to.be.null;
    });
  });
});
