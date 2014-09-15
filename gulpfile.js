var gulp = require('gulp');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// Server process handler
var nodemon;


// Compile only the updated file.
gulp.task('coffee-update', function(){
  if (nodemon) { nodemon.kill(); }
  return gulp.src('client/**/*.coffee')
    .pipe(changed('client/**/*.coffee'))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client'));
});

// Compile all coffee file.
gulp.task('coffee-dev', function () {
  return gulp.src('client/**/*.coffee')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client'));
});
gulp.task('coffee-pro', function () {
  return gulp.src('client/**/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(gulp.dest('client'));
});
gulp.task('coffee', ['coffee-dev']);


// Keep the server alive.
gulp.task('nodemon', function () {
  if (nodemon) { nodemon.kill(); }
  nodemon = require('child_process').spawn(
    './node_modules/.bin/nodemon',
    ['./server.js'],
    {
      env: process.env,
      stdio: 'inherit'
    }
  ).on('close', function () {
    console.log('nodemon: process killed!');
  });
});

// alias for dev task dependency
gulp.task('nodemon-dev', ['coffee-update'], function () {
  gulp.start('nodemon');
});


// Server tasks.
gulp.task('serve-dev', ['coffee'], function () {
  process.env.NODE_ENV = 'development';
  gulp.start('nodemon');
  gulp.watch('client/**/*.coffee', ['coffee-update', 'nodemon-dev']);
});
gulp.task('serve-pro', function () {
  process.env.NODE_ENV = 'production';
  gulp.start('nodemon');
});


// Build all coffee and launch the server.
gulp.task('default', ['coffee-dev', 'serve-dev']);
