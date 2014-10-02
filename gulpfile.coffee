gulp        = require 'gulp'
requireDir = require 'require-directory'
requireDir module, './gulp/tasks'

gulp.task 'dev', ->
    process.env.NODE_ENV = 'development'
    gulp.start ['build', 'watch', 'nodemon']

gulp.task 'pro', ->
    process.env.NODE_ENV = 'production'
    gulp.start ['build', 'nodemon']

gulp.task 'default', ['dev']
