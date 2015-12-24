"use strict";

var Packet = lib("packet"),
    utils = lib("utils");

describe("Packet", function() {
  var packet;

  beforeEach(function() {
    packet = new Packet({emitPacketErrors: true});
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

    it("sets 1st byte of the array (SOP1) the value passed", function() {
      opts.sop1 = 0xF0;
      buffer = packet.create(opts);
      expect(buffer[0]).to.be.eql(0xF0);
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

    context("when packet opts not specified", function() {
      beforeEach(function() {
        buffer = packet.create();
      });

      it("sets 1st byte of the array (SOP1) to 0xFF", function() {
        expect(buffer[0]).to.be.eql(0xFF);
      });

      it("sets 2nd byte of the array (SOP2) defult value", function() {
        expect(buffer[1]).to.be.eql(0xFF);
      });

      it("sets 3rd byte of the array (DID) to 0x01", function() {
        expect(buffer[2]).to.be.eql(0x00);
      });

      it("sets 4th byte of the array (CID) to 0x02", function() {
        expect(buffer[3]).to.be.eql(0x01);
      });

      it("sets 5th byte of the array (SEQ) to 0x03", function() {
        expect(buffer[4]).to.be.eql(0x00);
      });

      it("sets data of the array (data) to []", function() {
        expect(buffer[5]).to.be.eql(1);
      });
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

      context(" when checksum is incorrect", function() {
        beforeEach(function() {
          var tmpBuffer = [0xFF, 0xFF, 0x00, 0x02, 0x06];

          data = [0x05, 0x04, 0x03, 0x02, 0x01];
          buffer = new Buffer(tmpBuffer.concat(data, 0xEE));

          stub(packet, "emit");

          packet.emitPacketErrors = true;
          res = packet.parse(buffer);
        });

        afterEach(function() {
          packet.emit.restore;
        });

        it("emits an error event with a checksum Error param", function() {
          expect(packet.emit).to.be.calledOnce;
          expect(packet.emit)
            .to.be.calledWith(
              "error",
              new Error("Incorrect checksum, packet discarded")
            );
        });

        it("@partialBuffer should be empty", function() {
          expect(packet.partialBuffer.length).to.be.eql(0);
        });

        it("res should be null", function() {
          expect(res).to.be.null;
        });
      });

      context("buffer length is less than minSizeReq", function() {
        beforeEach(function() {
          buffer = new Buffer([0xFF, 0xFF, 0x00, 0x02]);

          res = packet.parse(buffer);
        });

        it("partialBuffer should not be empty", function() {
          expect(packet.partialBuffer.length).to.be.eql(4);
        });

        it("res should be null", function() {
          expect(res).to.be.null;
        });
      });

      context("buffer length is less than expectedSize", function() {
        beforeEach(function() {
          buffer = new Buffer([0xFF, 0xFF, 0x00, 0x02, 0x06, 0x01, 0x02]);

          res = packet.parse(buffer);
        });

        it("partialBuffer should not be empty", function() {
          expect(packet.partialBuffer.length).to.be.eql(7);
        });

        it("res should be null", function() {
          expect(res).to.be.null;
        });
      });

      context("buffer length is greater than expectedSize", function() {
        beforeEach(function() {
          buffer = new Buffer(
            [0xFF, 0xFF, 0x00, 0x02, 0x01, 0xFC, 0xFF, 0xFF, 0x00]
          );

          res = packet.parse(buffer);
        });

        it("partialBuffer should not be empty", function() {
          expect(packet.partialBuffer.length).to.be.eql(3);
        });

        it("partialBuffer should be eql to", function() {
          var tmpBuffer = new Buffer([0xFF, 0xFF, 0x00]);
          expect(packet.partialBuffer).to.be.eql(tmpBuffer);
        });

        it("res should be a packet obj", function() {
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
      });

      context("SOPs don't pass validation", function() {
        beforeEach(function() {
          buffer = new Buffer([0xF0, 0x00, 0x02, 0x01].concat(0xFC));
        });

        context("and @partialBuffer is empty", function() {
          beforeEach(function() {
            res = packet.parse(buffer);
          });

          it("partialBuffer should not be empty", function() {
            expect(packet.partialBuffer.length).to.be.eql(5);
          });

          it("res should be null", function() {
            expect(res).to.be.null;
          });
        });

        context("and @partialBuffer is NOT empty", function() {
          beforeEach(function() {
            packet.partialBuffer = new Buffer([0xFF]);
            res = packet.parse(buffer);
          });

          it("partialBuffer should be empty", function() {
            expect(packet.partialBuffer.length).to.be.eql(0);
          });

          it("res should be null", function() {
            expect(res).to.be.null;
          });
        });
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

  describe("#parseResponseData", function() {
    var payload;

    beforeEach(function() {
      payload = {
        sop1: 0xFF,
        sop2: 0xFF,
        mrsp: 0x00,
        seq: 0x02,
        dlen: 0x01,
        data: new Buffer(0),
        checksum: 0xFC,
      };

      stub(packet, "_parseData");
      packet._parseData.returns({ val1: "uno" });

      packet.parseResponseData({ did: 0x02, cid: 0x07 }, payload);
    });

    it("returns payload if cmd is not valid", function() {
      var res = packet.parseResponseData({}, payload);
      expect(res).to.be.eql(payload);
    });

    it("calls #_parseData with params", function() {
      var parser = {
        desc: "Get Chassis Id",
        did: 2,
        cid: 7,
        event: "chassisId",
        fields: [{ name: "chassisId", type: "number" }]
      };
      expect(packet._parseData).to.be.calledWith(parser, payload);
    });
  });

  describe("#_parseData", function() {
    var parser, payload;

    beforeEach(function() {
      payload = {
        sop1: 0xFF,
        sop2: 0xFF,
        mrsp: 0x00,
        seq: 0x02,
        dlen: 0x01,
        data: new Buffer([0xff]),
        checksum: 0xFC,
      };

      parser = {
        desc: "Get Chassis Id",
        did: 2,
        cid: 7,
        event: "chassisId",
        fields: [{ name: "chassisId", type: "number" }]
      };

      stub(packet, "_checkDSMasks");
    });

    afterEach(function() {
      packet._checkDSMasks.restore();
    });

    context("when dsMasks return -1", function() {
      beforeEach(function() {
        packet._checkDSMasks.returns(-1);
        packet._parseData(parser, payload);
      });

      it("calls #_checkDSMasks once", function() {
        expect(packet._checkDSMasks).to.be.calledOnce;
      });

      it("returns payload inmmediately", function() {
        expect(packet._parseData(parser, payload)).to.be.eql(payload);
      });
    });

    context("when dsBit returs 1", function() {
      beforeEach(function() {
        stub(packet, "_checkDSBit");
        stub(packet, "_parseField");

        packet._checkDSMasks.returns(0);
        packet._checkDSBit.returns(1);
        packet._parseField.returns(255);

        packet._parseData(parser, payload, { did: 0x02, cid: 0x07 });
      });

      afterEach(function() {
        packet._checkDSBit.restore();
        packet._parseField.restore();
      });

      it("calls #_checkDSBit once", function() {
        expect(packet._checkDSBit).to.be.calledOnce;
      });

      it("calls #_parseField with params", function() {
        var field = parser.fields[0];
        field.from = 0;
        field.to = 2;
        expect(packet._parseField).to.be.calledOnce;
      });
    });

    context("when dsBit returs 0", function() {
      beforeEach(function() {
        stub(packet, "_incParserIndex");
        stub(packet, "_checkDSBit");
        stub(packet, "_parseField");

        packet._checkDSMasks.returns(0);
        packet._incParserIndex.returns(1);
        packet._checkDSBit.returns(0);
        packet._parseField.returns(255);

        packet._parseData(parser, payload, { did: 0x02, cid: 0x07 });
      });

      afterEach(function() {
        packet._incParserIndex.restore();
        packet._checkDSBit.restore();
        packet._parseField.restore();
      });

      it("calls #_incParserIndex once with params", function() {
        expect(packet._incParserIndex).to.be.calledOnce;
        expect(packet._incParserIndex)
          .to.be.calledWith(0, parser.fields, payload.data, 0, 0);
      });
    });

    context("parser is null or data length is 0", function() {
      beforeEach(function() {
        payload.data = new Buffer(0);
        spy(packet, "_parseData");
        packet._parseData(null, payload, { did: 0x02, cid: 0x07 });
      });

      it("calls #_incParserIndex once with params", function() {
        expect(packet._parseData).returned(payload);
      });
    });
  });

  describe("#CheckdsMasks", function() {
    beforeEach(function() {
      spy(packet, "_checkDSMasks");
    });

    afterEach(function() {
      packet._checkDSMasks.restore();
    });

    it("returns null when idCode !== 0x03", function() {
      packet._checkDSMasks({}, { idCode: 0x07 });
      expect(packet._checkDSMasks).to.have.returned(null);
    });

    it("returns ds obj when ds is valid and idCode == 0x03", function() {
      var ds = { mask1: 0xFF00, mask2: 0x00FF };
      packet._checkDSMasks(ds, { idCode: 0x03 });
      expect(packet._checkDSMasks).to.have.returned(ds);
    });

    it("returns -1 when ds is invalid and idCode == 0x03", function() {
      var ds = { mask1: 0xFF00 };
      packet._checkDSMasks(ds, { idCode: 0x03 });
      expect(packet._checkDSMasks).to.have.returned(-1);
    });
  });

  describe("#_incParserIndex", function() {
    beforeEach(function() {
      spy(packet, "_incParserIndex");
    });

    afterEach(function() {
      packet._incParserIndex.restore();
    });

    it("returns i++ with dsFlag < 0", function() {
      packet._incParserIndex(0, [], [], -1, 0);
      expect(packet._incParserIndex).to.have.returned(1);
    });

    it("returns i++ with i < fields.length", function() {
      packet._incParserIndex(0, [1, 2, 3], [4, 5, 6]);
      expect(packet._incParserIndex).to.have.returned(1);
    });

    it("returns i++ with dsIndex = data.length", function() {
      packet._incParserIndex(0, [1, 2, 3], [4, 5, 6, 7], 0, 4);
      expect(packet._incParserIndex).to.have.returned(1);
    });

    it("returns i = 0 when all conditions met", function() {
      packet._incParserIndex(3, [1, 2, 3, 4], [4, 5, 6, 7], 0, 2);
      expect(packet._incParserIndex).to.have.returned(0);
    });
  });

  describe("checker", function() {
    it("#_checksum should return 0xFC", function() {
      var buffer = [0xFF, 0xFF, 0x00, 0x02, 0x01, 0xFC],
          check = utils.checksum(buffer.slice(3, 5));
      expect(check).to.be.eql(0xFC);
    });

    it("#_checkSOPs with SOP2 0xFF should return 'sync'", function() {
      var buffer = [0xFF, 0xFF, 0x00, 0x02, 0x01, 0xFC],
          check = packet._checkSOPs(buffer);
      expect(check).to.be.eql("sync");
    });

    it("#_checkSOPs with SOP2 0xFE should return 'async'", function() {
      var buffer = [0xFF, 0xFE, 0x00, 0x02, 0x01, 0xFC],
          check = packet._checkSOPs(buffer);
      expect(check).to.be.eql("async");
    });

    it("#_checkSOPs with SOP2 0xFE should return 'async'", function() {
      var buffer = [0xFF, 0xFC, 0x00, 0x02, 0x01, 0xFC],
          check = packet._checkSOPs(buffer);
      expect(check).to.be.eql(false);
    });

    it("#_checkExpectedSize should return 6 when size == expected", function() {
      var buffer = [0xFF, 0xFF, 0x00, 0x02, 0x01, 0xFC],
          check = packet._checkExpectedSize(buffer);
      expect(check).to.be.eql(6);
    });

    it("#_checkExpectedSize should return -1 when size < expected", function() {
      var buffer = [0xFF, 0xFC, 0x00, 0x02, 0x04, 0x02, 0x03],
          check = packet._checkExpectedSize(buffer);
      expect(check).to.be.eql(-1);
    });

    it("#_checkMinSize should return true when size >= min", function() {
      var buffer = [0xFF, 0xFF, 0x00, 0x02, 0x01, 0xFC],
          check = packet._checkMinSize(buffer);
      expect(check).to.be.eql(true);
    });

    it("#_checkMinSize should return false when size < min", function() {
      var buffer = [0xFF, 0xFC, 0x00, 0x02, 0x01],
          check = packet._checkMinSize(buffer);
      expect(check).to.be.eql(false);
    });
  });

  describe("#checkDSBit", function() {
    beforeEach(function() {
      spy(packet, "_checkDSBit");
    });

    afterEach(function() {
      packet._checkDSBit.restore();
    });

    it("returns -1 when DS is invalid", function() {
      packet._checkDSBit(null);
      expect(packet._checkDSBit).to.have.returned(-1);
    });

    it("returns 1 when DS valid and field in mask1|2", function() {
      packet._checkDSBit(
        { mask1: 0xFFFF },
        { bitmask: 0x1000, maskField: "mask1"
      });
      expect(packet._checkDSBit).to.have.returned(1);
    });

    it("returns 0 when DS valid and field not in mask1|2", function() {
      packet._checkDSBit(
        { mask1: 0x0FFF },
        { bitmask: 0x1000, maskField: "mask1"
      });
      expect(packet._checkDSBit).to.have.returned(0);
    });
  });

  describe("#_parseField", function() {
    var data, field;

    beforeEach(function() {
      field = {
        name: "chassisId",
        type: "number",
      };

      data = {
        slice: stub()
      };

      data.slice.returns(new Buffer([0xFF, 0xFE, 0x00, 0x01]));
      spy(utils, "bufferToInt");

      spy(packet, "_parseField");

      packet._parseField(field, data);
    });

    afterEach(function() {
      utils.bufferToInt.restore();
    });

    it("calls data#slice", function() {
      expect(data.slice).to.be.calledOnce;
      expect(data.slice).to.be.calledWith(undefined, undefined);
    });

    it("calls utils#bufferToInt", function() {
      expect(utils.bufferToInt).to.be.calledOnce;
    });

    context("when field type is: ", function() {
      beforeEach(function() {
        data.slice.reset();
        utils.bufferToInt.reset();
        packet._parseField.reset();
        packet._parseField(field, [255]);
      });

      it("'number' returns the value", function() {
        expect(packet._parseField).to.have.returned(255);
      });

      it("'signed' returns the signed value", function() {
        field.type = "signed";
        field.from = 0;
        field.to = 1;
        var tmpVal = packet._parseField(field, new Buffer([0xFF, 0xFE, 0x00, 0x01]));
        expect(tmpVal).to.be.eql(-1);
      });

      it("'number' returns a hex string when format == 'hex'", function() {
        field.format = "hex";
        packet._parseField(field, [255]);
        expect(packet._parseField).to.have.returned("0xFF");
        field.format = undefined;
      });

      it("'string' returns a string with format == 'ascii'", function() {
        field.type = "string";
        field.format = "ascii";
        packet._parseField(field, new Buffer([0x48, 0x6F, 0x6C, 0x61, 0x21]));
        expect(packet._parseField).to.have.returned("Hola!");
        field.format = undefined;
      });

      it("'raw' returns the raw array", function() {
        var buffer = new Buffer([0x48, 0x6F, 0x6C, 0x61, 0x21]);
        field.type = "raw";
        var tmpVal = packet._parseField(field, buffer);
        expect(tmpVal).to.be.eql(buffer);
      });

      it("'predefined' returns 'battery OK'", function() {
        var buffer = new Buffer([0x02]);
        field.type = "predefined";
        field.values = { 0x02: "battery OK" };
        packet._parseField(field, buffer);
        expect(packet._parseField).to.have.returned("battery OK");
        field.values = undefined;
      });

      it("'predefined' returns 'true' with mask", function() {
        var buffer = new Buffer([0x0F]);
        field.type = "predefined";
        field.mask = "0x01";
        field.values = { 0x01: true };
        packet._parseField(field, buffer);
        expect(packet._parseField).to.have.returned(true);
        field.values = undefined;
      });

      it("'bitmask' calls #_parseBotmaskField", function() {
        stub(packet, "_parseBitmaskField");
        packet._parseBitmaskField.returns({ val: "all Good" });
        field.type = "bitmask";
        packet._parseField(field, [0x01, 0x02], { val1: "one" });
        expect(packet._parseBitmaskField).to.be.calledOnce;
        expect(packet._parseBitmaskField)
          .to.be.calledWith(
            258, field, { val1: "one" }
          );
        packet._parseBitmaskField.restore();
      });

      it("'bitmask' calls #_parseBotmaskField", function() {
        field.type = "thevoid";
        stub(packet, "emit");
        packet._parseField(field, [0x01, 0x02]);
        expect(packet.emit).to.be.calledOnce;
        var error = new Error("Data could not be parsed!");
        expect(packet.emit).to.be.calledWith("error", error);
        expect(packet._parseField)
          .to.have.returned("Data could not be parsed!");
      });
    });
  });

  describe("#_parseBitmaskField", function() {
    var field;

    beforeEach(function() {
      field = {
        name: "gyro",
        sensor: "gyro",
        units: "gyrons",
        range: {
          top: 0x0FFF,
          bottom: -255,
        },
        value: [1]
      };

      stub(utils, "twosToInt");
      utils.twosToInt.returns(255);
      spy(packet, "_parseBitmaskField");
    });

    afterEach(function() {
      utils.twosToInt.restore();
      packet._parseBitmaskField.restore();
    });

    it(" if val > field.range.top calls utils#twosToInt", function() {
      packet._parseBitmaskField(0xFF00, field, {});
      expect(utils.twosToInt).to.be.calledOnce;
      expect(utils.twosToInt).to.be.calledWith(0xFF00, 2);
    });

    it("adds to the array if field already exist", function() {
      packet._parseBitmaskField(0xFE, field, { gyro: field });
      field.value.push(255);
      expect(packet._parseBitmaskField)
        .to.have.returned(field);
    });
  });

});
