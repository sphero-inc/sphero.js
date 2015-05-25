"use strict";

var utils = lib("utils");

describe("utils", function() {
  describe("randomColor", function() {
    it("returns a random color object", function() {
      var random = utils.randomColor;

      expect(random()).to.be.an("object");
      expect(random()).to.not.be.eql(random());

      var val = random();

      expect(val.red).to.be.a("number");
      expect(val.green).to.be.a("number");
      expect(val.blue).to.be.a("number");
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

  describe("#argsToHexArray", function() {
    it("converts arguments to an bytes array of hex values", function() {
      var array = utils.argsToHexArray(128, 255, 32);
      expect(array).to.be.eql([128, 255, 32]);
    });
  });

  describe("#twosToInt", function() {
    it("converts a two's complement value to a signed integer", function() {
      expect(utils.twosToInt(0x9828)).to.be.eql(-26584);
      expect(utils.twosToInt(0xCED8)).to.be.eql(-12584);
    });
  });

  describe("#xor32bit", function() {
    it("applies a bitwise XOR operation to 32bit values", function() {
      var tmpVal = utils.intToHexArray(utils.xor32bit(0xFF00F0F0), 4);
      expect(tmpVal).to.be.eql([0, 255, 15, 15]);
      tmpVal = utils.intToHexArray(utils.xor32bit(0x00FF00FF), 4);
      expect(tmpVal).to.be.eql([255, 0, 255, 0]);
    });
  });
});
