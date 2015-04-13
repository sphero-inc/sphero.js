# sphero.js

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

Use `make lint` to run JSHint against both `lib` and `spec/lib`.

Use `make` to run both.
