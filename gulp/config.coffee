gulp = require 'gulp'

module.exports =
    browserify: [{
        src: ['./src/coffee/main.coffee'],
        dst: 'build/js',
        name: 'evil.js'
    }, {
        src: ['./src/test/test_main.coffee'],
        dst: 'build/test',
        name: 'test.js'
    }],
    watch:
        server: 'server/**/*',
        coffee: 'src/coffee',
        scss: 'src/scss'
