"use strict";

var commands = lib("commands/sphero");

describe("Sphero Commands", function() {
  it("is an object", function() {
    expect(commands).to.be.an("object");
  });

  it("maps command names to numbers", function() {
    for (var key in commands) {
      var prop = commands[key];

      expect(key).to.be.a("string");
      expect(prop).to.be.a("number");
    }
  });
});
