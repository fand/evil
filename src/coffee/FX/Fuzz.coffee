FX = require './FX'

class @Fuzz extends @FX
    constructor: (@ctx) ->
        super(@ctx)
        @fuzz = @ctx.createWaveShaper()
        @in.connect(@fuzz)
        @fuzz.connect(@out)
        @in.gain.value = 1.0
        @out.gain.value = 1.0
        @type = 'Sigmoid'
        @samples = 2048
        @fuzz.curve = new Float32Array(@samples)
        @setGain(0.08)

        @view = new FuzzView(this)

    setType: (@type) ->
    setGain: (@gain) ->
        sigmax = 2.0 / (1 + Math.exp(-@gain * 1.0)) - 1.0
        ratio = 1.0 / sigmax
        if @type == 'Sigmoid'
            for i in [0...@samples]
                x = i * 2.0 / @samples - 1.0
                sigmoid = 2.0 / (1 + Math.exp(-Math.pow(@gain, 3) * 1000 * x)) - 1.0
                @fuzz.curve[i] = sigmoid * ratio
        else if @type == 'Octavia'
            for i in [0...@samples]
                x = i * 2.0 / @samples - 1.0
                sigmoid = 2.0 / (1 + Math.exp(-Math.pow(@gain, 2) * 10 * x)) - 1.0
                @fuzz.curve[i] = Math.abs(sigmoid * ratio) * 2.0 - 1.0

    setParam: (p) ->
        @setType(p.type) if p.type?
        @setGain(p.gain) if p.gain?
        @setInput(p.input) if p.input?
        @setOutput(p.output) if p.output?
        @view.setParam(p)

    getParam: (p) ->
        effect: 'Fuzz'
        type: @type
        gain: @gain
        input: @in.gain.value
        output: @out.gain.value


# Export!
module.exports = Fuzz
