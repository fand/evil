gulp       = require 'gulp'
gutil      = require 'gulp-util'
gulpif     = require 'gulp-if'
browserify = require 'browserify'
watchify   = require 'watchify'
source     = require 'vinyl-source-stream'
reload     = require('browser-sync').reload
config     = require('../config').browserify


##
# util
# ______________________________________

is_dev = true
watching = false

# Call cb after called num times.
counter = (num, callback) ->
    called = 0
    return ->
        called += 1
        callback() if called == num

# Bundle each config
cafe = (c, callback) ->
    bundler = browserify
        entries: c.src,
        extensions: ['.coffee'],
        debug: is_dev,
        cache: {}, packageCache: {}, fullPaths: true

    bundler = watchify(bundler) if watching
    bundler.transform 'coffeeify'

    rebundle = ->
        console.log '#### browserify: rebuild'
        bundler.bundle()
            .on 'error', -> gutil.log.bind(gutil, 'Browserify error')
            .pipe source c.name
            .pipe gulp.dest c.dst
            .pipe gulpif watching, reload stream: true

    if watching?
        bundler.on 'update', rebundle
    else
        rebundle()

    callback()


##
# Tasks
# ______________________________________

gulp.task 'browserify', (cb) ->
    is_dev = false if process.env.NODE_ENV == 'production'
    count = counter(config.length, cb)
    cafe(c, count) for c in config

gulp.task 'browserify-watch', ['browserSync'], ->
    watching = true
    gulp.start 'browserify'

gulp.task 'build', ['browserify']
