"use strict";

var mutator = lib("devices/custom");

describe("Custom Device Functions", function() {
  var device = {};

  beforeEach(function() {
    mutator(device);
  });

  describe("#color", function() {
    var rgb;

    beforeEach(function() {
      rgb = device.setRGBLed = spy();
    });

    it("proxies callbacks", function() {
      var color = { red: 255, green: 0, blue: 0 },
          callback = spy();

      device.color(color, callback);
      expect(rgb).to.be.calledWith(color, callback);
    });

    context("with a hex string", function() {
      it("converts to an RGB object", function() {
        device.color("#FF0000");
        var color = { red: 255, blue: 0, green: 0 };
        expect(rgb).to.be.calledWith(color);
      });
    });

    context("with a color name", function() {
      it("converts to an RGB object", function() {
        device.color("azure");
        var color = { red: 240, blue: 255, green: 255 };
        expect(rgb).to.be.calledWith(color);
      });
    });

    context("with a hex number", function() {
      it("converts to an RGB object", function() {
        device.color(0x00FF00);
        var color = { red: 0, blue: 0, green: 255 };
        expect(rgb).to.be.calledWith(color);
      });
    });

    context("with a RGB object", function() {
      it("passes it along", function() {
        var color = { red: 250, blue: 10, green: 125 };
        device.color(color);
        expect(rgb).to.be.calledWith(color);
      });

      it("converts shorthand values", function() {
        var color = { r: 250, g: 10, b: 125 };
        device.color(color);
        expect(rgb).to.be.calledWithMatch({ red: 250, green: 10, blue: 125 });
      });
    });
  });

  describe("#detectCollisions", function() {
    beforeEach(function() {
      device.configureCollisions = spy();
      device.on = stub();
      device.emit = stub();

      device.detectCollisions();
    });

    it("configures collision detection for Sphero", function() {
      expect(device.configureCollisions).to.be.calledWith({
        meth: 0x01,
        xt: 0x40,
        yt: 0x40,
        xs: 0x50,
        ys: 0x50,
        dead: 0x50
      });
    });
  });
});