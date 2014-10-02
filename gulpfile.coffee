gulp        = require 'gulp'
gutil       = require 'gulp-util'
gulpif      = require 'gulp-if'
coffee      = require 'gulp-coffee'
plumber     = require 'gulp-plumber'
changed     = require 'gulp-changed'
uglify      = require 'gulp-uglify'
sourcemaps  = require 'gulp-sourcemaps'
browserify  = require 'browserify'
watchify    = require 'watchify'
source      = require 'vinyl-source-stream'
spawn       = require('child_process').spawn
browserSync = require 'browser-sync'
reload      = browserSync.reload


JS_PATH = 'build/js'
CLIENT_PATH = 'src/coffee/**/*.coffee'
SERVER_PATH = 'server/**/*'

is_dev = true
nodemon = null
watching = false

gulp.task 'browserSync', ->
    browserSync proxy: 'localhost:9000'

gulp.task 'browserify-watch', ['browserSync'], ->
    watching = true
    gulp.start 'browserify'

gulp.task 'browserify', ->
    bundler = browserify
        entries: ['./src/coffee/main.coffee'],
        extensions: ['.coffee'],
        debug: is_dev,
        cache: {}, packageCache: {}, fullPaths: true

    bundler = watchify(bundler) if watching
    bundler.transform 'coffeeify'

    rebundle = ->
        console.log '#### browserify: rebuild'
        bundler.bundle()
            .on 'error', -> gutil.log.bind(gutil, 'Browserify error')
            .pipe source 'evil.js'
            .pipe gulp.dest JS_PATH
            .pipe gulpif watching, reload stream: true

    if watching?
        bundler.on 'update', rebundle
    else
        rebundle()

gulp.task 'watch', ->
    gulp.start 'browserify-watch'
    gulp.watch SERVER_PATH, ['nodemon']

gulp.task 'nodemon', ->
    nodemon.kill() if nodemon?
    nodemon = spawn('./node_modules/.bin/nodemon',
                    ['./server.js'],
                    { env: process.env, stdio: 'inherit' })
        .on 'close', ->
            console.log 'nodemon: process killed!'

gulp.task 'build', ['browserify']

gulp.task 'dev', ->
    process.env.NODE_ENV = 'development'
    gulp.start ['build', 'watch', 'nodemon']

gulp.task 'pro', ->
    is_dev = false
    process.env.NODE_ENV = 'production'
    gulp.start ['build', 'nodemon']

gulp.task 'default', ['dev']
