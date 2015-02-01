gulp = require 'gulp'

path = require 'path'
BASE_DIR = __dirname + './../'
BASE = (p) -> path.join(BASE_DIR, p)

module.exports =
    browserify: [{
        src: [BASE 'src/client/main.js'],
        dst: BASE('build/js'),
        name: 'evil.js'
    }, {
        src: [BASE 'src/test/test_main.coffee'],
        dst: BASE('build/test'),
        name: 'test.js'
    }],
    watch:
        server: BASE('server/**/*'),
        coffee: BASE('src/coffee/**/*'),
        client: BASE('src/client/**/*'),
        scss: BASE('src/scss')
