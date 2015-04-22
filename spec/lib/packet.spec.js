"use strict";

var Packet = lib("packet");

describe("Packet", function() {
  var packet;

  beforeEach(function() {
    packet = new Packet();
  });

  describe("#constructor", function() {
    it("generates a Sphero packet representation", function() {
      expect(packet).to.be.an.instanceOf(Packet);
      expect(packet.partialBuffer).to.be.an.instanceOf(Buffer);
      expect(packet.partialCounter).to.be.eql(0);
    });
  });

  describe("#create", function() {
    var buffer, opts;

    beforeEach(function() {
      opts = {
        sop2: 0xFE,
        did: 0x01,
        cid: 0x02,
        seq: 0x03,
        data: [0x04, 0x05, 0x06, 0x07, 0x08]
      };

      buffer = packet.create(opts);
    });

    it("turns packet obj representation into a byte array", function() {
      expect(buffer).to.be.an.instanceOf(Array);
    });

    it("sets 1st byte of the array (SOP1) to 0xFF", function() {
      expect(buffer[0]).to.be.eql(0xFF);
    });

    it("sets 2nd byte of the array (SOP2) to 0xFE", function() {
      expect(buffer[1]).to.be.eql(0xFE);
    });

    it("sets 3rd byte of the array (DID) to 0x01", function() {
      expect(buffer[2]).to.be.eql(0x01);
    });

    it("sets 4th byte of the array (CID) to 0x02", function() {
      expect(buffer[3]).to.be.eql(0x02);
    });

    it("sets 5th byte of the array (SEQ) to 0x03", function() {
      expect(buffer[4]).to.be.eql(0x03);
    });

    it("sets 6th byte of the array (DLEN) to 0x03", function() {
      expect(buffer[5]).to.be.eql(0x06);
    });

    it("sets the checksum (last byte) of the array to 0xD5", function() {
      expect(buffer[buffer.length - 1]).to.be.eql(0xD5);
    });
  });

  describe("#parse", function() {
    context("with sync response", function() {
      var buffer, res, data;

      beforeEach(function() {
        data = [0x05, 0x04, 0x03, 0x02, 0x01];
        buffer = new Buffer([0xFF, 0xFF, 0x00, 0x02, 0x06].concat(data, 0xE8));

        res = packet.parse(buffer);
      });

      it("turns a sphero buffer response into a response obj", function() {
        expect(res).to.be.an.instanceOf(Object);
      });

      it("res@sop1 should be 0xFF", function() {
        expect(res.sop1).to.be.eql(0xFF);
      });

      it("res@sop2 should be 0xFF", function() {
        expect(res.sop2).to.be.eql(0xFF);
      });

      it("res@mrsp should be 0x00", function() {
        expect(res.mrsp).to.be.eql(0x00);
      });

      it("res@seq should be 0x02", function() {
        expect(res.seq).to.be.eql(0x02);
      });

      it("res@dlen should be 0x06", function() {
        expect(res.dlen).to.be.eql(0x06);
      });

      it("res@data should be a buffer 6 bytes long", function() {
        expect(res.data).to.be.an.instanceOf(Buffer);
        expect(res.data.length).to.be.eql(res.dlen - 1);
      });

      it("res@data should be eql", function() {
        var tmpBuffer = new Buffer(data);
        expect(res.data).to.be.eql(tmpBuffer);
      });

      it("res@checksum should be 0xFE", function() {
        expect(res.checksum).to.be.eql(0xE8);
      });

      context("when partialResponse is not empty", function() {
        beforeEach(function() {
          buffer = new Buffer([0xFF, 0x00, 0x02, 0x01].concat(0xFC));
          packet.partialBuffer = new Buffer([0xFF]);

          res = packet.parse(buffer);
        });

        it("returns a packet obj when calling parse", function() {
          expect(res).to.not.be.null;
          expect(res).to.be.eql({
            sop1: 0xFF,
            sop2: 0xFF,
            mrsp: 0x00,
            seq: 0x02,
            dlen: 0x01,
            data: new Buffer(0),
            checksum: 0xFC,
          });
        });

        it("packet@partialBuffer is empty", function() {
          expect(packet.partialBuffer.length).to.be.eql(0);
        });
      });
    });

    context("sync response", function() {
      var buffer, res, data;

      beforeEach(function() {
        data = [0x05, 0x04, 0x03, 0x02, 0x01];
        buffer = new Buffer([0xFF, 0xFE, 0x0A, 0x00, 0x06].concat(data, 0xE0));

        res = packet.parse(buffer);
      });

      it("turns a sphero buffer response into a response obj", function() {
        expect(res).to.be.an.instanceOf(Object);
      });

      it("packet res@idCode should be 0x0A", function() {
        expect(res.idCode).to.be.eql(0x0A);
      });

      it("packet res@dlenMsb should be 0x00", function() {
        expect(res.dlenMsb).to.be.eql(0x00);
      });

      it("packet res@dlenLsb should be 0x06", function() {
        expect(res.dlenLsb).to.be.eql(0x06);
      });

      it("packet res@dlen should be 0x06", function() {
        expect(res.dlen).to.be.eql(0x06);
      });

      it("packet res@checksum should be 0xFE", function() {
        expect(res.checksum).to.be.eql(0xE0);
      });
    });
  });
});
