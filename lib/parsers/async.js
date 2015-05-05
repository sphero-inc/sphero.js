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
  }
};
