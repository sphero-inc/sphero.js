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

  describe("#checksum", function() {
    it("creates a buffer checksum", function() {
      var buffer = new Buffer("testing123");
      expect(utils.checksum(buffer)).to.be.eql(0x6b);

      buffer = new Buffer("another buffer");
      expect(utils.checksum(buffer)).to.be.eql(0x74);
    });
  });
});
