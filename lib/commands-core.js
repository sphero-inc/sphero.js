"use strict";

module.exports = {
  ping: 0x01,
  version: 0x02,
  controlUARTTx: 0x03,
  setBTName: 0x10,
  getBTName: 0x11,
  setAutoReconnect: 0x12,
  getAutoReconnect: 0x13,
  getPwrState: 0x20,
  setPwrNotify: 0x21,
  sleep: 0x22,
  getPowerTrips: 0x23,
  setPowerTrips: 0x24,
  setInactiveTimer: 0x25,
  gotoBl: 0x30,
  runL1Diags: 0x40,
  runL2Diags: 0x41,
  clearCounters: 0x42,
  assignTime: 0x50,
  pollTimers: 0x51
};
