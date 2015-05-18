"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: { target: ["index.js", "Gruntfile.js", "lib", "spec", "examples"] },

    simplemocha: {
      options: { reporter: "dot" },
      all: { src: ["spec/helper.js", "spec/lib/**/*.js"] }
    }
  });

  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-simple-mocha");

  grunt.registerTask("default", ["eslint", "simplemocha"]);
  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("test", ["simplemocha"]);
};
