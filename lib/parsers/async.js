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
  0x03: {
    desc: "Sensor Data Streaming",
    idCode: 0x03,
    did: 0x02,
    cid: 0x11,
    event: "dataStreaming",
    fields: [
      {
        name: "xAccelRaw",
        type: "bitmask",
        bitmask: 0x80000000,
        maskField: "mask1",
        sensor: "accelerometer axis X, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mg"
      },
      {
        name: "yAccelRaw",
        type: "bitmask",
        bitmask: 0x40000000,
        maskField: "mask1",
        sensor: "accelerometer axis Y, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mG"
      },
      {
        name: "zAccelRaw",
        type: "bitmask",
        bitmask: 0x20000000,
        maskField: "mask1",
        sensor: "accelerometer axis Z, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mG"
      },
      {
        name: "xGyroRaw",
        type: "bitmask",
        bitmask: 0x10000000,
        maskField: "mask1",
        sensor: "gyroscope axis X, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "yGyroRaw",
        type: "bitmask",
        bitmask: 0x08000000,
        maskField: "mask1",
        sensor: "gyroscope axis Y, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "zGyroRaw",
        type: "bitmask",
        bitmask: 0x04000000,
        maskField: "mask1",
        sensor: "gyroscope axis Z, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "rMotorBackEmfRaw",
        type: "bitmask",
        bitmask: 0x00400000,
        maskField: "mask1",
        sensor: "right motor back EMF, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5cm"
      },
      {
        name: "lMotorBackEmfRaw",
        type: "bitmask",
        bitmask: 0x00200000,
        maskField: "mask1",
        sensor: "left motor back EMF, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5cm"
      },
      {
        name: "lMotorPWMRaw",
        type: "bitmask",
        bitmask: 0x00100000,
        maskField: "mask1",
        sensor: "left motor PWM, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "dutyCycle"
      },
      {
        name: "rMotorPWMRaw",
        type: "bitmask",
        bitmask: 0x00080000,
        maskField: "mask1",
        sensor: "right motor PWM, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "dutyCycle"
      },
      {
        name: "pitchAngle",
        type: "bitmask",
        bitmask: 0x00040000,
        maskField: "mask1",
        sensor: "IMU pitch angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "rollAngle",
        type: "bitmask",
        bitmask: 0x00020000,
        maskField: "mask1",
        sensor: "IMU roll angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "yawAngle",
        type: "bitmask",
        bitmask: 0x00010000,
        maskField: "mask1",
        sensor: "IMU yaw angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "xAccel",
        type: "bitmask",
        bitmask: 0x00008000,
        maskField: "mask1",
        sensor: "accelerometer axis X, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "yAccel",
        type: "bitmask",
        bitmask: 0x00004000,
        maskField: "mask1",
        sensor: "accelerometer axis Y, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "zAccel",
        type: "bitmask",
        bitmask: 0x00002000,
        maskField: "mask1",
        sensor: "accelerometer axis Z, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "xGyro",
        type: "bitmask",
        bitmask: 0x00001000,
        maskField: "mask1",
        sensor: "gyro axis X, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "yGyro",
        type: "bitmask",
        bitmask: 0x00000800,
        maskField: "mask1",
        sensor: "gyro axis Y, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "zGyro",
        type: "bitmask",
        bitmask: 0x00000400,
        maskField: "mask1",
        sensor: "gyro axis Z, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "rMotorBackEmf",
        type: "bitmask",
        bitmask: 0x00000040,
        maskField: "mask1",
        sensor: "right motor back EMF, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5 cm"
      },
      {
        name: "lMotorBackEmf",
        type: "bitmask",
        bitmask: 0x00000020,
        maskField: "mask1",
        sensor: "left motor back EMF, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5 cm"
      },
      {
        name: "quaternionQ0",
        type: "bitmask",
        bitmask: 0x80000000,
        maskField: "mask2",
        sensor: "quaternion Q0",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ1",
        type: "bitmask",
        bitmask: 0x40000000,
        maskField: "mask2",
        sensor: "quaternion Q1",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ2",
        type: "bitmask",
        bitmask: 0x20000000,
        maskField: "mask2",
        sensor: "quaternion Q2",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ3",
        type: "bitmask",
        bitmask: 0x10000000,
        maskField: "mask2",
        sensor: "quaternion Q3",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "xOdometer",
        type: "bitmask",
        bitmask: 0x08000000,
        maskField: "mask2",
        sensor: "odomoter X",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "cm"
      },
      {
        name: "yOdometer",
        type: "bitmask",
        bitmask: 0x04000000,
        maskField: "mask2",
        sensor: "odomoter Y",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "cm"
      },
      {
        name: "accelOne",
        type: "bitmask",
        bitmask: 0x02000000,
        maskField: "mask2",
        sensor: "acceleration one",
        range: {
          bottom: 0,
          top: 8000
        },
        units: "1mG"
      },
      {
        name: "xVelocity",
        type: "bitmask",
        bitmask: 0x01000000,
        maskField: "mask2",
        sensor: "velocity X",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "mm/s"
      },
      {
        name: "yVelocity",
        type: "bitmask",
        bitmask: 0x00800000,
        maskField: "mask2",
        sensor: "velocity Y",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "mm/s"
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
        mask: 0x0C,
        values: {
          0x00: "none",
          0x04: "positive",
          0x08: "negative"
        }
      },
      {
        name: "z",
        type: "predefined",
        mask: 0x30,
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
