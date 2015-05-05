"use strict";

module.exports = {
  0x01: {
    desc: "Power notifications",
    idCode: 0x01,
    DID: 0x00,
    CID: 0x21,
    eventName: "power",
    fields: [
    {
      field: "state",
      bytes: {
        from: 1,
        to: 1,
      },
      values: {
        0x01: "Battery Charging",
        0x02: "Battery OK",
        0x03: "Battery Low",
        0x04: "Battery Critical",
      }
    }
    ]
  },
  0x07: {
    desc: "Collision detected",
    idCode: 0x07,
    DID: 0x02,
    CID: 0x12,
    eventName: "collision",
    fields: [
      {
        name: "x",
        bytes: {
          from: 1,
          to: 2
        }
      },
      {
        field: "y",
        name: {
          from: 3,
          to: 4
        }
      },
      {
        field: "z",
        bytes: {
          from: 5,
          to: 6
        }
      },
      {
        field: "axis",
        bytes: {
          from: 7,
          to: 7
        }
      },
      {
        field: "xMagnitude",
        bytes: {
          from: 8,
          to: 9
        }
      },
      {
        field: "yMagnitude",
        bytes: {
          from: 10,
          to: 11
        }
      },
      {
        field: "speed",
        bytes: {
          from: 12,
          to: 12
        }
      },
      {
        field: "timestamp",
        bytes: {
          from: 13,
          to: 16
        }
      }
    ]
  }
};
