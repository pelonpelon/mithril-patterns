gulp = require "gulp"
stylus = require "gulp-stylus"
nib = require "nib"
sourcemaps = require "gulp-sourcemaps"
handleErrors = require "../util/handleErrors"
config = require "../../gulp-config"
gulp.task "styles", ->
  gulp.src config.styles
    .pipe sourcemaps.init()
    .pipe stylus(
      use: nib()
      compress: false
    )
    .pipe sourcemaps.write()
  .on("error", handleErrors)
  .pipe gulp.dest config.dest

