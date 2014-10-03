class Panner
    constructor: (@ctx) ->
        @in = @ctx.createChannelSplitter(2)
        @out = @ctx.createChannelMerger(2)
        @l = @ctx.createGain()
        @r = @ctx.createGain()
        @in.connect(@l, 0)
        @in.connect(@r, 1)
        @l.connect(@out, 0, 0)
        @r.connect(@out, 0, 1)
        @setPosition(0.5)

    connect: (dst) -> @out.connect(dst)

    setPosition: (@pos) ->
        @l.gain.value = @pos
        @r.gain.value = 1.0 - @pos


# Export!
module.exports = Panner
