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

    it("adds the callback to the @callbacks queue", function() {
      expect(sphero.callbacks[0]).to.not.be.null;
    });

    it("removes the callback from @callbacks after 100ms", function() {
      fakeTimers.tick(101);
      expect(sphero.callbacks[0]).to.be.null;
    });

    it("triggers the callback passed", function() {
      var error = new Error("Command sync response was lost.");
      fakeTimers.tick(101);
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
      expect(sphero.callbacks[0x04]).to.be.null;
    });
  });

  describe("#_bindDevice", function() {
    var device;

    beforeEach(function() {
      device = {
        cmdOne: function() {
          return "one";
        },
        cmdTwo: function() {
          return "two";
        },
        cmdThree: function() {
          return "tres";
        }
      };

      sphero._bindDevice(device);
    });

    it("adds and binds device properties", function() {
      expect(sphero.cmdOne).to.be.a("function");
    });

    it("bound command to return a value", function() {
      expect(sphero.cmdOne()).to.be.eql("one");
    });
  });
});
