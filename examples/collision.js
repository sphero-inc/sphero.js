"use strict";

var async = require("async");
var spherojs = require("../");

var sphero = spherojs("/dev/rfcomm0");

sphero.connect(function() {
  sphero.detectCollisions();
  sphero.setBackLed(128);

  var times = 0;

  var interval = setInterval(function() {
    sphero.ping(function(err) {
      if (err) { times++; } else { times = 0; }

      if (times > 3) {
        console.log("error");
        clearInterval(interval);
      }
    });
  }, 1000);

  async.series([
    function(callback) {
      sphero.on("collision", function() {
        async.series([
          function(collisionCB) {
            function check() {
              return true;
            }

            function afterCb(cb, time) {
              return function(cb2) {
                setTimeout(cb2 || cb, time);
              };
            }

            function flash(flashCb) {
              sphero.getColor(function(err, packet) {
                var color = { red: 255, green: 255, blue: 255 };

                if (packet && !err) {
                  color.red = packet.red;
                  color.green = packet.green;
                  color.blue = packet.blue;
                }

                function randomColor(cb) {
                  sphero.randomColor(afterCb(cb, 100));
                }

                function restore() {
                  sphero.color(color);
                  flashCb();
                }

                async.series([
                  randomColor,
                  randomColor,
                  randomColor,
                  randomColor,
                  randomColor
                  ], restore);
              });
            }

            async.whilst(check, function() {
              async.series([
                flash,
                afterCb(null, 500)
              ], collisionCB);
            }, collisionCB);
          }
        ]);
      });
      callback();
    },

  ], function() {
    // done, or error occured
  });
});

