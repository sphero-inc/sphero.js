"use strict";

module.exports = {
  0x01: {
    desc: "Power notifications",
    idCode: 0x01,
    DID: 0x00,
    CID: 0x21,
    event: "power",
    fields: [
      {
        field: "state",
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
    DID: 0x00,
    CID: 0x40,
    event: "level1Diagnostic",
    fields: [
      {
        field: "diagnostic",
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
    DID: 0x02,
    CID: 0x40,
    event: "configBlock",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x05: {
    desc: "Pre-sleep Warning",
    idCode: 0x05,
    DID: null,
    CID: null,
    event: "preSleepWarning",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x06: {
    desc: "Macro Markers",
    idCode: 0x06,
    DID: null,
    CID: null,
    event: "macroMarkers",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x07: {
    desc: "Collision detected",
    idCode: 0x07,
    DID: 0x02,
    CID: 0x12,
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
    DID: null,
    CID: null,
    event: "obPrint",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x09: {
    desc: "Orb-basic ASCII Error Message",
    idCode: 0x09,
    DID: null,
    CID: null,
    event: "obAsciiError",
    fields: [
      {
        field: "content",
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
    DID: null,
    CID: null,
    event: "obBinaryError",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x0B: {
    desc: "Self Level",
    idCode: 0x0B,
    DID: 0x02,
    CID: 0x09,
    event: "selfLevel",
    fields: [
      {
        field: "result",
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
    DID: null,
    CID: null,
    event: "gyroAxisExceeded",
    fields: [
      {
        field: "x",
        type: "predefined",
        mask: 0x03,
        values: {
          0x00: "none",
          0x01: "positive",
          0x02: "negative"
        }
      },
      {
        field: "y",
        type: "predefined",
        mask: "0x0C",
        values: {
          0x00: "none",
          0x04: "positive",
          0x08: "negative"
        }
      },
      {
        field: "z",
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
    DID: 0x02,
    CID: 0x43,
    event: "spheroSoulData",
    fields: [
      {
        field: "content",
        type: "raw",
      }
    ]
  },
  0x0E: {
    desc: "Level Up",
    idCode: 0x0E,
    DID: null,
    CID: null,
    event: "levelUp",
    fields: [
      {
        field: "robotLevel",
        type: "number",
        from: 0,
        to: 2
      },
      {
        field: "attributePoints",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  0x0F: {
    desc: "Shield Damage",
    idCode: 0x0F,
    DID: null,
    CID: null,
    event: "shieldDamage",
    fields: [
      {
        field: "robotLevel",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x10: {
    desc: "XP % towards next robot level (0 = 0%, 255 = 100%)",
    idCode: 0x10,
    DID: null,
    CID: null,
    event: "xpUpdate",
    fields: [
      {
        field: "cp",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x11: {
    desc: "Boost power left (0 = 0%, 255 = 100%)",
    idCode: 0x11,
    DID: null,
    CID: null,
    event: "boostUpdate",
    fields: [
      {
        field: "boost",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  }
};
