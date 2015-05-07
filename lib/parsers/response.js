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
};
