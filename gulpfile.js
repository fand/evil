var gulp = require('gulp');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');


gulp.task('coffee', function () {
  return gulp.src('app/coffee/**/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('app/**/*.js'));
});

gulp.task('test', function () {
  require('coffee-script/register');
  return gulp.src('test/*.coffee')
    .pipe(plumber())
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec',
      timeout: 100000
    }))
    .once('end', function () {
      process.exit();
    });
});

gulp.task('test-coffee', ['coffee'], function () {
  gulp.start('test');
});
gulp.task('watch-coffee', ['coffee', 'test-coffee']);

gulp.task('watch', function () {
  gulp.watch('app/**/*.coffee', ['watch-coffee']);
  // gulp.watch('test/*.coffee', ['test']);
});


gulp.task('serve', function () {
  nodemon({ script: 'server.js', ext: 'html js', ignore: [] })
      .on('change', ['coffee'])
      .on('restart', function () {
        console.log('restarted!');
      });
});

gulp.task('serve-dev', function () {
  process.env.NODE_ENV = 'development';
  gulp.start('serve');
});

gulp.task('serve-pro', function () {
  process.env.NODE_ENV = 'production';
  gulp.start('serve');
});


gulp.task('default', ['coffee', 'test-coffee']);
