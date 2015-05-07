"use strict";

module.exports = {
  "0:2": {
    desc: "Get Version",
    did: 0x00,
    cid: 0x02,
    event: "version",
    fields: [
      {
        name: "recv",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "mdl",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "hw",
        type: "number",
        from: 2,
        to: 3
      },
      {
        name: "msaVer",
        type: "number",
        from: 3,
        to: 4
      },
      {
        name: "msaRev",
        type: "number",
        from: 4,
        to: 5
      },
      {
        name: "bl",
        type: "number",
        format: "hex",
        from: 5,
        to: 6
      },
      {
        name: "bas",
        type: "number",
        format: "hex",
        from: 6,
        to: 7
      },
      {
        name: "macro",
        type: "number",
        format: "hex",
        from: 7,
        to: 8
      },
      {
        name: "apiMaj",
        type: "number",
        from: 8,
        to: 9
      },
      {
        name: "apiMin",
        type: "number",
        from: 9,
        to: 10
      },
    ]
  },
  "0:11": {
    desc: "Get Bluetooth Info",
    did: 0x00,
    cid: 0x11,
    event: "bluetoothInfo",
    fields: [
      {
        name: "name",
        type: "string",
        format: "ascii",
        from: 0,
        to: 16
      },
      {
        name: "btAddress",
        type: "string",
        format: "ascii",
        from: 16,
        to: 28
      },
      {
        name: "separator",
        type: "number",
        from: 28,
        to: 29
      },
      {
        name: "colors",
        type: "number",
        format: "hex",
        from: 29,
        to: 32
      }
    ]
  },
  "0:13": {
    desc: "Get Auto-reconnect Info",
    did: 0x00,
    cid: 0x13,
    event: "autoReconnectInfo",
    fields: [
      {
        name: "flag",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "time",
        type: "number",
        from: 1,
        to: 2
      }
    ]
  },
  "0:20": {
    desc: "Get Power State Info",
    did: 0x00,
    cid: 0x20,
    event: "powerStateInfo",
    fields: [
      {
        name: "recVer",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "batteryState",
        type: "predefined",
        from: 1,
        to: 2,
        values: {
          0x01: "Battery Charging",
          0x02: "Battery OK",
          0x03: "Battery Low",
          0x04: "Battery Critical"
        }
      },
      {
        name: "batteryVoltage",
        type: "number",
        from: 2,
        to: 4
      },
      {
        name: "chargeCount",
        type: "number",
        from: 4,
        to: 6
      },
      {
        name: "secondsSinceCharge",
        type: "number",
        from: 6,
        to: 8
      }
    ]
  },
  "0:23": {
    desc: "Get Voltage Trip Points",
    did: 0x00,
    cid: 0x23,
    event: "voltageTripPoints",
    fields: [
      {
        name: "vLow",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "vCrit",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  "0:41": {
    desc: "Level 2 Diagnostics",
    did: 0x00,
    cid: 0x41,
    event: "level2Diagnostics",
    fields: [
      {
        name: "recVer",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "rxGood",
        type: "number",
        from: 3,
        to: 7
      },
      {
        name: "rxBadDID",
        type: "number",
        from: 7,
        to: 11
      },
      {
        name: "rxBadDlen",
        type: "number",
        from: 11,
        to: 15
      },
      {
        name: "rxBadCID",
        type: "number",
        from: 15,
        to: 19
      },
      {
        name: "rxBadCheck",
        type: "number",
        from: 19,
        to: 23
      },
      {
        name: "rxBufferOvr",
        type: "number",
        from: 23,
        to: 27
      },
      {
        name: "txMsg",
        type: "number",
        from: 27,
        to: 31
      },
      {
        name: "txBufferOvr",
        type: "number",
        from: 31,
        to: 35
      },
      {
        name: "lastBootReason",
        type: "number",
        from: 35,
        to: 36
      },
      {
        name: "bootCounters",
        type: "number",
        format: "hex",
        from: 36,
        to: 68
      },
      {
        name: "chargeCount",
        type: "number",
        from: 70,
        to: 72
      },
      {
        name: "secondsSinceCharge",
        type: "number",
        from: 72,
        to: 74
      },
      {
        name: "secondsOn",
        type: "number",
        from: 74,
        to: 78
      },
      {
        name: "distanceRolled",
        type: "number",
        from: 78,
        to: 82
      },
      {
        name: "sensorFailures",
        type: "number",
        from: 82,
        to: 84
      },
      {
        name: "gyroAdjustCount",
        type: "number",
        from: 84,
        to: 88
      }
    ]
  }
};
