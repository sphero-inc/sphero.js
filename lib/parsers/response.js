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
  },
  "0:51": {
    desc: "Poll Packet Times",
    did: 0x00,
    cid: 0x51,
    event: "packetTimes",
    fields: [
      {
        name: "t1",
        type: "number",
        from: 0,
        to: 4
      },
      {
        name: "t2",
        type: "number",
        from: 4,
        to: 8
      },
      {
        name: "t3",
        type: "number",
        from: 8,
        to: 12
      }
    ]
  },
  "2:7": {
    desc: "Get Chassis Id",
    did: 0x02,
    cid: 0x07,
    event: "chassisId",
    fields: [
      {
        name: "chassisId",
        type: "number",
      }
    ]
  },
  "2:15": {
    desc: "Read Locator",
    did: 0x02,
    cid: 0x15,
    event: "readLocator",
    fields: [
      {
        name: "xpos",
        type: "signed",
        from: 0,
        to: 2
      },
      {
        name: "ypos",
        type: "signed",
        from: 2,
        to: 4
      },
      {
        name: "xvel",
        type: "number",
        from: 4,
        to: 6
      },
      {
        name: "yvel",
        type: "number",
        from: 6,
        to: 8
      },
      {
        name: "sog",
        type: "number",
        from: 8,
        to: 10
      }
    ]
  },
  "2:22": {
    desc: "Get RGB LED",
    did: 0x02,
    cid: 0x22,
    event: "rgbLedColor",
    fields: [
      {
        name: "color",
        type: "number",
        format: "hex",
        from: 0,
        to: 3
      },
      {
        name: "red",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "green",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "blue",
        type: "number",
        from: 2,
        to: 3
      }
    ]
  },
  "2:36": {
    desc: "Get Permanent Option Flags",
    did: 0x02,
    cid: 0x36,
    event: "permanentOptionFlags",
    fields: [
      {
        name: "sleepOnCharger",
        type: "predefined",
        mask: 0x01,
        values: {
          0x00: false,
          0x01: true
        }
      },
      {
        name: "vectorDrive",
        type: "predefined",
        mask: 0x02,
        values: {
          0x00: false,
          0x02: true
        }
      },
      {
        name: "selfLevelOnCharger",
        type: "predefined",
        mask: 0x04,
        values: {
          0x00: false,
          0x04: true
        }
      },
      {
        name: "tailLedAlwaysOn",
        type: "predefined",
        mask: 0x08,
        values: {
          0x00: false,
          0x08: true
        }
      },
      {
        name: "motionTimeouts",
        type: "predefined",
        mask: 0x10,
        values: {
          0x00: false,
          0x10: true
        }
      },
      {
        name: "retailDemoOn",
        type: "predefined",
        mask: 0x20,
        values: {
          0x00: false,
          0x20: true
        }
      },
      {
        name: "awakeSensitivityLight",
        type: "predefined",
        mask: 0x40,
        values: {
          0x00: false,
          0x40: true
        }
      },
      {
        name: "awakeSensitivityHeavy",
        type: "predefined",
        mask: 0x80,
        values: {
          0x00: false,
          0x80: true
        }
      },
      {
        name: "gyroMaxAsyncMsg",
        type: "predefined",
        mask: 0x100,
        values: {
          0x00: false,
          0x100: true
        }
      }
    ]
  },
  "2:38": {
    desc: "Get Temporal Option Flags",
    did: 0x02,
    cid: 0x38,
    event: "temporalOptionFlags",
    fields: [
      {
        name: "stopOnDisconnect",
        type: "predefined",
        mask: 0x01,
        values: {
          0x00: false,
          0x01: true
        }
      }
    ]
  },
  "2:44": {
    desc: "Get Device Mode",
    did: 0x02,
    cid: 0x44,
    event: "deviceMode",
    fields: [
      {
        name: "mode",
        type: "predefined",
        values: {
          0x00: "Normal",
          0x01: "User Hack"
        }
      }
    ]
  },
  "2:48": {
    desc: "Refill Bank",
    did: 0x02,
    cid: 0x48,
    event: "refillBank",
    fields: [
      {
        name: "coresRemaining",
        type: "number"
      }
    ]
  },
  "2:49": {
    desc: "Buy Consumable",
    did: 0x02,
    cid: 0x49,
    event: "buyConsumable",
    fields: [
      {
        name: "qtyRemaining",
        type: "number",
        from: 0,
        to: 1
      }, { name: "coresRemaining",
        type: "number",
        from: 1,
        to: 5
      }
    ]
  },
  "2:4A": {
    desc: "Use Consumable",
    did: 0x02,
    cid: 0x4A,
    event: "buyConsumable",
    fields: [
      {
        name: "id",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "qtyRemaining",
        type: "number",
        from: 1,
        to: 2
      }
    ]
  },
  "2:4B": {
    desc: "Grant Cores",
    did: 0x02,
    cid: 0x4B,
    event: "grantCores",
    fields: [
      {
        name: "coresRemaining",
        type: "number",
      }
    ]
  },
  "2:4C": {
    desc: "Add XP",
    did: 0x02,
    cid: 0x4C,
    event: "addXp",
    fields: [
      {
        name: "toNextLevel",
        type: "number",
      }
    ]
  },
  "2:4D": {
    desc: "Level up Attr",
    did: 0x02,
    cid: 0x4D,
    event: "levelUpAttr",
    fields: [
      {
        name: "attrId",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "attrLevel",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "attrPtsRemaining",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  "2:4E": {
    desc: "GET PWD SEED",
    did: 0x02,
    cid: 0x4E,
    event: "passwordSeed",
    fields: [
      {
        name: "seed",
        type: "number"
      }
    ]
  },
  "2:55": {
    desc: "Abort Macro",
    did: 0x02,
    cid: 0x55,
    event: "abortMacro",
    fields: [
      {
        name: "id",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "cmdNum",
        type: "number",
        from: 1,
        to: 3
      }
    ]
  },
  "2:56": {
    desc: "Get Macro Status",
    did: 0x02,
    cid: 0x55,
    event: "macroStatus",
    fields: [
      {
        name: "idCode",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "cmdNum",
        type: "number",
        from: 1,
        to: 3
      }
    ]
  }
};
