var async = require("async");
var Sphero = require("../");

var sphero = Sphero("/dev/rfcomm0");

sphero.connect(function() {
  sphero.detectCollisions();
  sphero.setBackLed(128);

  var times = 0;

  var interval = setInterval(function() {
    sphero.ping(function(err, packet) {
      if (err) { times++; } else { times = 0; }

      if (times > 3) {
        console.log('error');
        clearInterval(interval);
      }
    });
  }, 1000);

  async.series([
    function(callback) {
      sphero.on("collision", function() {
        async.series([
          function(callback) {
            function check() {
              return true;
            }

            async.whilst(check, function(callback) {
              async.series([
                function(callback) {
                  sphero.getColor(function(err, packet) {
                    var color = { red: 255, green: 255, blue: 255 };

                    if (packet && !err) {
                      color.red   = packet.red;
                      color.green = packet.green;
                      color.blue  = packet.blue;
                    }

                    function randomColor(cb) {
                      sphero.randomColor(function() { setTimeout(cb, 100); })
                    }

                    function restore() {
                      sphero.color(color);
                      callback();
                    }

                    async.series([
                      randomColor,
                      randomColor,
                      randomColor,
                      randomColor,
                      randomColor
                      ], restore);
                  });
                },

              function(cb) { setTimeout(cb, 500); }
            ], callback);
            }, callback);
          }
        ]);
      });

      callback();
    },

  ], function() {
    // done, or error occured
  });
});

