"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var ble,
    isChrome = typeof chrome !== "undefined";

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (isChrome) {
    // browser BLE interface here...
  } else {
    ble = require("noble");
  }
} catch (error) {
  ble = null;
}

if (ble == null) {
  var err = [
    "It looks like noble didn't install properly.",
    "For more information, please go to:",
    "https://github.com/sandeepmistry/noble"
  ].join(" ");

  console.error(err);
  throw new Error("Missing noble dependency");
}

/**
 * An adaptor to communicate with a Bluetooth LE (aka 4.x) Interface
 *
 * @constructor
 * @param {String} peripheralId the BLE address to connect to
 * @param {Object} options optional parameters
 */
var Adaptor = module.exports = function Adaptor(peripheralId, options) {
  this.peripheralId = peripheralId;
  var opts = options || {};
  this.bleDevice = opts.connection;
  this.peripheral = null;
  this.connectedPeripherals = {};
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
  if (this.bleDevice != null) {
    // an existing BLE device connection was passed into adaptor
    callback();
  } else {
    // connect to device using noble
    ble.on('discover', function(peripheral) {
      if (peripheral.id === self.peripheralId) {
        ble.stopScanning();

        console.log('peripheral with ID ' + self.peripheralId + ' found');
        self.peripheral = peripheral;
        self.uuid = peripheral.id;

        var p = { peripheral: peripheral, services: {}, characteristics: {} };
        self.connectedPeripherals[self.uuid] = p;

        self.devModeOn(function() {
          self.notifyServiceCharacteristic(
            Adaptor.RobotControlService,
            Adaptor.ResponseCharacteristic,
            true,
            function(err, data) {
              self.emit("data", data);
            }
          );
          callback();
        });
      }
    });

    ble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        ble.startScanning();
      } else {
        ble.stopScanning();
      }
    });
  }
};

/**
 * Writes data to the BLE device on the RobotControlService/CommandsCharacteristic.
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
  this.on("data", callback);
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
      self.wake(function(err, data) {
        callback(err, data);
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
Adaptor.prototype.readServiceCharacteristic = function(serviceId, characteristicId, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) {
      return callback(err);
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
Adaptor.prototype.writeServiceCharacteristic = function(serviceId, characteristicId, value, callback) {
  var self = this;
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) { return callback(err); }

    c.write(new Buffer(value), self.writeNotify, function() {
      if (callback != null) callback(null);
    });
  });
};

/**
 * Changes a service characteristic's notification state on the BLE peripheral.
 *
 * Triggers the provided callback when data is written.
 *
 * @param {Number} serviceId ID of service to get details for
 * @param {Number} characteristicId ID of characteristic to get details for
 * @param {String} state notify state to write
 * @param {Function} callback function to be invoked when data is written
 * @return {void}
 * @publish
 */
Adaptor.prototype.notifyServiceCharacteristic = function(serviceId, characteristicId, state, callback) {
  this.getCharacteristic(serviceId, characteristicId, function(err, c) {
    if (err) { return callback(err); }
    c.on("data", function(data, isNotification) {
      callback(null, data, isNotification);
    });
    c.notify(state, function(error) {
      if (err) { return callback(error); }
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
Adaptor.prototype.getCharacteristic = function(serviceId, characteristicId, callback) {
  var self = this;

  this._connectBLE(function() {
    self._connectService(serviceId, function(err) {
      if (err) { callback(err, null); }
      self._connectCharacteristic(serviceId, characteristicId, function(error, c) {
        callback(error, c);
      });
    });
  });
};

Adaptor.prototype._connectBLE = function(callback) {
  var p = this._connectedPeripheral();
  p.connect(function() {
    callback();
  });
};

Adaptor.prototype._connectService = function(serviceId, callback) {
  var self = this;
  var p = this._connectedPeripheral();

  if (Object.keys(this._connectedServices()).length > 0) {
    callback(null, self._connectedService(serviceId));
  } else {
    p.discoverServices(null, function(serErr, services) {
      if (serErr) { return callback(serErr); }

      if (services.length > 0) {
        for (var s in services) {
          self._addConnectedService(services[s]);
        }

        var service = self._connectedService(serviceId);
        callback(null, service);
      } else {
        callback("No services found", null);
      }
    });
  }
};

Adaptor.prototype._connectCharacteristic = function(serviceId, characteristicId, callback) {
  var self = this;
  if (Object.keys(self._connectedCharacteristics(serviceId)).length > 0) {
    callback(null, self._connectedCharacteristic(serviceId, characteristicId));
  } else {
    var s = self._connectedService(serviceId);

    s.discoverCharacteristics(null, function(charErr, characteristics) {
      if (charErr) { return callback(charErr); }

      if (characteristics.length > 0) {
        for (var c in characteristics) {
          self._addConnectedCharacteristic(serviceId, characteristics[c]);
        }

        var characteristic = self._connectedCharacteristic(serviceId, characteristicId);
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
  return this.connectedPeripherals[this.uuid].services;
};

Adaptor.prototype._connectedService = function(serviceId) {
  return this._connectedServices()[serviceId].service;
};

Adaptor.prototype._addConnectedService = function(service) {
  this._connectedServices()[service.uuid] = {service: service, characteristics: {}};
};

// characteristics helpers
Adaptor.prototype._connectedCharacteristics = function(serviceId) {
  return this._connectedServices()[serviceId].characteristics;
};

Adaptor.prototype._addConnectedCharacteristic = function(serviceId, characteristic) {
  this._connectedCharacteristics(serviceId)[characteristic.uuid] = characteristic;
};

Adaptor.prototype._connectedCharacteristic = function(serviceId, characteristicId) {
  return this._connectedCharacteristics(serviceId)[characteristicId];
};
