gulp  = require 'gulp'
spawn = require('child_process').spawn

nodemon = null

gulp.task 'nodemon', ->
    nodemon.kill() if nodemon?
    nodemon = spawn('./node_modules/.bin/nodemon',
                    ['./server.js'],
                    { env: process.env, stdio: 'inherit' })
        .on 'close', ->
            console.log 'nodemon: process killed!'
