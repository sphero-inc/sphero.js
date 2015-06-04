"use strict";

var serialport = require("serialport");

var EventEmitter = require("events").EventEmitter;

var Adaptor = lib("adaptors/serialport");

describe("Serialport Adaptor", function() {
  var adaptor, port;

  beforeEach(function() {
    adaptor = new Adaptor("/dev/rfcomm0");
    port = new EventEmitter();
    stub(serialport, "SerialPort").returns(port);
  });

  afterEach(function() {
    serialport.SerialPort.restore();
  });

  it("is a class", function() {
    expect(Adaptor.constructor).to.be.a("function");
  });

  describe("#constructor", function() {
    it("sets @conn", function() {
      expect(adaptor.conn).to.be.eql("/dev/rfcomm0");
    });

    it("sets @serialport", function() {
      expect(adaptor.serialport).to.be.null;
    });
  });

  describe("#open", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor.open(callback);
    });

    it("creates a new SerialPort instance", function() {
      expect(adaptor.serialport).to.be.eql(port);
    });

    it("doesn't automatically trigger the callback", function() {
      expect(callback).to.not.be.called;
    });

    context("when the serialport emits 'open'", function() {
      var emit;

      beforeEach(function() {
        emit = adaptor.emit = spy();
      });

      context("if there wasn't an error", function() {
        beforeEach(function() {
          port.emit("open");
        });

        it("triggers the callback", function() {
          expect(callback).to.be.called;
        });

        it("emits 'open'", function() {
          expect(emit).to.be.calledWith("open");
        });

        it("passes through 'error' events", function() {
          port.emit("error", "error message");
          expect(emit).to.be.calledWith("error", "error message");
        });

        it("passes through 'close' events", function() {
          port.emit("close", "port closed");
          expect(emit).to.be.calledWith("close", "port closed");
        });

        it("passes through 'data' events", function() {
          port.emit("data", "new data");
          expect(emit).to.be.calledWith("data", "new data");
        });
      });

      context("if there was an error while opening", function() {
        beforeEach(function() {
          port.emit("open", "error!");
        });

        it("triggers the callback with the error", function() {
          expect(callback).to.be.calledWith("error!");
        });

        it("doesn't emit 'open'", function() {
          expect(emit).to.not.be.calledWith("open");
        });
      });
    });
  });

  describe("function", function() {
    var data, callback;

    beforeEach(function() {
      port.write = stub();
      port.close = stub();

      stub(adaptor, "on");

      data = [0x0f, 0x10, 0x03];
      callback = spy();

      adaptor.serialport = port;
    });

    it("#write calls @serialport#write with", function() {
      adaptor.write(data, callback);
      expect(adaptor.serialport.write).to.be.calledWith(data, callback);
    });

    it("#onRead calls #on with", function() {
      adaptor.onRead(callback);
      expect(adaptor.on).to.be.calledWith("data", callback);
    });

    it("#onRead calls #on with", function() {
      adaptor.close(callback);
      expect(adaptor.serialport.close).to.be.calledWith(callback);
    });
  });
});

