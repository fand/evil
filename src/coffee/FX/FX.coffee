$ = require 'jquery'

class FX
    constructor: (@ctx) ->
        @in = @ctx.createGain()
        @in.gain.value = 1.0
        @dry = @ctx.createGain()
        @dry.gain.value = 1.0
        @wet = @ctx.createGain()
        @wet.gain.value = 1.0
        @out = @ctx.createGain()
        @out.gain.value = 1.0

    connect: (dst) -> @out.connect(dst)
    disconnect: () -> @out.disconnect()

    setInput:  (d) -> @in.gain.value = d
    setOutput: (d) -> @out.gain.value = d
    setDry:    (d) -> @dry.gain.value = d
    setWet:    (d) -> @wet.gain.value = d

    appendTo: (dst) ->
        $(dst).append(@view.dom)
        @view.initEvent()

    remove: () ->
        @source.removeEffect(this)

    setSource: (@source) ->


# Export!
module.exports = FX
