gulp        = require 'gulp'
rsync       = require('rsyncwrapper').rsync
config      = require('../../gulp-config').rsync
gutil       = require('gulp-util')

gulp.task 'rsync', ->
  rsync
    ssh: true
    src: config.src
    dest: config.dest
    recursive: true
    syncDest: true
    args: ['--verbose']
  , (error, stdout, stderr, cmd)->
      gutil.log stdout
