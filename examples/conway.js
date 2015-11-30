"use strict";

/* eslint key-spacing: 0, no-use-before-define: 0 */

var sphero = require("../");

var spheros = {
  Thelma : sphero(process.env.PORT),
  Louise : sphero("/dev/rfcomm1"),
  Grace  : sphero("/dev/rfcomm2"),
  Ada    : sphero("/dev/rfcomm3")
};

function main() {
  connect(spheros, function() {
    console.log("Spheros are connected, starting game.");
    for (var name in spheros) { start(name); }
  });
}

// connects all spheros, triggering callback when done
function connect(orbs, callback) {
  var total = Object.keys(orbs).length,
      finished = 0;

  function done() {
    finished++;
    if (finished >= total) { callback(); }
  }

  for (var name in orbs) {
    orbs[name].connect(done);
  }
}

// tells each Sphero what to do
function start(name) {
  var orb = spheros[name],
      contacts = 0,
      age = 0,
      alive = false;

  orb.detectCollisions();

  born();

  orb.on("collision", function() { contacts += 1; });

  setInterval(function() { if (alive) { move(); } }, 3000);
  setInterval(birthday, 10000);

  // roll Sphero in a random direction
  function move() {
    orb.roll(60, Math.floor(Math.random() * 360));
  }

  // stop Sphero
  function stop() {
    orb.stop();
  }

  // set Sphero's color
  function color(str) {
    orb.color(str);
  }

  function born() {
    contacts = 0;
    age = 0;
    life();
    move();
  }

  function life() {
    alive = true;
    color("green");
  }

  function death() {
    alive = false;
    color("red");
    stop();
  }

  function enoughContacts() {
    return contacts >= 2 && contacts < 7;
  }

  function birthday() {
    age += 1;

    if (alive) {
      console.log("Happy birthday,", name);
      console.log("You are", age, "and had", contacts, "contacts.");
    }

    if (enoughContacts()) {
      if (!alive) { born(); }
    } else {
      death();
    }
  }
}

main();
