gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
plumber    = require 'gulp-plumber'
changed    = require 'gulp-changed'
uglify     = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
spawn      = require('child_process').spawn

JS_PATH = 'build/js'
COFFEE_PATH = 'src/coffee/**/*.coffee'

nodemon = null


gulp.task 'coffee-update', ->
    nodemon.kill() if nodemon?
    gulp.src(COFFEE_PATH)
        .pipe changed(COFFEE_PATH)
        .pipe plumber()
        .pipe sourcemaps.init()
        .pipe coffee()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest(JS_PATH)

gulp.task 'coffee-dev', ->
    gulp.src(COFFEE_PATH)
        .pipe plumber()
        .pipe sourcemaps.init()
        .pipe coffee()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest(JS_PATH)

gulp.task 'coffee-pro', ->
    gulp.src(COFFEE_PATH)
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
    gulp.watch COFFEE_PATH, ['coffee-update', 'nodemon-dev']

gulp.task 'serve-pro', ->
    process.env.NODE_ENV = 'production'
    gulp.start 'nodemon'


gulp.task 'default', ['coffee-dev', 'serve-dev']
