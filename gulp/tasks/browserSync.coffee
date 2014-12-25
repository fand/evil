gulp        = require 'gulp'
browserSync = require 'browser-sync'

gulp.task 'browserSync', ->
    browserSync proxy: 'localhost:9000'
