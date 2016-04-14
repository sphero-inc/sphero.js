"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var ble;

function initBLE() {
  var isChrome = typeof chrome !== "undefined";

  // thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
  try {
    if (isChrome) {
      // browser BLE interface here...
      console.error("Browser-based BLE interface is not yet supported.");
    } else {
      ble = require("noble");
    }
  } catch (error) {
    ble = null;
  }

  if (ble == null) {
    var err = [
      "It looks like you want to connect to a Sphero BB-8 or Sphero Ollie,",
      "but did not install the 'noble' module.", "",
      "To install it run this command:",
      "npm install noble", "",
      "For more information go to https://github.com/sandeepmistry/noble"
    ].join("\n");

    console.error(err);
    throw new Error("Missing noble dependency");
  }
}

/**
 * An adaptor to communicate with a Bluetooth LE (aka 4.x) Interface
 *
 * @constructor
 * @param {String} peripheralId the BLE address to connect to
 * @param {Object} options optional parameters
 */
var Adaptor = module.exports = function Adaptor(peripheralId, options) {
  var uuid = peripheralId.split(":").join("").toLowerCase();
  this.uuid = uuid;
  var opts = options || {};
  this.noblePeripheral = opts.peripheral;
  if (this.noblePeripheral) {
    ble = this.noblePeripheral._noble;
  } else {
    initBLE();
  }
  this.peripheral = null;
  this.connectedPeripherals = {};
  this.isConnected = false;
  this.readHandler = function() {
    return;
  };
};

util.inherits(Adaptor, EventEmitter);

Adaptor.BLEService = "22bb746f2bb075542d6f726568705327";
Adaptor.WakeCharacteristic = "22bb746f2bbf75542d6f726568705327";
Adaptor.TXPowerCharacteristic = "22bb746f2bb275542d6f726568705327";
Adaptor.AntiDosCharacteristic = "22bb746f2bbd75542d6f726568705327";
Adaptor.RobotControlService = "22bb746f2ba075542d6f726568705327";
Adaptor.CommandsCharacteristic = "22bb746f2ba175542d6f726568705327";
Adaptor.ResponseCharacteristic = "22bb746f2ba675542d6f726568705327";

/**
 * Opens a connection to the BLE device.
 * Triggers the provided callback when ready.
 *
 * @param {Function} callback (err)
 * @return {void}
 */
Adaptor.prototype.open = function open(callback) {
  var self = this;
  if (this.noblePeripheral != null) {
    // an existing noble peripheral was passed into adaptor
    self._connectPeripheral(this.noblePeripheral, callback);
  } else {
    // connect to peripheral using noble
    ble.on("discover", function(peripheral) {
      if (peripheral.id === self.uuid) {
        ble.stopScanning();
        self._connectPeripheral(peripheral, callback);
      }
    });

    ble.on("stateChange", function(state) {
      if (state === "poweredOn") {
        ble.startScanning();
      } else {
        ble.stopScanning();
      }
    });
  }
};

/**
 * Writes data to the BLE device on the
 * RobotControlService/CommandsCharacteristic.
 * Triggers the provided callback when done.
 *
 * @param {Any} data info to be written to the device. turned into a buffer.
 * @param {Function} [callback] triggered when write is complete
 * @return {void}
 */
Adaptor.prototype.write = function write(data, callback) {
  this.writeServiceCharacteristic(
    Adaptor.RobotControlService,
    Adaptor.CommandsCharacteristic,
    new Buffer(data),
    callback
  );
};

/**
 * The provided callback will be triggered whenever the BLE device receives data
 * from the RobotControlService/ResponseCharacteristic "notify" event
 *
 * @param {Function} callback function to be invoked when data is read
 * @return {void}
 */
Adaptor.prototype.onRead = function onRead(callback) {
  this.readHandler = callback;
};

/**
 * Disconnects from the BLE device
 * The provided callback will be triggered after disconnecting
 *
 * @param {Function} callback function to be invoked when disconnected
 * @return {void}
 */
Adaptor.prototype.close = function close(callback) {
  callback();
};

/**
 * Enables developer mode on the Ollie/BB-8.
 *
 * This is accomplished via sending a special string to the Anti-DoS service,
 * setting TX power to 7, and telling the robot to wake up.
 *
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Adaptor.prototype.devModeOn = function(callback) {
  var self = this;

  self.setAntiDos(function() {
    self.setTXPower(7, function() {
      self.wake(function() {
        self.getCharacteristic(Adaptor.RobotControlService,
                               Adaptor.ResponseCharacteristic,
                               function(e, c) {
          if (e) { return callback(e); }
          c.on("read", function(data) {
            if (data && data.length > 5) {
              self.readHandler(data);
            }
          });
          c.notify(true, function() {
            callback();
          });
        });
      });
    });
  });
};

/**
 * Tells the Ollie/BB-8 to wake up
 *
 * @param {Function} callback function to be triggered when the robot is awake
 * @return {void}
 * @publish
 */
Adaptor.prototype.wake = function(callback) {
  this.writeServiceCharacteristic(
    Adaptor.BLEService,
    Adaptor.WakeCharacteristic,
    1,
    callback
  );
};

/**
 * Sets the BLE transmit power for the Ollie/BB-8.
 *
 * Uses more battery, but gives longer range
 *
 * @param {Number} level power to set
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Adaptor.prototype.setTXPower = function(level, callback) {
  this.writeServiceCharacteristic(
    Adaptor.BLEService,
    Adaptor.TXPowerCharacteristic,
    level,
    callback
  );
};

/**
 * Sends a special Anti-DoS string to the Ollie/BB-8.
 *
 * Used when enabling developer mode
 *
 * @param {Function} callback function to call when done
 * @return {void}
 */
Adaptor.prototype.setAntiDos = function(callback) {
  var str = "011i3";
  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  this.writeServiceCharacteristic(
    Adaptor.BLEService,
    Adaptor.AntiDosCharacteristic,
    bytes,
    callback
  );
};

/**
 * Reads a service characteristic from the BLE peripheral.
 *
 * Triggers the provided callback when data is retrieved.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {Function} callback function to be invoked with value
 * @return {void}
 * @publish
 */
Adaptor.prototype.readServiceCharacteristic = function(serviceId,
                                                       characteristicId,
                                                       callback) {
  this.getCharacteristic(serviceId, characteristicId, function(error, c) {
    if (error) {
      return callback(error);
    }

    c.read(callback);
  });
};

/**
 * Writes a service characteristic value to the BLE peripheral.
 *
 * Triggers the provided callback when data is written.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {Number} value value to write to the characteristic
 * @param {Function} callback function to be invoked when data is written
 * @return {void}
 * @publish
 */
Adaptor.prototype.writeServiceCharacteristic = function(serviceId,
                                                        characteristicId,
                                                        value,
                                                        callback) {
  this.getCharacteristic(serviceId, characteristicId, function(error, c) {
    if (error) { return callback(error); }

    c.write(new Buffer(value), true, function() {
      if (callback != null) { callback(null); }
    });
  });
};

/**
 * Finds a BLE service characteristic
 *
 * Triggers the provided callback when the characteristic is found
 *
 * @param {Number} serviceId ID of service to look for
 * @param {Number} characteristicId ID of characteristic to look for
 * @param {Function} callback function to be invoked with requested
 * characteristic
 * @return {void}
 * @publish
 */
Adaptor.prototype.getCharacteristic = function(serviceId,
                                               characteristicId,
                                               callback) {
  var self = this;
  this._connectBLE(function() {
    self._connectService(serviceId, function(error) {
      if (error) { callback(error, null); }
      self._connectCharacteristic(serviceId, characteristicId, function(e, c) {
        callback(e, c);
      });
    });
  });
};

Adaptor.prototype._connectPeripheral = function(np, callback) {
  this.peripheral = np;

  var p = { peripheral: np, services: {} };
  this.connectedPeripherals[this.uuid] = p;

  this.devModeOn(function() {
    callback();
  });
};

Adaptor.prototype._connectBLE = function(callback) {
  var p = this._connectedPeripheral();

  if (p.state === "connected") {
    callback();
  } else {
    var self = this;
    p.connect(function() {
      self.isConnected = true;
      callback();
    });
  }
};

Adaptor.prototype._connectService = function(serviceId, callback) {
  var self = this;
  var p = this._connectedPeripheral();
  if (this._connectedServices()) {
    callback(null, self._connectedService(serviceId));
  } else {
    p.discoverServices(null, function(serErr, services) {
      if (serErr) { return callback(serErr); }

      if (services.length > 0) {
        var service = self._connectedService(serviceId);
        callback(null, service);
      } else {
        callback("No services found", null);
      }
    });
  }
};

Adaptor.prototype._connectCharacteristic = function(serviceId,
                                                    characteristicId,
                                                    callback) {
  var self = this;
  if (self._connectedCharacteristics(serviceId)) {
    callback(null, self._connectedCharacteristic(serviceId, characteristicId));
  } else {
    var s = self._connectedService(serviceId);

    s.discoverCharacteristics(null, function(charErr, characteristics) {
      if (charErr) { return callback(charErr); }

      if (characteristics.length > 0) {
        var characteristic = self._connectedCharacteristic(serviceId,
                                                           characteristicId);
        callback(null, characteristic);
      } else {
        callback("No characteristics found", null);
      }
    });
  }
};

// peripherals helpers
Adaptor.prototype._connectedPeripheral = function() {
  return this.connectedPeripherals[this.uuid].peripheral;
};

// services helpers
Adaptor.prototype._connectedServices = function() {
  var p = this._connectedPeripheral();

  if (p.state !== "connected") {
    return null;
  }

  return p.services;
};

Adaptor.prototype._connectedService = function(serviceId) {
  var services = this._connectedServices();
  for (var s in services) {
    if (services[s].uuid === serviceId) {
      return services[s];
    }
  }
  return null;
};

// characteristics helpers
Adaptor.prototype._connectedCharacteristics = function(serviceId) {
  return this._connectedService(serviceId).characteristics;
};


Adaptor.prototype._connectedCharacteristic = function(serviceId, characteristicId) {
  var characteristics = this._connectedCharacteristics(serviceId);
  for (var c in characteristics) {
    if (characteristics[c].uuid === characteristicId) {
      return characteristics[c];
    }
  }
  return null;
};
