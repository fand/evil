SynthCoreView = require './CoreView'
MutekiTimer = require '../MutekiTimer'
CONSTANT = require '../Constant'

##
# CONSTANTS

OSC_TYPE =
    SINE:     'sine'
    RECT:     'square'
    SAW:      'sawtooth'
    TRIANGLE: 'triangle'

# Offsets for supersaw / superrect
TIME_OFFSET = [2, 3, 5, 7, 11, 13, 17]
FREQ_OFFSET = [0.1, 0.15, 0.25, 0.35, 0.55, 0.65, 0.85]

# Timer only for this module
T2 = new MutekiTimer()


# Noise Oscillator.
class Noise
    constructor: (@ctx) ->
        @node = @ctx.createScriptProcessor(CONSTANT.STREAM_LENGTH)
        @node.onaudioprocess = (event) =>
            data_L = event.outputBuffer.getChannelData(0);
            data_R = event.outputBuffer.getChannelData(1);
            for i in [0...data_L.length]
                data_L[i] = data_R[i] = Math.random()

    connect: (dst) -> @node.connect(dst)
    setOctave: (@octae) ->
    setFine: (@fine) ->
    setNote: ->
    setInterval: (@interval) ->
    setFreq: ->
    setKey:  ->
    setShape: (@shape) ->

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    setParam: (p) ->
        @shape = p.shape
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine


# Oscillators.
class VCO
    constructor: (@ctx) ->
        @freq_key = 55
        @octave = 4
        @interval = 0
        @fine = 0
        @note = 0
        @freq = Math.pow(2, @octave) * @freq_key

        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @osc = @ctx.createOscillator()
        @osc.type = 0

        @oscs = [@ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator(),
                 @ctx.createOscillator(), @ctx.createOscillator(), @ctx.createOscillator()]

        @setFreq()
        @osc.start(0)
        @oscs[i].start(TIME_OFFSET[i]) for i in [0...7]


    setOctave: (@octave) ->
    setNote: (@note) ->
    setKey: (@freq_key) ->
    setInterval: (@interval) ->

    setFine: (@fine) ->
        @osc.detune.value = @fine
        o.detune.value = @fine for o in @oscs

    setShape: (@shape) ->
        if @shape == 'SUPERSAW'
            for o in @oscs
                o.type = OSC_TYPE['SAW']
                o.connect(@node)
            @osc.disconnect()
            @node.gain.value = 0.9
        else if @shape == 'SUPERRECT'
            for o in @oscs
                o.type = OSC_TYPE['RECT']
                o.connect(@node)
            @osc.disconnect()
            @node.gain.value = 0.9
        else
            o.disconnect() for o in @oscs
            @osc.type = OSC_TYPE[shape]
            @osc.connect(@node)
            @node.gain.value = 1.0

    setFreq: ->
        note_oct = Math.floor(@note / 12)
        note_shift = @note % 12
        @freq = (Math.pow(2, @octave + note_oct) * Math.pow(CONSTANT.SEMITONE, note_shift) * @freq_key) + @fine

        if @shape == 'SUPERSAW' or @shape == 'SUPERRECT'
            for i in [0...7]
                @oscs[i].frequency.setValueAtTime(@freq + FREQ_OFFSET[i], 0)
        else
            @osc.frequency.setValueAtTime(@freq, 0)

    connect: (@dst) ->
        @osc.connect(@node)
        o.connect(@node) for o in @oscs
        @node.connect(@dst)

    disconnect:    -> @node.disconnect()

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    setParam: (p) ->
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine
        @setShape(p.shape)


# Envelope generator.
class EG
    constructor: (@target, @min, @max) ->
        @attack  = 0
        @decay   = 0
        @sustain = 0.0
        @release = 0

    getADSR: -> [@attack, @decay, @sustain, @release]
    setADSR: (attack, decay, sustain, release) ->
        @attack  = attack  / 50000.0
        @decay   = decay   / 50000.0
        @sustain = sustain / 100.0
        @release = release / 50000.0

    getRange: -> [@min, @max]
    setRange:  (@min, @max) ->

    getParam: -> adsr: @getADSR(), range: @getRange()
    setParam: (p) ->
        [@attack, @decay, @sustain, @release] = p.adsr
        @setRange(p.range[0], p.range[1])

    noteOn: (time) ->
        @target.cancelScheduledValues(time)

        @target.setValueAtTime(@target.value, time)

        @target.linearRampToValueAtTime(@max, time + @attack)
        @target.linearRampToValueAtTime(@sustain * (@max - @min) + @min, (time + @attack + @decay))

    noteOff: (time) ->
        @target.linearRampToValueAtTime(@min, time + @release)
        @target.linearRampToValueAtTime(0, time + @release + 0.001)
        @target.cancelScheduledValues(time + @release + 0.002)


# Manages filter params.
class ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'  # lowpass == 0
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    disconnect:    ()  -> @lpf.disconnect()
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q
    getQ: ()  -> @lpf.Q.value


# Manages VCO, Noise, ResFilter, EG.
class SynthCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 0
        @gain = 1.0
        @is_mute = false
        @is_on = false
        @is_harmony = true

        @scale = @parent.scale
        @vcos  = [new VCO(@ctx), new VCO(@ctx), new Noise(@ctx)]
        @gains = [@ctx.createGain(), @ctx.createGain(), @ctx.createGain()]
        for i in [0...3]
            @vcos[i].connect(@gains[i])
            @gains[i].gain.value = 0
            @gains[i].connect(@node)

        @filter = new ResFilter(@ctx)

        @eg  = new EG(@node.gain, 0.0, @gain)
        @feg = new EG(@filter.lpf.frequency, 0, 0)

        # Noise generator for resonance.
        @gain_res = @ctx.createGain()
        @gain_res.gain.value = 0
        @vcos[2].connect(@gain_res)
        @gain_res.connect(@node)

        @view = new SynthCoreView(this, id, @parent.view.dom.find('.synth-core'))

    getParam: ->
        type: 'REZ'
        vcos: (v.getParam() for v in @vcos)
        gains: (g.gain.value for g in @gains)
        eg:  @eg.getParam()
        feg: @feg.getParam()
        filter: [@feg.getRange()[1], @filter.getQ()]
        harmony: @is_harmony

    setParam: (p) ->
        if p.vcos?
            for i in [0...p.vcos.length]
                @vcos[i].setParam(p.vcos[i])
        if p.gains?
            for i in [0...p.gains.length]
                @gains[i].gain.value = p.gains[i]
        @eg.setParam(p.eg) if p.eg?
        @feg.setParam(p.feg) if p.feg?
        if p.filter?
            @feg.setRange(@feg.getRange()[0], p.filter[0])
            @filter.setQ(p.filter[1])
        @view.setParam(p)

    setVCOParam: (i, shape, oct, interval, fine, harmony) ->
        @vcos[i].setShape(shape)
        @vcos[i].setOctave(oct)
        @vcos[i].setInterval(interval)
        @vcos[i].setFine(fine)
        @vcos[i].setFreq()
        if harmony?
            @is_harmony = (harmony == 'harmony')

    setEGParam:  (a, d, s, r) -> @eg.setADSR(a, d, s, r)
    setFEGParam: (a, d, s, r) -> @feg.setADSR(a, d, s, r)

    setFilterParam: (freq, q) ->
        @feg.setRange(80, Math.pow(freq/1000, 2.0) * 25000 + 80)
        @filter.setQ(q)
        @gain_res.gain.value = 0.1 * (q / 1000.0) if q > 1

    setVCOGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gains[i].gain.value = (gain / 100.0) * 0.3

    setGain: (@gain) ->
        @eg.setRange(0.0, @gain)

    noteOn: ->
        return if @is_mute
        return if @is_on
        t0 = @ctx.currentTime
        @eg.noteOn(t0)
        @feg.noteOn(t0)
        @is_on = true

    noteOff: ->
        return if not @is_on
        t0 = @ctx.currentTime
        @eg.noteOff(t0)
        @feg.noteOff(t0)
        @is_on = false

    setKey: (key) ->
        freq_key = CONSTANT.KEY_LIST[key]
        v.setKey(freq_key) for v in @vcos

    setScale: (@scale) ->

    connect: (dst) ->
        @node.connect(@filter.lpf)
        @filter.connect(dst)

    disconnect: () ->
        @filter.disconnect()
        @node.disconnect()

    # Converts interval (n-th note) to semitones.
    noteToSemitone: (note, shift) ->
        if @is_harmony
            note = note + shift
            note-- if shift > 0
            note++ if shift < 0
            semitone = Math.floor((note-1)/@scale.length) * 12 + @scale[(note-1) % @scale.length]
        else
            semitone = Math.floor((note-1)/@scale.length) * 12 + @scale[(note-1) % @scale.length] + shift

    setNote: (@note) ->
        for v in @vcos
            v.setNote(@noteToSemitone(@note, v.interval))
            v.setFreq()

    mute:   -> @is_mute = true
    demute: -> @is_mute = false


module.exports = SynthCore
