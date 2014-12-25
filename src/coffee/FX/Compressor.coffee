FX = require './FX'

class Compressor extends FX
    constructor: (@ctx) ->
        super(@ctx)
        @comp = @ctx.createDynamicsCompressor()
        @in.connect(@comp)
        @comp.connect(@out)
        @in.gain.value = 1.0
        @out.gain.value = 1.0

        @view = new CompressorView(this)

    setAttack:    (d) -> @comp.attack.value = d
    setRelease:   (d) -> @comp.release.value = d
    setThreshold: (d) -> @comp.threshold.value = d
    setRatio:     (d) -> @comp.ratio.value = d
    setKnee:      (d) -> @comp.knee.value = d

    setParam: (p) ->
        @setAttack(p.attack) if p.attack?
        @setRelease(p.release) if p.release?
        @setThreshold(p.threshold) if p.threshold?
        @setRatio(p.ratio) if p.ratio?
        @setKnee(p.knee) if p.knee?
        @setInput(p.input) if p.input?
        @setOutput(p.output) if p.output?
        @view.setParam(p)

    getParam: (p) ->
        effect: 'Compressor'
        attack:  @comp.attack.value
        release: @comp.release.value
        threshold: @comp.threshold.value
        ratio: @comp.ratio.value
        knee: @comp.knee.value
        input: @in.gain.value
        output: @out.gain.value


# Export!
module.exports = Compressor
