var gulp = require('gulp');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');

// Server process handler
var nodemon;


// Compile only the updated file.
gulp.task('coffee-update', function(){
  if (nodemon) { nodemon.kill(); }
  return gulp.src('app/**/*.coffee')
    .pipe(changed('app/**/*.coffee'))
    .pipe(plumber())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(gulp.dest('app'));
});

// Compile all coffee file.
gulp.task('coffee', function () {
  return gulp.src('app/**/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(uglify())
    .pipe(gulp.dest('app'));
});

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
  gulp.watch('app/**/*.coffee', ['coffee-update', 'nodemon-dev']);
});
gulp.task('serve-pro', function () {
  process.env.NODE_ENV = 'production';
  gulp.start('nodemon');
});


// Build all coffee and launch the server.
gulp.task('default', ['coffee', 'serve-dev']);
