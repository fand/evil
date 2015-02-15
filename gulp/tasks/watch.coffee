gulp   = require 'gulp'
config = require('../config').watch

gulp.task 'watch', ['browserSync'], ->
    gulp.watch config.server, ['nodemon']
    gulp.watch config.coffee, ['browserify-watch']
    gulp.watch config.client, ['browserify-watch']
    gulp.watch config.sass,   ['sass-watch']
