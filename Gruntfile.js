"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: { target: ["index.js", "Gruntfile.js", "lib", "spec", "examples"] },

    simplemocha: {
      options: { reporter: "dot" },
      all: { src: ["spec/helper.js", "spec/lib/**/*.js"] }
    },

    browserify: {
      build: {
        src: "index.js",
        dest: "dist/sphero.js",
      },

      options: {
        browserifyOptions: {
          standalone: "sphero"
        }
      }
    },

    uglify: {
      options: {
        banner: "/*! Sphero.js (c) 2015 Orbotix. MIT License */\n"
      },

      build: {
        src: "dist/sphero.js",
        dest: "dist/sphero.min.js"
      }
    },
  });

  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-browserify");

  grunt.registerTask("default", ["eslint", "simplemocha"]);
  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("test", ["simplemocha"]);

  grunt.registerTask("build-cleanup", function() {
    grunt.log.writeln("Deleting dist/sphero.js");
    grunt.file.delete("dist/sphero.js");
  });

  grunt.registerTask("build", ["browserify", "uglify", "build-cleanup"]);
};
