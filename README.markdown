# sphero.js

The official Orbotix JavaScript SDK module to programatically control Sphero robots.

[![Build Status](https://travis-ci.org/orbotix/sphero.js.svg?branch=master)](https://travis-ci.org/orbotix/sphero.js) [![Code Climate](https://codeclimate.com/github/orbotix/sphero.js/badges/gpa.svg)](https://codeclimate.com/github/orbotix/sphero.js) [![Test Coverage](https://codeclimate.com/github/orbotix/sphero.js/badges/coverage.svg)](https://codeclimate.com/github/orbotix/sphero.js/coverage)

## Installation

    $ npm install sphero

## Usage

To initialize and connect to a Sphero:

```javascript
var sphero = require("sphero"),
    orb = sphero("/dev/rfcomm0");

orb.connect(function() {
  // Sphero's connected!
  // do some cool stuff here!
});
```

Once connected, you can give Sphero commands:

```javascript
orb.connect(function() {
  // roll Sphero forward
  orb.roll(150, 0);

  // turn Sphero green
  orb.color("green");

  // have Sphero tell you when it detect collisions
  orb.detectCollisions();

  // when Sphero detects a collision, turn red for a second, then back to green
  orb.on("collision", function(data) {
    console.log("collision detected");
    console.log("  data:", data);

    orb.color("red");

    setTimeout(function() {
      orb.color("green");
    }, 1000);
  });
});
```

For more examples, check out the `examples` dir, or the JavaScript SDK documentation on the Sphero developer portal.

## Development

Use `npm install` to install development dependencies.

You can run tests with `grunt test`.

Using `grunt lint` to run ESLint against both `lib` and `spec/lib`.

The `grunt` command will run both of the above tasks.

## License

Copyright (c) 2015 Orbotix.
MIT Licensed.
For more details, see the `LICENSE` file.
