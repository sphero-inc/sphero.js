var isChrome = typeof chrome !== "undefined";

/**
 * Loads an adaptor based on provided connection string and system state
 *
 * @param {String} conn
 * @return {Object}
 */
module.exports.load = function load(conn) {
  if (isChrome) {
    // use Chrome APIs/adaptors
    return;
  }

  // attempt to load adaptor, failing nicely if not present
};
