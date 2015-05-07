"use strict";

module.exports = {
  0x01: {
    desc: "Battery Power State",
    idCode: 0x01,
    did: 0x00,
    cid: 0x21,
    event: "battery",
    fields: [
      {
        name: "state",
        type: "predefined",
        values: {
          0x01: "Battery Charging",
          0x02: "Battery OK",
          0x03: "Battery Low",
          0x04: "Battery Critical"
        }
      }
    ]
  },
  0x02: {
    desc: "Level 1 Diagnostic Response",
    idCode: 0x02,
    did: 0x00,
    cid: 0x40,
    event: "level1Diagnostic",
    fields: [
      {
        name: "diagnostic",
        type: "string",
        format: "ascii",
        from: 0,
        to: undefined
      }
    ]
  },
  0x04: {
    desc: "Config Block Contents",
    idCode: 0x04,
    did: 0x02,
    cid: 0x40,
    event: "configBlock",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x05: {
    desc: "Pre-sleep Warning",
    idCode: 0x05,
    did: null,
    cid: null,
    event: "preSleepWarning",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x06: {
    desc: "Macro Markers",
    idCode: 0x06,
    did: null,
    cid: null,
    event: "macroMarkers",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x07: {
    desc: "Collision detected",
    idCode: 0x07,
    did: 0x02,
    cid: 0x12,
    event: "collision",
    fields: [
      {
        name: "x",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "y",
        type: "number",
        from: 2,
        to: 4
      },
      {
        name: "z",
        type: "number",
        from: 4,
        to: 6
      },
      {
        name: "axis",
        type: "number",
        from: 6,
        to: 7
      },
      {
        name: "xMagnitude",
        type: "number",
        from: 7,
        to: 9
      },
      {
        name: "yMagnitude",
        type: "number",
        from: 9,
        to: 11
      },
      {
        name: "speed",
        type: "number",
        from: 11,
        to: 12
      },
      {
        name: "timestamp",
        type: "number",
        from: 12,
        to: 16
      }
    ]
  },
  0x08: {
    desc: "Orb-basic Print Message",
    idCode: 0x08,
    did: null,
    cid: null,
    event: "obPrint",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x09: {
    desc: "Orb-basic ASCII Error Message",
    idCode: 0x09,
    did: null,
    cid: null,
    event: "obAsciiError",
    fields: [
      {
        name: "content",
        type: "string",
        format: "ascii",
        from: 0,
        to: undefined
      }
    ]
  },
  0x0A: {
    desc: "Orb-basic Binary Error Message",
    idCode: 0x0A,
    did: null,
    cid: null,
    event: "obBinaryError",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x0B: {
    desc: "Self Level",
    idCode: 0x0B,
    did: 0x02,
    cid: 0x09,
    event: "selfLevel",
    fields: [
      {
        name: "result",
        type: "predefined",
        values: {
          0x00: "Unknown",
          0x01: "Timed Out (level was not achived)",
          0x02: "Sensors Error",
          0x03: "Self Level Disabled (see Option flags)",
          0x04: "Aborted (by API call)",
          0x05: "Charger Not Found",
          0x06: "Success"
        }
      }
    ]
  },
  0x0C: {
    desc: "Gyro Axis Limit Exceeded",
    idCode: 0x0C,
    did: null,
    cid: null,
    event: "gyroAxisExceeded",
    fields: [
      {
        name: "x",
        type: "predefined",
        mask: 0x03,
        values: {
          0x00: "none",
          0x01: "positive",
          0x02: "negative"
        }
      },
      {
        name: "y",
        type: "predefined",
        mask: "0x0C",
        values: {
          0x00: "none",
          0x04: "positive",
          0x08: "negative"
        }
      },
      {
        name: "z",
        type: "predefined",
        mask: "0x30",
        values: {
          0x00: "none",
          0x10: "positive",
          0x20: "negative"
        }
      }
    ]
  },
  0x0D: {
    desc: "Sphero's Soul Data",
    idCode: 0x0D,
    did: 0x02,
    cid: 0x43,
    event: "spheroSoulData",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x0E: {
    desc: "Level Up",
    idCode: 0x0E,
    did: null,
    cid: null,
    event: "levelUp",
    fields: [
      {
        name: "robotLevel",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "attributePoints",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  0x0F: {
    desc: "Shield Damage",
    idCode: 0x0F,
    did: null,
    cid: null,
    event: "shieldDamage",
    fields: [
      {
        name: "robotLevel",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x10: {
    desc: "XP % towards next robot level (0 = 0%, 255 = 100%)",
    idCode: 0x10,
    did: null,
    cid: null,
    event: "xpUpdate",
    fields: [
      {
        name: "cp",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x11: {
    desc: "Boost power left (0 = 0%, 255 = 100%)",
    idCode: 0x11,
    did: null,
    cid: null,
    event: "boostUpdate",
    fields: [
      {
        name: "boost",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  }
};