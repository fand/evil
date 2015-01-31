FX = require './FX'
DelayView = require './DelayView'

class Delay extends FX
    constructor: (@ctx) ->
        super(@ctx)

        @delay = @ctx.createDelay()
        @delay.delayTime.value = 0.23

        @lofi = @ctx.createBiquadFilter()
        @lofi.type = "peaking"
        @lofi.frequency.value = 1200
        @lofi.Q.value = 0.0  # range is [0.0, 5.0]
        @lofi.gain.value = 1.0

        @feedback = @ctx.createGain()
        @feedback.gain.value = 0.2

        @in.connect(@lofi)
        @lofi.connect(@delay)
        @delay.connect(@wet)
        @delay.connect(@feedback)
        @feedback.connect(@lofi)

        @wet.connect(@out)
        @in.connect(@out)

        @view = new DelayView(this)

    setDelay: (d) -> @delay.delayTime.value = d
    setFeedback: (d) -> @feedback.gain.value = d
    setLofi: (d) -> @lofi.Q.value = d

    setParam: (p) ->
        @setDelay(p.delay) if p.delay?
        @setFeedback(p.feedback) if p.feedback?
        @setLofi(p.lofi) if p.lofi?
        @setWet(p.wet) if p.wet?
        @view.setParam(p)

    getParam: (p) ->
        effect: 'Delay'
        delay: @delay.delayTime.value
        feedback: @feedback.gain.value
        lofi: @lofi.Q.value
        wet: @wet.gain.value


# Export!
module.exports = Delay
