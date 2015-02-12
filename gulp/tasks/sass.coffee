gulp   = require 'gulp'
$      = require('gulp-load-plugins')()
reload = require('browser-sync').reload
config = require('../config').sass
notify = require '../utils/notify'

sass = require 'gulp-ruby-sass'

gulp.task 'sass', ->
  return sass(config.src, {sourcemap: true})
    .pipe $.plumber()
    .pipe $.autoprefixer('last 1 version')
    .pipe gulp.dest(config.dst)
    .pipe $.size()
