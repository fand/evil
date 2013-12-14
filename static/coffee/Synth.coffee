OSC_TYPE =
    RECT:     1
    SINE:     0
    SAW:      2
    TRIANGLE: 3



class @Noise
    constructor: (@ctx) ->
        @node = @ctx.createScriptProcessor(STREAM_LENGTH)
        @node.onaudioprocess = (event) =>
            data_L = event.outputBuffer.getChannelData(0);
            data_R = event.outputBuffer.getChannelData(1);
            for i in [0...data_L.length]
                data_L[i] = data_R[i] = Math.random()

    connect: (dst) -> @node.connect(dst)
    setOctave: (_) -> null
    setFine: (_) -> null
    setNote: -> null
    setInterval: (_) -> null
    setFreq: -> null
    setKey:  -> null
    setShape: (shape) ->



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



class @SynthCore
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

        @view = new SynthCoreView(this, id, @parent.view.dom.find('.core'))

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

    setKey: (freq_key) ->
        v.setKey(freq_key) for v in @vcos

    setScale: (@scale) ->

    connect: (dst) ->
        @node.connect(@filter.lpf)
        @filter.connect(dst)

    setNote: (note) ->
        for v in @vcos
            v.setNote(note)
            v.setFreq()



class @SynthCoreView
    constructor: (@model, @id, @dom) ->

        @vcos = $(@dom.find('.vco'))

        @EG_inputs     = @dom.find('.EG > input')
        @FEG_inputs    = @dom.find('.FEG > input')
        @filter_inputs = @dom.find(".filter input")
        @gain_inputs   = @dom.find('.gain > input')

        @canvasEG   = @dom.find(".canvasEG").get()[0]
        @canvasFEG  = @dom.find(".canvasFEG").get()[0]
        @contextEG  = @canvasEG.getContext('2d')
        @contextFEG = @canvasFEG.getContext('2d')

        @initEvent()

    initEvent: ->
        @vcos.on("change",          () => @setVCOParam())
        @gain_inputs.on("change",   () => @setGains())
        @filter_inputs.on("change", () => @setFilterParam())
        @EG_inputs.on("change",     () => @setEGParam())
        @FEG_inputs.on("change",    () => @setFEGParam())
        @setParam()

    updateCanvas: (name) ->
        canvas  = null
        context = null
        adsr    = null
        if name == "EG"
            canvas  = @canvasEG
            context = @contextEG
            adsr    = @model.eg.getParam()
        else
            canvas  = @canvasFEG
            context = @contextFEG
            adsr    = @model.feg.getParam()

        w = canvas.width = 180
        h = canvas.height = 50
        w4 = w/4
        context.clearRect(0,0,w,h)
        context.beginPath();
        context.moveTo(w4 * (1.0 - adsr[0]), h)
        context.lineTo(w / 4,0)                                  # attack
        context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]))  # decay
        context.lineTo(w4 * 3, h * (1.0 - adsr[2]))              # sustain
        context.lineTo(w4 * (adsr[3] + 3), h)                    # release
        context.strokeStyle = 'rgb(0, 220, 255)'
        context.stroke()

    setParam: ->
        @setVCOParam()
        @setEGParam()
        @setFEGParam()
        @setFilterParam()
        @setGains()

    setVCOParam: ->
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            @model.setVCOParam(
                i,
                vco.find('.shape').val(),
                parseInt(vco.find('.octave').val()),
                parseInt(vco.find('.interval').val()),
                parseInt(vco.find('.fine').val())
            )

    setEGParam: ->
        @model.setEGParam(
            parseFloat(@EG_inputs.eq(0).val()),
            parseFloat(@EG_inputs.eq(1).val()),
            parseFloat(@EG_inputs.eq(2).val()),
            parseFloat(@EG_inputs.eq(3).val())
        )
        @updateCanvas("EG");

    setFEGParam: ->
        @model.setFEGParam(
            parseFloat(@FEG_inputs.eq(0).val()),
            parseFloat(@FEG_inputs.eq(1).val()),
            parseFloat(@FEG_inputs.eq(2).val()),
            parseFloat(@FEG_inputs.eq(3).val())
        );
        @updateCanvas("FEG");

    setFilterParam: ->
        @model.setFilterParam(
            parseFloat(@filter_inputs.eq(0).val()),
            parseFloat(@filter_inputs.eq(1).val())
        )

    setGains: ->
        for i in [0... @gain_inputs.length]
            @model.setVCOGain(i, parseInt(@gain_inputs.eq(i).val()))



class @Synth
    constructor: (@ctx, @id, @player) ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @time = 0
        @scale = []
        @view = new SynthView(this, @id)
        @core = new SynthCore(this, @ctx, @id)

    connect: (dst) -> @core.connect(dst)

    setDuration: (@duration) ->
    setKey:  (key) -> @core.setKey(key)
    setScale: (@scale) ->
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

    readPattern: (@pattern) ->
        @view.readPattern(@pattern)

    plusPattern: ->
        @pattern = @pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        @player.setSceneSize()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.setSceneSize()

    addNote: (time, note) ->
        @pattern[time] = note

    removeNote: (time) ->
        @pattern[time] = 0

    activate: (i) -> @view.activate(i)
    inactivate: (i) -> @view.inactivate(i)

    redraw: (@time) ->
        @view.drawPattern(@time)
        @view.playAt(@time)
