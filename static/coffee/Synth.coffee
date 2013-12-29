@KEY_LIST =
    A:  55
    Bb: 58.27047018976124
    B:  61.7354126570155
    C:  32.70319566257483
    Db: 34.64782887210901
    D:  36.70809598967594
    Eb: 38.890872965260115
    E:  41.20344461410875
    F:  43.653528929125486
    Gb: 46.2493028389543
    G:  48.999429497718666
    Ab: 51.91308719749314

@SCALE_LIST =
    IONIAN:     [0,2,4,5,7,9,11,12,14,16]
    DORIAN:     [0,2,3,5,7,9,10,12,14,15]
    PHRYGIAN:   [0,1,3,5,7,8,10,12,13,15]
    LYDIAN:     [0,2,4,6,7,9,11,12,14,16]
    MIXOLYDIAN: [0,2,4,5,7,9,10,12,14,16]
    AEOLIAN:    [0,2,3,5,7,8,10,12,14,15]
    LOCRIAN:    [0,1,3,5,6,8,10,12,13,15]

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
    setOctave: (@octae) ->
    setFine: (@fine) ->
    setNote: ->
    setInterval: (@interval) ->
    setFreq: ->
    setKey:  ->
    setShape: (@shape) ->

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    readParam: (p) ->
        @shape = p.shape
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine



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
    setShape: (@shape) ->
        @node.type = OSC_TYPE[shape]

    setFreq: ->
        @freq = (Math.pow(2, @octave) * Math.pow(SEMITONE, @interval + @note) * @freq_key) + @fine
        @node.frequency.setValueAtTime(@freq, 0)

    connect: (dst) -> @node.connect(dst)
    disconnect:    -> @node.disconnect()

    getParam: ->
        shape: @shape, octave: @octave, interval: @interval, fine: @fine

    readParam: (p) ->
        @shape = p.shape
        @octave = p.octave
        @interval = p.interval
        @fine = p.fine


class @EG
    constructor: (@target, @min, @max) ->
        @attack  = 0
        @decay   = 0
        @sustain = 0.0
        @release = 0

    getADSR: -> console.log([@attack, @decay, @sustain, @release]); [@attack, @decay, @sustain, @release]
    setADSR: (attack, decay, sustain, release) ->
        @attack  = attack  / 50000.0
        @decay   = decay   / 50000.0
        @sustain = sustain / 100.0
        @release = release / 50000.0
    readADSR: (@attack, @decay, @sustain, @release) ->

    getRange: -> [@min, @max]
    setRange:  (@min, @max) ->
    readRange: (@min, @max) ->

    getParam: -> adsr: @getADSR(), range: @getRange()
    readParam: (p) ->
        @readADSR(p.adsr[0], p.adsr[1], p.adsr[2], p.adsr[3])
        @readRange(p.range[0], p.range[1])

    noteOn: (time) ->
        @target.cancelScheduledValues(time)
        @target.setValueAtTime(@min, time)
        @target.linearRampToValueAtTime(@max, time + @attack)
        @target.linearRampToValueAtTime(@sustain * (@max - @min) + @min, (time + @attack + @decay))

    noteOff: (time) ->
        @target.linearRampToValueAtTime(@min, time + @release)
        @target.linearRampToValueAtTime(0, time + @release + 1)



class @ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'  # lowpass == 0
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q


    readParam: (p) -> @lpf.Q.value = p[1]
    getParam: () -> @lpf.Q.value



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

        @view = new SynthCoreView(this, id, @parent.view.dom.find('.synth-core'))

    getParam: ->
        vcos: (v.getParam() for v in @vcos)
        gains: (g.gain.value for g in @gains)
        eg:  @eg.getParam()
        feg: @feg.getParam()
        filter: [@feg.getRange()[1], @filter.getParam()]

    readParam: (p) ->
        if p.vcos?
            for i in [0...p.vcos.length]
                @vcos[i].readParam(p.vcos[i])
        if p.gains?
            for i in [0...p.gains.length]
                @gains[i].gain.value = p.gains[i]
        @eg.readParam(p.eg) if p.eg?
        @feg.readParam(p.feg) if p.feg?
        @filter.readParam(p.filter) if p.filter?
        @view.readParam(p)

    setVCOParam: (i, shape, oct, interval, fine) ->
        @vcos[i].setShape(shape)
        @vcos[i].setOctave(oct)
        @vcos[i].setInterval(interval)
        @vcos[i].setFine(fine)
        @vcos[i].setFreq()

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

    disconnect: () ->
        @filter.disconnect()
        @node.disconnect()

    setNote: (note) ->
        for v in @vcos
            v.setNote(note)
            v.setFreq()



class @SynthCoreView
    constructor: (@model, @id, @dom) ->

        @vcos = $(@dom.find('.RS_VCO'))

        @EG_inputs     = @dom.find('.RS_EG input')
        @FEG_inputs    = @dom.find('.RS_FEG input')
        @filter_inputs = @dom.find(".RS_filter input")
        @gain_inputs   = @dom.find('.RS_mixer input')

        @canvasEG   = @dom.find(".RS_EG .canvasEG").get()[0]
        @canvasFEG  = @dom.find(".RS_FEG .canvasFEG").get()[0]
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
            adsr    = @model.eg.getADSR()
        else
            canvas  = @canvasFEG
            context = @contextFEG
            adsr    = @model.feg.getADSR()

        w = canvas.width = 180
        h = canvas.height = 50
        w4 = w/4
        context.clearRect(0,0,w,h)
        context.beginPath()
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

    readVCOParam: (p) ->
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            vco.find('.shape').val(p[i].shape)
            vco.find('.octave').val(p[i].octave)
            vco.find('.interval').val(p[i].interval)
            vco.find('.fine').val(p[i].fine)

    setEGParam: ->
        @model.setEGParam(
            parseFloat(@EG_inputs.eq(0).val()),
            parseFloat(@EG_inputs.eq(1).val()),
            parseFloat(@EG_inputs.eq(2).val()),
            parseFloat(@EG_inputs.eq(3).val())
        )
        @updateCanvas("EG");

    readEGParam: (p) ->
        console.log(p)
        for i in [0...p.length]
            @EG_inputs.eq(i).val(p[i])

    setFEGParam: ->
        @model.setFEGParam(
            parseFloat(@FEG_inputs.eq(0).val()),
            parseFloat(@FEG_inputs.eq(1).val()),
            parseFloat(@FEG_inputs.eq(2).val()),
            parseFloat(@FEG_inputs.eq(3).val())
        );
        @updateCanvas("FEG");

    readFEGParam: (p) ->
        for i in [0...p.length]
            @FEG_inputs.eq(i).val(p[i])

    setFilterParam: ->
        @model.setFilterParam(
            parseFloat(@filter_inputs.eq(0).val()),
            parseFloat(@filter_inputs.eq(1).val())
        )

    readFilterParam: (p) ->
        @filter_inputs.eq(0).val(p[0])
        @filter_inputs.eq(1).val(p[1])

    setGains: ->
        for i in [0... @gain_inputs.length]
            @model.setVCOGain(i, parseInt(@gain_inputs.eq(i).val()))

    readParam: (p) ->
        console.log(p)
        if p.vcos?
            @readVCOParam(p.vcos)
        if p.gains?
            for i in [0...p.gains.length]
                @gain_inputs.eq(i).val(p.gains[i] / 0.3 * 100)
        @readEGParam(p.eg) if p.eg?
        @readFEGParam(p.feg) if p.feg?
        @readFilterParam(p.filter) if p.filter?




class @Synth
    constructor: (@ctx, @id, @player, @name) ->
        @name = 'Synth #' + @id if not @name?
        @pattern_name = 'pattern 0'
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj = name: @pattern_name, pattern: @pattern
        @time = 0
        @scale = []
        @view = new SynthView(this, @id)
        @core = new SynthCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

    connect: (dst) -> @core.connect(dst)
    disconnect: () -> #@core.disconnect()

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

    readPattern: (_pattern_obj) ->
        @pattern_obj = $.extend(true, {}, _pattern_obj)
        @pattern = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.readPattern(@pattern_obj)

    getPattern: () ->
        @pattern_obj = name: @pattern_name, pattern: @pattern
        $.extend(true, {}, @pattern_obj)

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

    setSynthName: (@name) ->
        @session.setSynthName(@id, @name)
        @view.setSynthName(@name)

    setPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)

    readPatternName: (@pattern_name) ->
        @view.setPatternName(@pattern_name)

    replaceWith: (s_new) ->
        @view.dom.replaceWith(s_new.view.dom)

    getParam: -> @core.getParam()
    readParam: (p) -> @core.readParam(p) if p?
