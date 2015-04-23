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

    it("sets callbacks array to 256 length array", function() {
      expect(sphero.callbacks).to.be.an.instanceOf(Array);
      expect(sphero.callbacks.length).to.be.eql(256);
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
        sphero.connect(callback);
      });

      it("emits an async event", function() {
        expect(sphero.emit).to.be.calledWith("async", packet);
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
});
