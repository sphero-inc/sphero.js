"use strict";

var Mocha = require("mocha"),
    uglify = require("uglify-js"),
    ESLint = require("eslint").CLIEngine,
    browserify = require("browserify");

module.exports = function(grunt) {
  grunt.registerTask("default", ["lint", "test"]);

  grunt.registerTask("lint", "Lints code with ESLint", function() {
    var lint = new ESLint(),
        files = ["index.js", "Gruntfile.js", "lib", "spec", "examples"],
        formatter = lint.getFormatter();

    var report = lint.executeOnFiles(files),
        results = report.results;

    grunt.log.write(formatter(results));

    return report.errorCount === 0;
  });

  grunt.registerTask("test", "Runs specs with Mocha", function() {
    var mocha = new Mocha({ reporter: "dot" }),
        files = grunt.file.expand("spec/helper.js", "spec/lib/**/*.js"),
        done = this.async();

    files.forEach(mocha.addFile.bind(mocha));

    mocha.run(function(errs) {
      done(errs === 0);
    });
  });

  grunt.registerTask("dist", "Builds UMD distributable", function() {
    var b = browserify("index.js", { standalone: "sphero" }),
        banner = "/*! Sphero.js (c) 2015 Orbotix. MIT License */\n",
        done = this.async();

    b.bundle(function(err, buffer) {
      if (err) {
        console.error(err);
        done(false);
      }

      var result = uglify.minify(buffer.toString(), { fromString: true });
      grunt.file.write("dist/sphero.min.js", banner + result.code);
      done(true);
    });
  });
};
