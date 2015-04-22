# sphero.js
Official sphero.js module to programatically control Sphero robots.

[![Build Status](https://magnum.travis-ci.com/orbotix/sphero.js.svg?token=3Xy74ztYRtNTqBW7yiEk&branch=master)](https://magnum.travis-ci.com/orbotix/sphero.js)
[![Code Climate](https://codeclimate.com/repos/5537d1b369568050720001bc/badges/92672cdeab0c72d10f72/gpa.svg)](https://codeclimate.com/repos/5537d1b369568050720001bc/feed)
[![Test Coverage](https://codeclimate.com/repos/5537d1b369568050720001bc/badges/92672cdeab0c72d10f72/coverage.svg)](https://codeclimate.com/repos/5537d1b369568050720001bc/feed)

## Installation

    npm install sphero

## Usage

```javascript
var sphero = require('sphero');

// ble
sphero.connect('12jb1di31o9b12jeb129uhd108fb').on('ready', function() {
  this.setColor('blue');
  this.move(100,100);
});

// serial
sphero.connect('/dev/ttyACM0').on('ready', function() {
  this.setColor('blue');
  this.move(100,100);
});

sphero.on('error', function(err) {
  console.log('there was a problem :(', err);
})
```

## Development

Use `npm install` to install development dependencies.

Run the tests with `make test`.

Use `make lint` to run ESLint against both `lib` and `spec/lib`.

Use `make` to run both.
