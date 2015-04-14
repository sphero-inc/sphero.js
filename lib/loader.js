function isChrome() {
  return typeof chrome !== "undefined";
}

function isSerialPort(str) {
  // use regexp to determine whether or not 'str' is a serial port
  return /\/dev\/.*/.test(str);
}

/**
 * Loads an adaptor based on provided connection string and system state
 *
 * @param {String} conn
 * @return {Object}
 */
module.exports.load = function load(conn) {
  if (isChrome()) {
    // use Chrome APIs/adaptors

    if (isSerialPort(conn)) {
      // Bluetooth
    } else {
      // BLE
    }

    return;
  }

  // attempt to load adaptor, failing nicely if not present
  if (isSerialPort(conn)) {
    // Bluetooth
  } else {
    // BLE
  }
};
