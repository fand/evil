SEMITONE = 1.05946309
STREAM_LENGTH = 1024
SAMPLE_RATE = 48000
T = new MutekiTimer()

OSC_TYPE =
    SINE:     0
    RECT:     1
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
        @vco  = [new VCO(@ctx), new VCO(@ctx), new Noise(@ctx)]
        @gain = [@ctx.createGain(), @ctx.createGain(), @ctx.createGain()]
        for i in [0...3]
            @vco[i].connect(@gain[i])
            @gain[i].gain.value = 0
            @gain[i].connect(@node)

        @filter = new ResFilter(@ctx)

        @eg  = new EG(@node.gain, 0.0, 1.0)
        @feg = new EG(@filter.lpf.frequency, 0, 0)

        # resonance用ノイズ生成
        @gain_res = @ctx.createGain()
        @gain_res.gain.value = 0
        @vco[2].connect(@gain_res)
        @gain_res.connect(@node)

        @view = new SynthCoreView(this, id, @parent.view.dom.find('.core'))

    setVCOParam: (i, shape, oct, interval, fine) ->
        @vco[i].setShape(shape)
        @vco[i].setOctave(oct)
        @vco[i].setInterval(interval)
        @vco[i].setFine(fine)
        @vco[i].setFreq()

    setEGParam:  (a, d, s, r) -> @eg.setParam(a, d, s, r)
    setFEGParam: (a, d, s, r) -> @feg.setParam(a, d, s, r)

    setFilterParam: (freq, q) ->
        @feg.setRange(80, Math.pow(freq/1000, 2.0) * 25000 + 80)
        @filter.setQ(q)
        @gain_res.value = 0.1 * (q / 1000.0) if q > 1

    setGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gain[i].gain.value = (gain / 100.0) * 0.3

    noteOn: ->
        t0 = @ctx.currentTime
        @eg.noteOn(t0)
        @feg.noteOn(t0)

    noteOff: ->
        t0 = @ctx.currentTime
        @eg.noteOff(t0)
        @feg.noteOff(t0)

    setKey: (freq_key) ->
        v.setKey(freq_key) for v in @vco

    setScale: (@scale) ->

    connect: (dst) ->
        @node.connect(@filter.lpf)
        @filter.connect(dst)

    setNote: (note) ->
        for v in @vco
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
        @gain_inputs.on("change",   () => @setGain())
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
        @setGain()

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

    setGain: ->
        for i in [0... @gain_inputs.length]
            @model.setGain(i, parseInt(@gain_inputs.eq(i).val()))



class @Synth
    constructor: (@ctx, @id, @player) ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @time = 0
        @scale = []
        @view = new SynthView(this)
        @core = new SynthCore(this, @ctx, @id)

    connect: (dst) -> @core.connect(dst)

    setDuration: (@duration) ->
    setKey:  (key) -> @core.setKey(key)
    setScale: (@scale) ->
    setNote: (note) -> @core.setNote(note)

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


class @SynthView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_synth').clone()
        @dom.attr('id', 'synth' + id)
        $("#instruments").append(@dom)

        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @page = 0
        @page_total = 1

        @last_time = 0
        @last_page = 0

        @pos_markers = @dom.find('.marker')  # list of list of markers
        @plus  = @dom.find('.pattern-plus')
        @minus = @dom.find('.pattern-minus')
        @setMarker()

        @canvas_hover_dom = @dom.find('.table-hover')
        @canvas_on_dom    = @dom.find('.table-on')
        @canvas_off_dom   = @dom.find('.table-off')

        @canvas_hover = @canvas_hover_dom[0]
        @canvas_on    = @canvas_on_dom[0]
        @canvas_off   = @canvas_off_dom[0]

        @ctx_hover = @canvas_hover.getContext('2d')
        @ctx_on    = @canvas_on.getContext('2d')
        @ctx_off   = @canvas_off.getContext('2d')

        @cell = new Image()
        @cell.src = 'static/img/sequencer_cell.png'
        @cell.onload = () => @initCanvas()

        @is_clicked = false
        @hover_pos = x:0, y:0
        @click_pos = x:0, y:0

        @initEvent()

    initCanvas: ->
        @canvas_hover.width  = @canvas_on.width  = @canvas_off.width  = 832
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 260
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top
        for i in [0...10]
            for j in [0...32]
                @ctx_off.drawImage(@cell,
                    0, 0, 26, 26,           # src (x, y, w, h)
                    j * 26, i * 26, 26, 26  # dst (x, y, w, h)
                )
        @readPattern(@pattern)

    getPos: (e) ->
        @rect = @canvas_off.getBoundingClientRect()
        x: Math.floor((e.clientX - @rect.left) / 26)
        y: Math.floor((e.clientY - @rect.top) / 26)

    initEvent: ->
        @canvas_hover_dom.on('mousemove', (e) =>
            pos = @getPos(e)
            if pos != @hover_pos
                @ctx_hover.clearRect(
                    @hover_pos.x * 26, @hover_pos.y * 26, 26, 26
                )
                @ctx_hover.drawImage(@cell,
                    52, 0, 26, 26,
                    pos.x * 26, pos.y * 26, 26, 26
                )
                @hover_pos = pos

            if @is_clicked and @click_pos != pos
                @addNote(pos.x, pos.y)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            if @pattern[pos.x] == pos.y
                @removeNote(pos.x)
            else
                @addNote(pos.x, pos.y)
        ).on('mouseup', (e) =>
            @is_clicked = false
        ).on('mouseout', (e) =>
            @ctx_hover.clearRect(
                @hover_pos.x * 26, @hover_pos.y * 26, 26, 26
            )
            @hover_pos = x: -1, y: -1
        )

        @plus.on('click', ( => @plusPattern()))
        @minus.on('click', ( =>
            if @pattern.length > 32
                @minusPattern()
        ))

    addNote: (x, y) ->
        note = 10 - y
        @pattern[@page * 32 + x] = note
        @model.addNote(@page * 32 + x, note)
        @ctx_on.clearRect(x * 26, 0, 26, 1000)
        @ctx_on.drawImage(@cell,
            26, 0, 26, 26,
            x * 26, y * 26, 26, 26
        )

    removeNote: (x) ->
        @pattern[@page * 32 + x] = 0
        @model.removeNote(@page * 32 + x)

    playAt: (@time) ->
        if @time % 32 == 0
            @drawPattern(@time)
        for i in [0...10]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
            )
            @ctx_off.drawImage(@cell,
                78, 0, 26, 26,
                (time % 32) * 26, i * 26, 26, 26
            )
        @last_time = time

    readPattern: (@pattern) ->
        @page = 0
        @page_total = @pattern.length / 32
        @drawPattern(0)
        @setMarker()

    drawPattern: (time) ->
        @time = time if time?
        @page = Math.floor(@time / 32)
        @ctx_on.clearRect(0, 0, 832, 260)
        for i in [0...32]
            y = 10 - @pattern[@page * 32 + i]
            @ctx_on.drawImage(
                @cell,
                26, 0, 26, 26,
                i * 26, y * 26, 26, 26
            )
        @setMarker()

    plusPattern: ->
        return if @page_total == 8
        @pattern = @pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        @page_total++
        @model.plusPattern()
        @drawPattern()

    minusPattern: ->
        return if @page_total == 1
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @page_total--
        @model.minusPattern()
        @drawPattern()

    setMarker: ->
        @pos_markers.filter((i) => i  < @page_total).show()
        @pos_markers.filter((i) => @page_total <= i).hide()
        @pos_markers.removeClass('marker-now').eq(@page).addClass('marker-now')

    play: ->
    stop: ->
        for i in [0...10]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
            )


    activate: (i) ->
        @is_active = true
        @initCanvas()

    inactivate: -> @is_active = false
