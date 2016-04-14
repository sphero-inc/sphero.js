# Sphero.js

The official Orbotix JavaScript SDK module to programmatically control Sphero robots.

[![Build Status](https://travis-ci.org/orbotix/sphero.js.svg?branch=master)](https://travis-ci.org/orbotix/sphero.js) [![Code Climate](https://codeclimate.com/github/orbotix/sphero.js/badges/gpa.svg)](https://codeclimate.com/github/orbotix/sphero.js) [![Test Coverage](https://codeclimate.com/github/orbotix/sphero.js/badges/coverage.svg)](https://codeclimate.com/github/orbotix/sphero.js/coverage)

## Usage

To initialize and connect to a BB-8 or an Ollie:

```javascript
var sphero = require("sphero"),
    bb8 = sphero("F3:F2:6D:55:71:09"); // change BLE address accordingly

bb8.connect(function() {
  // roll BB-8 in a random direction, changing direction every second
  setInterval(function() {
    var direction = Math.floor(Math.random() * 360);
    bb8.roll(150, direction);
  }, 1000);
});
```

To initialize and connect to a Sphero 1.0/2.0 or SPRK, just change the **port** to match your connection:

```javascript
var sphero = require("sphero"),
    orb = sphero("/dev/rfcomm0"); // change port accordingly

orb.connect(function() {
  // Sphero's connected!
  // do some cool stuff here!
});
```

Once connected, you can give your Sphero commands and receive notifications from the built-in sensors:

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
    }, 100);
  });
});
```

You can also use a Promises/A+ interface for your code, instead of the callback-based API:

```javascript
orb.connect().then(function() {
  return orb.roll(155, 0);
}).then(function() {
  return orb.color("green");
}).then(orb.detectCollisions);

orb.on("collision", function(data) {
  console.log("collision detected");
  console.log("  data:", data);

  orb.color("red")
    .delay(100)
    .then(function() {
      return orb.color("green");
    });
});
```

For more examples, check out the `examples` dir, or the JavaScript SDK documentation on the Sphero developer portal. When running these examples, don't forget to pass the port as an ENV variable like this:
```
PORT=/your/port node example.js
```

## Installation for BB-8 & Ollie

The BB-8 and Ollie use a Bluetooth Low Energy (LE) interface, also known as "Bluetooth Smart" or "Bluetooth 4.0/4.1". You must have a hardware adapter that supports the Bluetooth 4.x+ standard to connect your computer to your BB-8 or Ollie.

Run the following command:

    $ npm install sphero noble

To use Sphero.js with your BB-8 or Ollie, you must also install the Node.js noble module (https://github.com/sandeepmistry/noble) from [@sandeepmistry](https://github.com/sandeepmistry).

## Installation for Sphero 1.0/2.0 & SPRK

The Sphero 1.0/2.0 and the SPRK use a Bluetooth Classic interface, also known as "Bluetooth 2.0/3.0".

Run the following command:

    $ npm install sphero serialport

To use Sphero.js with your Sphero or SPRK, you must also install the Node.js serialport module (https://github.com/voodootikigod/node-serialport) from [@voodootikigod](https://github.com/voodootikigod).

## Connecting to BB-8/Ollie

### OS X

To connect to your BB-8 or Ollie, you first need to determine its UUID. Once you have Noble installed, you can use the `advertisement-discovery.js` program to determine the device's UUID:

```
$ node ./node_modules/noble/examples/advertisement-discovery.js
peripheral discovered (944f561f8cf441f3b5405ed48f5c63cf with address <unknown, unknown>, connectable true, RSSI -73:
    hello my local name is:
        BB-131D
    can I interest you in any of the following advertised services:
        []
    here is my manufacturer data:
        "3330"
    my TX power level is:
        -18
```

In the above output, the device UUID is `944f561f8cf441f3b5405ed48f5c63cf`. Use this value to connect to your BB-8 or Ollie.

### Linux - Ubuntu

To connect to your BB-8 or Ollie, you first need to determine the MAC address. Once you have Noble installed, you can use the `advertisement-discovery.js` program to determine the device address:

```
$ node ./node_modules/noble/examples/advertisement-discovery.js
peripheral discovered (f3f26d557108 with address <f3:f2:6d:55:71:08, random>, connectable true, RSSI -37:
    hello my local name is:
            BB-7108
    can I interest you in any of the following advertised services:
            ["22bb746f2ba075542d6f726568705327"]
    here is my manufacturer data:
            "3330"
    my TX power level is:
            6
```

In the above output, the device address is `f3f26d557108` (or alternately `f3:f2:6d:55:71:08`). Use this value to connect to your BB-8 or Ollie.

### Windows

To connect to your BB-8 or Ollie, you will need to be running Windows 8.1+. Instructions coming soon...

## Connecting to Sphero/SPRK

### OS X

To connect to your Sphero 1.0/2.0 or SPRK, you first need to pair it. To pair your device on OS X, open the Bluetooth settings in **System Preferences** > **Bluetooth**. From this menu, locate your Sphero in the Devices list and click the **Pair** button to pair it with your computer.

Once you've successfully paired your Sphero, open your terminal, go to your `/dev` folder and locate the serial device connection (or use `ls -a /dev | grep tty.Sphero`) for your newly paired Sphero; it should look something like `tty.Sphero-RGB-AMP-SPP`. Note, your device will likely be different depending on its preset color code (the three colors your Sphero cycles through when you first turn it on). The previous example is for a Sphero with a Red, Green and Blue (RGB) color code.

So, your Sphero port will be at

```
/dev/tty.Sphero-XXX-XXX-XXX
```

***

### Linux - Ubuntu

To connect to your Sphero 1.0/2.0 or SPRK, you first need to pair it. To make things easy install `Blueman Bluetooth Manager`. In Ubuntu this is pretty easy, just open the **Ubuntu Software Center**, type the program name and install it from there. When the installation is complete, open the program and search for devices. Make sure the Sphero is flashing its color code. Once the Sphero appears in the list of devices, select it, click on setup and follow the instructions.

You can connect and disconnect the Sphero from a serialport interface by right clicking on it inside the Blueman list of devices and selecting `RN-SPP` or `disconnect`, respectively (after it has been setup and added permanently to the list). Make sure to notice the serialport address Blueman displays after the Sphero connects, as this will be the one used in your code. The serialport address displayed for the Sphero should look something like this:

```
/dev/rfcomm0
```

You might need to add a udev rule in order to properly set permissions for your program to be able to access the Bluetooth interface. For example:

```
$ cat /etc/udev/rules.d/55-rfcomm.rules
KERNEL=="rfcomm[0-9]*", NAME="%k", GROUP="dialout"
```

The udev rule above will allow any user who is a member of the `dialout` group to access any port that is added by connecting by running the `rfcomm` command. Note that running the `rfcomm` command itself to create the port, may require running under `sudo`.

If you are receiving an error such as "Cannot open /dev/rfcomm0", then try running your program using "sudo".

***

### Windows

To connect to your Sphero 1.0/2.0 or SPRK, you first need to pair it. Locate the Bluetooth icon in the taskbar (or inside the system task tray button) and follow the necessary steps to pair with your Sphero.

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
## Error handling

Under most circumstances, Sphero.js will attempt to gracefully recover from any bad or incomplete packets that might be received back from the connected wireless device. If you wish to handle these errors yourself, you must set the `emitPacketErrors` option to true, as shown by this example:

```
var sphero = require("sphero"),
    orb = sphero("/dev/rfcomm0", {emitPacketErrors: true});

orb.connect(function() {
  // Sphero's connected!
  // do some cool stuff here!
  orb.on("error", function(err, data) {
    // Do something with the err or just ignore.
  });
});
```

## Compatibility

The Sphero.js module is currently compatible with Node.js versions 0.10.x thru 5.x

In order to install it with Node.js 5.x+, you will need to have g++ v4.8 or higher.

## Development

Use `npm install` to install development dependencies, as well as both `noble` and `serialport` (`npm install noble serialport`). You will also need to install [Grunt](http://gruntjs.com) by running `npm install -g grunt-cli`

You can then run tests with `grunt test`.

Use `grunt lint` to run ESLint against both `lib` and `spec/lib`.

The `grunt` command by itself will run both of the above tasks.

## License

Copyright (c) 2015-2016 Orbotix.
MIT Licensed.
For more details, see the `LICENSE` file.
