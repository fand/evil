gulp   = require 'gulp'
config = require('../config').watch

gulp.task 'watch', ->
    gulp.start 'browserify-watch'
    gulp.watch config.server, ['nodemon']
