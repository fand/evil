class @VCO
    constructor: (@ctx) ->
        @freq_key = 55
        @octave = 4
        @interval = 0
        @fine = 0
        @note = 0
        @freq = Math.pow(2, @octave) * @freq_key

        @node = @ctx.createOscillator()
        @node.type = 'sine'
        @setFreq()
        @node.start(0)

    setOctave: (@octave) ->
    setFine: (@fine) -> @node.detune.value = @fine
    setNote: (@note) ->
    setKey: (@freq_key) ->
    setInterval: (@interval) ->
    setShape: (shape) ->
        @node.type = OSC_TYPE[shape]

    setFreq: ->
        @freq = (Math.pow(2, @octave) * Math.pow(SEMITONE, @interval + @note) * @freq_key) + @fine
        @node.frequency.setValueAtTime(@freq, 0)

    connect: (dst) -> @node.connect(dst)



class @EG
    constructor: (@target, @min, @max) ->
        @attack  = 0
        @decay   = 0
        @sustain = 0.0
        @release = 0

    getParam: -> [@attack, @decay, @sustain, @release]
    setParam: (attack, decay, sustain, release) ->
        @attack  = attack  / 50000.0
        @decay   = decay   / 50000.0
        @sustain = sustain / 100.0
        @release = release / 50000.0

    setRange: (@min, @max) ->
    getRange: -> [@min, @max]

    noteOn: (time) ->
        @target.cancelScheduledValues(time)
        @target.setValueAtTime(@min, time)
        @target.linearRampToValueAtTime(@max, time + @attack)
        @target.linearRampToValueAtTime(@sustain * (@max - @min) + @min, (time + @attack + @decay))

    noteOff: (time) ->
        @target.cancelScheduledValues(time)
        @target.linearRampToValueAtTime(@min, time + @release)



class @ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'  # lowpass == 0
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q



class @SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 0
        @gain = 1.0

        @vcos  = [new VCO(@ctx), new VCO(@ctx), new Noise(@ctx)]
        @gains = [@ctx.createGain(), @ctx.createGain(), @ctx.createGain()]
        for i in [0...3]
            @vcos[i].connect(@gains[i])
            @gains[i].gain.value = 0
            @gains[i].connect(@node)

        @filter = new ResFilter(@ctx)

        @eg  = new EG(@node.gain, 0.0, @gain)
        @feg = new EG(@filter.lpf.frequency, 0, 0)

        # resonance用ノイズ生成
        @gain_res = @ctx.createGain()
        @gain_res.gain.value = 0
        @vcos[2].connect(@gain_res)
        @gain_res.connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    setVCOParam: (i, shape, oct, interval, fine) ->
        @vcos[i].setShape(shape)
        @vcos[i].setOctave(oct)
        @vcos[i].setInterval(interval)
        @vcos[i].setFine(fine)
        @vcos[i].setFreq()

    setEGParam:  (a, d, s, r) -> @eg.setParam(a, d, s, r)
    setFEGParam: (a, d, s, r) -> @feg.setParam(a, d, s, r)

    setFilterParam: (freq, q) ->
        @feg.setRange(80, Math.pow(freq/1000, 2.0) * 25000 + 80)
        @filter.setQ(q)
        @gain_res.value = 0.1 * (q / 1000.0) if q > 1

    setVCOGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gains[i].gain.value = (gain / 100.0) * 0.3

    setGain: (@gain) ->
        @eg.setRange(0.0, @gain)

    noteOn: ->
        t0 = @ctx.currentTime
        @eg.noteOn(t0)
        @feg.noteOn(t0)

    noteOff: ->
        t0 = @ctx.currentTime
        @eg.noteOff(t0)
        @feg.noteOff(t0)

    setKey: (key) ->
        freq_key = KEY_LIST[key]
        v.setKey(freq_key) for v in @vcos

    setScale: (@scale) ->

    connect: (dst) ->
        @node.connect(@filter.lpf)
        @filter.connect(dst)

    setNote: (note) ->
        for v in @vcos
            v.setNote(note)
            v.setFreq()



class @Sampler
    constructor: (@ctx, @id, @player, @name) ->
        @name = 'Sampler #' + @id if not @name?
        @pattern_name = 'pattern 0'
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj = name: @pattern_name, pattern: @pattern
        @time = 0
        @scale = []
        @view = new SamplerView(this, @id)
        @core = new SamplerCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

    connect: (dst) -> @core.connect(dst)

    setDuration: (@duration) ->
    setKey:  (key) -> @core.setKey(key)
    setScale: (scale_name) -> @scale = SCALE_LIST[scale_name]
    setNote: (note) -> @core.setNote(note)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteToSemitone: (ival) ->
        Math.floor((ival-1)/7) * 12 + @scale[(ival-1) % 7]

    noteOn: (note) ->
        @core.setNote(@noteToSemitone(note))
        @core.noteOn()

    noteOff: -> @core.noteOff()

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        if @pattern[mytime] == 0
            @core.noteOff()
        else if @pattern[mytime] == 'end'
            T.setTimeout(( =>
                @core.noteOff()
                ), @duration - 10)
        else if @pattern[mytime] == 'sustain'
            return
        else if @pattern[mytime] < 0
            @is_sustaining = true
            n = -( @pattern[mytime] )
            @core.setNote(@noteToSemitone(n))
            @core.noteOn()
        else
            @core.setNote(@noteToSemitone(@pattern[mytime]))
            @core.noteOn()
            T.setTimeout(( =>
                @core.noteOff()
                ), @duration - 10)

    play: () ->
        @view.play()

    stop: () ->
        @core.noteOff()
        @view.stop()

    pause: (time) ->
        @core.noteOff()

    readPattern: (@pattern_obj) ->
        @pattern = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.readPattern(@pattern_obj)

    clearPattern: () ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj.pattern = @pattern
        @view.readPattern(@pattern_obj)

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

    setId: (@id) ->

    setSynthName: (@name) ->
        @session.setSynthName(@id, @name)
        @view.setSynthName(@name)

    setPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)
        @view.setPatternName(@pattern_name)
