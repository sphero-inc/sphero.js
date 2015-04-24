"use strict";

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

  describe("#intToHexArray", function() {
    it("converts a number to an array of hex values", function() {
      expect(utils.intToHexArray(1, 1)).to.be.eql([0x01]);
      expect(utils.intToHexArray(255, 1)).to.be.eql([0xFF]);
      expect(utils.intToHexArray(256, 1)).to.be.eql([0x00]);
      expect(utils.intToHexArray(256, 2)).to.be.eql([0x01, 0x00]);
      expect(utils.intToHexArray(255, 2)).to.be.eql([0x00, 0xFF]);
      expect(utils.intToHexArray(257, 2)).to.be.eql([0x01, 0x01]);
      expect(utils.intToHexArray(256, 4)).to.be.eql([0x00, 0x00, 0x01, 0x00]);
      expect(utils.intToHexArray(257, 4)).to.be.eql([0x00, 0x00, 0x01, 0x01]);
      expect(utils.intToHexArray(65535, 4)).to.be.eql([0x00, 0x00, 0xFF, 0xFF]);
      expect(utils.intToHexArray(65535, 2)).to.be.eql([0xFF, 0xFF]);
    });
  });
});
