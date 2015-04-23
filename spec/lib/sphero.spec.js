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
    beforeEach(function() {

    });
  });
});
