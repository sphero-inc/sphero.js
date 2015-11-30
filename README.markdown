# sphero.js

The official Orbotix JavaScript SDK module to programmatically control Sphero robots.

[![Build Status](https://travis-ci.org/orbotix/sphero.js.svg?branch=master)](https://travis-ci.org/orbotix/sphero.js) [![Code Climate](https://codeclimate.com/github/orbotix/sphero.js/badges/gpa.svg)](https://codeclimate.com/github/orbotix/sphero.js) [![Test Coverage](https://codeclimate.com/github/orbotix/sphero.js/badges/coverage.svg)](https://codeclimate.com/github/orbotix/sphero.js/coverage)

## Installation

    $ npm install sphero

## Connecting to Sphero

### OS X

To connect to your Sphero, you first need to pair it. To pair your device on OS X, open the Bluetooth settings in **System Preferences** > **Bluetooth**. From this menu, locate your Sphero in the Devices list and click the **Pair** button to pair it with your computer.

Once you've successfully paired your Sphero, open your terminal, go to your `/dev` folder and locate the serial device connection (or use `ls -a /dev | grep tty.Sphero`) for your newly paired Sphero; it should look something like `tty.Sphero-RGB-AMP-SPP`. Note, your device will likely be different depending on its preset color code (the three colors your Sphero cycles through when you first turn it on). The previous example is for a Sphero with a Red, Green and Blue (RGB) color code.

So, your Sphero port will be at

```
/dev/tty.Sphero-XXX-XXX-XXX
```

***

### Linux - Ubuntu

To make things easy install `Blueman Bluetooth Manager`. In Ubuntu this is pretty easy, just open the **Ubuntu Software Center**, type the program name and install it from there. When the installation is complete, open the program and search for devices. Make sure the Sphero is flashing its color code. Once the Sphero appears in the list of devices, select it, click on setup and follow the instructions.

You can connect and disconnect the Sphero from a serialport interface by right clicking on it inside the Blueman list of devices and selecting `RN-SPP` or `disconnect`, respectively (after it has been setup and added permanently to the list). Make sure to notice the serialport address Blueman displays after the Sphero connects, as this will be the one used in your code. The serialport address displayed for the Sphero should look something like this:

```
/dev/rfcomm0
```

***

### Windows

Locate the Bluetooth icon in the taskbar (or inside the system task tray button) and follow the necessary steps to pair with your Sphero.

Once you've successfully paired your Sphero, there are two options available to you to check and see which serialport corresponds to the Sphero you just connected. The first option is to right click on the bluetooth icon in the task bar (same you use to pair), click on `Open Settings`, when the settings window appears, navigate to the `COM Ports` tab where you should see a list of ports which should list your Sphero. If your Sphero is listed in more than one port, take note of the one that has `RN-SPP` in the name, and use that one to connect. The list should look something similar to:

Port      | Direction | Name
--------- | -------   | -------
COM3      | Outgoing  | Sphero-RPB 'RN-SPP'
COM4      | Incoming  | Sphero-RPB


In the above case, you should use serialport `COM3`.

The second option is to identify the port number. Click the `start` button and type `device manager`. Once the program appears in the list, open it. Navigate the tree of devices to `Ports`, there you should see a list of COM ports, i.e. `(COM3, COM4)`. From that port list, select the one that belongs to your Sphero. If your Sphero name is not listed in the ports list, you can either try them one by one or use the first method to identify which port belongs to your Sphero. The port address should look something like:

```
COM2, COM3, COM4
```

## Usage

To initialize and connect to a Sphero:

```javascript
var sphero = require("sphero"),
    orb = sphero("/dev/rfcomm0"); // change port accordingly

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

For more examples, check out the `examples` dir, or the JavaScript SDK documentation on the Sphero developer portal. When running these examples, don't forget to pass the port as an ENV variable like this:
```
PORT=/your/port node example.js
```

## Compatibility

The Sphero.js module is currently compatible with Node.js versions 0.10.x thru 5.x

In order to install it with Node.js 5.x+, you will need to have g++ v4.8 or higher.

## Development

Use `npm install` to install development dependencies. You will also need to install [Grunt](http://gruntjs.com) by running `npm install -g grunt-cli`

You can then run tests with `grunt test`.

Use `grunt lint` to run ESLint against both `lib` and `spec/lib`.

The `grunt` command by itself will run both of the above tasks.

## License

Copyright (c) 2015 Orbotix.
MIT Licensed.
For more details, see the `LICENSE` file.
