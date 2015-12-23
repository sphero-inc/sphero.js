"use strict";

var ble = require("noble");

var Adaptor = lib("adaptors/ble");

describe("BLE Adaptor", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor("cc360e85785e");
    stub(ble, "startScanning");
    stub(ble, "stopScanning");
  });

  afterEach(function() {
    ble.startScanning.restore();
    ble.stopScanning.restore();
  });

  it("is a class", function() {
    expect(Adaptor.constructor).to.be.a("function");
  });

  describe("#constructor", function() {
    it("sets @uuid", function() {
      expect(adaptor.uuid).to.be.eql("cc360e85785e");
    });
  });

  describe("#open", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor.open(callback);
    });

    it("doesn't automatically trigger the callback", function() {
      expect(callback).to.not.be.called;
    });

    context("when the ble interface emits 'discover'", function() {
      var desiredPeripheral = {
        id: "cc360e85785e",
        connect: spy()
      };
      var otherPeripheral = {
        id: "ff360e85785e",
        connect: spy()
      };

      context("if the peripheral was found", function() {
        beforeEach(function() {
          ble.emit("discover", desiredPeripheral);
        });

        it("triggers stopScanning", function() {
          expect(ble.stopScanning).to.be.called;
        });

        it("gets connected", function() {
          expect(desiredPeripheral.connect).to.be.called;
        });
      });

      context("if the peripheral was not found", function() {
        beforeEach(function() {
          ble.emit("discover", otherPeripheral);
        });

        it("does not trigger stopScanning", function() {
          expect(ble.stopScanning).to.not.be.called;
        });

        it("does not get connected", function() {
          expect(otherPeripheral.connect).to.not.be.called;
        });
      });
    });
  });

  describe("i/o", function() {
    it("#write calls @ble#writeServiceCharacteristic");
  });
});
