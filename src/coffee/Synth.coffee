MutekiTimer = require './MutekiTimer'
SynthView = require './SynthView'
SynthCoreView = require './SynthCoreView'
Panner = require './Panner'
CONSTANT = require './Constant'
$ = require 'jquery'


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


# Manages SynthCore, SynthView.
class Synth
    constructor: (@ctx, @id, @player, @name) ->
        @type = 'REZ'
        @name = 'Synth #' + @id if not @name?
        @pattern_name = 'pattern 0'
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj = name: @pattern_name, pattern: @pattern
        @time = 0
        @scale_name = 'Major'
        @scale = CONSTANT.SCALE_LIST[@scale_name]
        @view = new SynthView(this, @id)
        @core = new SynthCore(this, @ctx, @id)

        @is_on = false
        @is_sustaining = false
        @is_performing = false
        @session = @player.session

        @send = @ctx.createGain()
        @send.gain.value = 1.0
        @return = @ctx.createGain()
        @return.gain.value = 1.0
        @core.connect(@send)
        @send.connect(@return)

        @effects = []

        @T = new MutekiTimer()

    connect: (dst) ->
        if dst instanceof Panner
            @return.connect(dst.in)
        else
            @return.connect(dst)

    disconnect: () -> @return.disconnect()

    setDuration: (@duration) ->
    setKey:  (key) -> @core.setKey(key)
    setNote: (note) -> @core.setNote(note)

    setScale: (@scale_name) ->
        @scale = CONSTANT.SCALE_LIST[@scale_name]
        @core.scale = @scale
        @view.changeScale(@scale)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note, force) ->
        if force or not @is_performing
            @core.setNote(note)
            @core.noteOn()
        if force
            @is_performing = true

    noteOff: (force)->
        @is_performing = false if force
        if not @is_performing
            @core.noteOff()

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        return if @is_performing

        # off
        if @pattern[mytime] == 0
            @core.noteOff()

        # sustain start
        else if @pattern[mytime] < 0
            @is_sustaining = true
            n = -( @pattern[mytime] )
            @core.setNote(n)
            @core.noteOn()

        # sustain mid
        else if @pattern[mytime] == 'sustain'
            return

        # sustain end
        else if @pattern[mytime] == 'end'
            T2.setTimeout((() => @core.noteOff()), @duration - 10)

        # single note
        else
            @core.setNote(@pattern[mytime])
            @core.noteOn()
            T2.setTimeout((() => @core.noteOff()), @duration - 10)

    play: () ->
        @view.play()

    stop: () ->
        @core.noteOff()
        @view.stop()

    pause: (time) ->
        @core.noteOff()

    setPattern: (_pattern_obj) ->
        @pattern_obj = $.extend(true, {}, _pattern_obj)
        @pattern = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.setPattern(@pattern_obj)

    getPattern: () ->
        @pattern_obj = name: @pattern_name, pattern: @pattern
        $.extend(true, {}, @pattern_obj)

    clearPattern: () ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj.pattern = @pattern
        @view.setPattern(@pattern_obj)

    # Changes the length of @pattern.
    plusPattern: ->
        @pattern = @pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        @player.resetSceneLength()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.resetSceneLength()

    addNote: (time, note) ->
        @pattern[time] = note

    removeNote: (time) ->
        @pattern[time] = 0

    sustainNote: (l, r, note) ->
        if l == r
            @pattern[l] = note
            return
        for i in [l...r]
            @pattern[i] = 'sustain'
        @pattern[l] = -(note)
        @pattern[r] = 'end'

    activate: (i) -> @view.activate(i)
    inactivate: (i) -> @view.inactivate(i)

    redraw: (@time) ->
        @view.drawPattern(@time)

    # called by SynthView.
    inputPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)

    setPatternName: (@pattern_name) ->
        @view.setPatternName(@pattern_name)

    setSynthName: (@name) ->
        @session.setSynthName(@id, @name)
        @view.setSynthName(@name)

    # Get new Synth and replace.
    # called by SynthView.
    changeSynth: (type) ->
        s_new = @player.changeSynth(@id, type, s_new)
        @view.dom.replaceWith(s_new.view.dom)
        @noteOff(true)
        @disconnect()

    # Get params as object.
    getParam: ->
        p = @core.getParam()
        p.name = @name
        p.scale_name = @scale_name
        p.effects = @getEffectsParam()
        return p

    setParam: (p) ->
        return if not p?
        @core.setParam(p)
        @setEffects(p.effects) if p.effects?

    mute:   -> @core.mute()
    demute: -> @core.demute()

    # Set effects' params from the song.
    setEffects: (effects_new) ->
        e.disconnect() for e in @effects
        @effects = []

        for e in effects_new
            if e.effect == 'Fuzz'
                fx = new Fuzz(@ctx)
            else if e.effect == 'Delay'
                fx = new Delay(@ctx)
            else if e.effect == 'Reverb'
                fx = new Reverb(@ctx)
            else if e.effect == 'Comp'
                fx = new Compressor(@ctx)
            else if e.effect == 'Double'
                fx = new Double(@ctx)

            @insertEffect(fx)
            fx.setParam(e)

    getEffectsParam: ->
        f.getParam() for f in @effects

    insertEffect: (fx) ->

        if @effects.length == 0
            @send.disconnect()
            @send.connect(fx.in)
        else
            @effects[@effects.length - 1].disconnect()
            @effects[@effects.length - 1].connect(fx.in)

        fx.connect(@return)
        fx.setSource(this)
        @effects.push(fx)

    removeEffect: (fx) ->
        i = @effects.indexOf(fx)
        return if i == -1

        if i == 0
            prev = @send
        else
            prev = @effects[i - 1]

        prev.disconnect()
        if @effects[i + 1]?
            prev.connect(@effects[i + 1].in)
        else
            prev.connect(@return)

        fx.disconnect()
        @effects.splice(i, 1)


# Export!
module.exports = Synth
