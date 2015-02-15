FX = require './FX'
DoubleView = require './DoubleView'
Panner = require '../Panner'

class Double extends FX
    constructor: (@ctx) ->
        super(@ctx)

        @delay = @ctx.createDelay()
        @delay.delayTime.value = 0.03

        @pan_l = new Panner(@ctx)
        @pan_r = new Panner(@ctx)
        @setWidth([0, 0, -1])

        @in.connect(@pan_l.in)
        @in.connect(@delay)
        @delay.connect(@pan_r.in)
        @pan_l.connect(@out)
        @pan_r.connect(@out)

        @out.gain.value = 0.6

        @view = new DoubleView(this)

    setDelay: (d) -> @delay.delayTime.value = d
    setWidth: (@pos) ->
        @pan_l.setPosition( @pos)
        @pan_r.setPosition(-@pos)

    setParam: (p) ->
        @setDelay(p.delay) if p.delay?
        @setWidth(p.width) if p.width?
        @view.setParam(p)

    getParam: (p) ->
        effect: 'Double'
        delay: @delay.delayTime.value
        width: @pos


# Export!
module.exports = Double
