// jshint expr:true

var utils = lib("utils");

describe("utils", function() {
  describe("randomColor", function() {
    it("returns a random hex color", function() {
      var random = utils.randomColor;

      expect(random()).to.be.a("number");
      expect(random()).to.not.be.eql(random());

      var val = random().toString();
      expect(Number.isNaN(parseInt(val, 16))).to.be.eql(false);
    });
  });

  describe("#rgbToHex", function() {
    it("RGB values into an equivalent hex number", function() {
      expect(utils.rgbToHex(0, 0, 128)).to.be.eql(0x00080);
      expect(utils.rgbToHex(200, 10, 25)).to.be.eql(0xC80A19);
    });
  });

  describe("#createPacket", function() {
    var did, cid, opts;

    beforeEach(function() {
      did = 0x0A;
      cid = 0x4A;
      opts = { one: "one", two: 0x41 };
    });

    it("generates a Sphero packet with the provided DID and CID", function() {
      expect(utils.createPacket(did, cid, opts)).to.be.eql({
        DID: did,
        CID: cid,
        one: "one",
        two: 0x41
      });

      expect(utils.createPacket(did, cid)).to.be.eql({ DID: did, CID: cid });
    });
  });

  describe("#checksum", function() {
    it("creates a buffer checksum", function() {
      var buffer = new Buffer("testing123");
      expect(utils.checksum(buffer)).to.be.eql(0x6b);

      buffer = new Buffer("another buffer");
      expect(utils.checksum(buffer)).to.be.eql(0x74);
    });
  });

  describe("#generatePacket", function() {
    var packet;

    beforeEach(function() {
      packet = utils.createPacket(0x01, 0x02, {
        SEQ: 0x10,
        DATA: new Buffer("data")
      });
    });

    it("turns an internal packet representation into a buffer", function() {
      var buffer = utils.generatePacket(packet);

      function read(offset) { return buffer.readUInt8(offset); }

      // DID
      expect(read(2)).to.be.eql(0x01);

      // CID
      expect(read(3)).to.be.eql(0x02);

      // SEQ
      expect(read(4)).to.be.eql(0x10);
    });
  });
});
