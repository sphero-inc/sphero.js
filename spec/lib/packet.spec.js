// jshint expr:true

var Packet = lib("packet");

describe("Packet", function() {
  var packet, did, cid, opts;

  beforeEach(function() {
    did = 0x0A;
    cid = 0x4A;
    opts = { one: "one", two: 0x41 };

    packet = new Packet(did, cid, opts);
  });

  describe("#constructor", function() {
    it("generates a Sphero packet representation", function() {
      expect(packet).to.be.an.instanceOf(Packet);
      expect(packet.DID).to.be.eql(did);
      expect(packet.CID).to.be.eql(cid);
      expect(packet.opts).to.be.eql({ one: "one", two: 0x41 });
    });
  });

  describe("#build", function() {
    beforeEach(function() {
      packet = new Packet(0x01, 0x02, {
        SEQ: 0x10,
        DATA: new Buffer("data")
      });
    });

    it("turns an internal packet representation into a buffer", function() {
      var buffer = packet.build();

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
