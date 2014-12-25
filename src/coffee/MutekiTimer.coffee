# Muteki Timer - A stable timer that run in the background
'use strict'

wsetTimeout   = window.setTimeout
wclearTimeout = window.clearTimeout

SOURCE = '''
var t = 0;
onmessage = function(e) {
    if (t) {
        t = clearTimeout(t), 0;
    }
    if (typeof e.data === "number" && e.data > 0) {
        t = setTimeout(function() {
            postMessage(0);
        }, e.data);
    }
};
'''
TIMER_PATH = (@URL ? @webkitURL)?.createObjectURL(
    try new Blob([SOURCE], type:'text/javascript') catch e then null
)


class MutekiTimer
    constructor: ->
        if TIMER_PATH
            @timer = new Worker(TIMER_PATH)
        else
            @timer = 0

    setTimeout: (func, interval = 100) ->
        if typeof @timer is 'number'
            @timer = wsetTimeout func, interval
        else
            @timer.onmessage = func
            @timer.postMessage interval

    clearTimeout: ->
        if typeof @timer is 'number'
            clearTimeout @timer
        else
            @timer.postMessage 0


tid  = +new Date()
pool = {}
_setTimeout = (func, interval)->
    t = new MutekiTimer()
    t.setTimeout func, interval
    pool[++tid] = t
    tid

_clearTimeout = (id)->
    pool[id]?.clearTimeout()
    undefined


MutekiTimer.use = =>
    @setTimeout   = _setTimeout
    @clearTimeout = _clearTimeout


MutekiTimer.unuse = =>
    @setTimeout   = wsetTimeout
    @clearTimeout = wclearTimeout


MutekiTimer.isEnabled = ->
    !!TIMER_PATH


module.exports = MutekiTimer
