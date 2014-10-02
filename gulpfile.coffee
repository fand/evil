gulp       = require 'gulp'
gutil      = require 'gulp-util'
coffee     = require 'gulp-coffee'
plumber    = require 'gulp-plumber'
changed    = require 'gulp-changed'
uglify     = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
browserify = require 'browserify'
watchify   = require 'watchify'
source     = require 'vinyl-source-stream'
spawn      = require('child_process').spawn

JS_PATH = 'build/js'
CLIENT_PATH = 'src/coffee/**/*.coffee'
SERVER_PATH = 'server/**/*'

nodemon = null
watching = false

gulp.task 'browserify-watch', ->
    watching = true
    gulp.start 'browserify'

gulp.task 'browserify', ->
    bundler = browserify
        entries: ['./src/coffee/main.coffee'],
        extensions: ['.coffee'],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true

    bundler = watchify(bundler) if watching

    bundler.transform 'coffeeify'

    rebundle = ->
        console.log '#####################regundle'
        bundler.bundle()
            .on 'error', -> gutil.log.bind(gutil, 'Browserify error')
            .pipe source 'evil.js'
            .pipe gulp.dest JS_PATH

    if watching?
        bundler.on 'update', rebundle
    rebundle()

gulp.task 'watch', ->
    gulp.start 'browserify-watch'
    gulp.watch SERVER_PATH, ['nodemon']

gulp.task 'coffee-update', ->
    nodemon.kill() if nodemon?
    gulp.src(CLIENT_PATH)
        .pipe changed(CLIENT_PATH)
        .pipe plumber()
        .pipe sourcemaps.init()
        .pipe coffee()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest(JS_PATH)

gulp.task 'coffee-dev', ->
    gulp.src(CLIENT_PATH)
        .pipe plumber()
        .pipe sourcemaps.init()
        .pipe coffee()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest(JS_PATH)

gulp.task 'coffee-pro', ->
    gulp.src(CLIENT_PATH)
        .pipe plumber()
        .pipe coffee()
        .pipe uglify()
        .pipe gulp.dest(JS_PATH)

gulp.task 'coffee', ['coffee-dev']


gulp.task 'nodemon', ->
    nodemon.kill() if nodemon?
    nodemon = spawn('./node_modules/.bin/nodemon',
                    ['./server.js'],
                    { env: process.env, stdio: 'inherit' })
        .on 'close', ->
            console.log 'nodemon: process killed!'

gulp.task 'nodemon-dev', ['coffee-update'], ->
    gulp.start 'nodemon'


gulp.task 'serve-dev', ['coffee'], ->
    process.env.NODE_ENV = 'development'
    gulp.start 'nodemon'
    gulp.watch CLIENT_PATH, ['coffee-update', 'nodemon-dev']

gulp.task 'serve-pro', ->
    process.env.NODE_ENV = 'production'
    gulp.start 'nodemon'


gulp.task 'default', ['coffee-dev', 'serve-dev']
