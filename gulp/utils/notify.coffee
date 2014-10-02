gulp = require 'gulp'
notifier = require 'gulp-notify'

error = (title)->
    () ->
        args = Array.prototype.slice.call(arguments)
        n = notifier.onError
            title: 'Gulp: ' + title
            message: '<%= error.message  %>'
        n.apply this, args
        @emit 'end'

ok = (title, message) ->
    n = notifier.notify
        title: title
        message: message
    n.apply this
    @emit 'end'

module.exports =
    ok: ok
    error: error
