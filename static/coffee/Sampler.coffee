@SAMPLES =
    'kick1':  url: 'static/wav/kick1.wav'
    'kick2':  url: 'static/wav/kick2.wav'
    'snare1': url: 'static/wav/snare1.wav'
    'snare2': url: 'static/wav/snare2.wav'
    'clap':   url: 'static/wav/clap.wav'
    'hat_closed': url: 'static/wav/hat_closed.wav'
    'hat_open': url: 'static/wav/hat_open.wav'
    'ride': url: 'static/wav/ride.wav'

SAMPLES_DEFAULT = ['kick1', 'kick2', 'snare1', 'snare2', 'clap', 'hat_closed', 'hat_open', 'ride']



class @SampleNode
    constructor: (@ctx, @id, @parent) ->
        @out = @ctx.createGain()
        @out.gain.value = 1.0
        @name = SAMPLES_DEFAULT[@id]
        @setSample(@name)

        @head = 0.0
        @tail = 1.0
        @speed = 1.0

        # for mono source
        @merger = @ctx.createChannelMerger(2)

        # node to set gain for individual nodes
        @node_buf = @ctx.createGain()
        @node_buf.gain.value = 1.0

        @eq_gains = [0.0, 0.0, 0.0]

        [eq1, eq2, eq3] = [@ctx.createBiquadFilter(), @ctx.createBiquadFilter(), @ctx.createBiquadFilter()]
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf']
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6]
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000]
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = @eq_gains
        @eq_nodes = [eq1, eq2, eq3]

        @panner = new Panner(@ctx)
        @pan_value = 0.5

        @node_buf.connect(eq1)
        eq1.connect(eq2)
        eq2.connect(eq3)
        eq3.connect(@panner.in)
        @panner.connect(@out)


    setSample: (@name) ->
        sample = SAMPLES[@name]
        return if not sample?
        @sample = sample
        if sample.data?
            @buffer = sample.data
        else
            req = new XMLHttpRequest()
            req.open('GET', sample.url, true)
            req.responseType = "arraybuffer"
            req.onload = () =>
                @ctx.decodeAudioData(
                    req.response,
                    ((@buffer) =>
                        @buffer_duration = (@buffer.length / window.SAMPLE_RATE)
                        @parent.sampleLoaded(@id)
                    ),
                    (err) => console.log('ajax error'); console.log(err)
                )
                sample.data = @buffer
            req.send()

    connect: (@dst) -> @out.connect(@dst)

    noteOn: (gain, time) ->
        return if not @buffer?
        @source_old.stop(time) if @source_old?
        source = @ctx.createBufferSource()
        source.buffer = @buffer

        # source.connect(@node_buf)            # for mono source
        source.connect(@merger, 0, 0)     # for stereo source
        source.connect(@merger, 0, 1)
        @merger.connect(@node_buf)

        head_time = time + @buffer_duration * @head
        tail_time = time + @buffer_duration * @tail
        source.playbackRate.value = @speed
        source.start(0)
        @node_buf.gain.value = gain
        @source_old = source

    setTimeParam: (@head, @tail, @speed) ->
    getTimeParam: -> [@head, @tail, @speed]

    setEQParam: (@eq_gains) ->
        [@eq_nodes[0].gain.value, @eq_nodes[1].gain.value, @eq_nodes[2].gain.value] = (g * 0.2 for g in @eq_gains)

    getEQParam: -> @eq_gains

    setOutputParam: (@pan_value, gain) ->
        @panner.setPosition(@pan_value)
        @node.gain.value = gain

    getOutputParam: ->
        [@pan_value, @node.gain.value]

    getData: -> @buffer

    getParam: ->
        wave: @sample.name, time: @getTimeParam(), gains: @eq_gains, output: @getOutputParam()

    readParam: (p) ->
        @setSample(p.wave) if p.wave?
        @setTimeParam(p.time[0], p.time[1], p.time[2]) if p.time?
        @setEQParam(p.gains) if p.gains?
        @setOutputParam(p.output[0], p.output[1]) if p.output?




class @SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @gain = 1.0
        @is_mute = false

        @samples = (new SampleNode(@ctx, i, this) for i in [0...10])

        for i in [0...10]
            @samples[i].connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    noteOn: (notes) ->
        return if @is_mute
        time = @ctx.currentTime
        if Array.isArray(notes)
            # return if notes.length == 0
            @samples[n[0] - 1].noteOn(n[1], time) for n in notes
        # else
        #     @samples[notes - 1].noteOn(1, time)

    noteOff: ->
        t0 = @ctx.currentTime

    connect: (dst) ->
        @node.connect(dst)

    setSample: (i, name) -> @samples[i].setSample(name)

    setSampleTimeParam: (i, head, tail, speed) ->
        @samples[i].setTimeParam(head, tail, speed)

    setSampleEQParam: (i, lo, mid, hi) ->
        @samples[i].setEQParam([lo, mid, hi])

    setSampleOutputParam: (i, pan, gain) ->
        @samples[i].setOutputParam(pan, gain)

    setGain: (@gain) ->
        @node.gain.value = @gain

    getSampleTimeParam: (i) ->
        @samples[i].getTimeParam()

    getSampleData: (i) ->
        @samples[i].getData()

    getSampleEQParam: (i) ->
        @samples[i].getEQParam()

    getSampleOutputParam: (i) ->
        @samples[i].getOutputParam()

    sampleLoaded: (id) ->
        @view.updateWaveformCanvas(id)

    bindSample: (sample_now) ->
        @view.updateWaveformCanvas(sample_now)
        @view.updateEQCanvas()
        @view.readSampleTimeParam(@getSampleTimeParam(sample_now))
        @view.readSampleEQParam(@getSampleEQParam(sample_now))
        @view.readSampleOutputParam(@getSampleOutputParam(sample_now))

    getParam: ->
        type: 'SAMPLER'
        samples: (s.getParam() for s in @samples)

    readParam: (p) ->
        if p.samples?
            for i in [0...p.samples.length]
                @samples[i].readParam(p.samples[i])
        @bindSample(0)


    mute:   -> @is_mute = true
    demute: -> @is_mute = false



class @Sampler
    constructor: (@ctx, @id, @player, @name) ->
        @type = 'SAMPLER'
        @name = 'Sampler #' + @id if not @name?

        @pattern_name = 'pattern 0'
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj = name: @pattern_name, pattern: @pattern

        @time = 0
        @view = new SamplerView(this, @id)
        @core = new SamplerCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

        @send = @ctx.createGain()
        @send.gain.value = 1.0
        @return = @ctx.createGain()
        @return.gain.value = 1.0
        @core.connect(@send)
        @send.connect(@return)

        @effects = []


    connect: (dst) ->
        if dst instanceof Panner
            @return.connect(dst.in)
        else
            @return.connect(dst)


    setDuration: ->
    setKey:  ->
    setScale: ->
    setNote: (note) -> @core.setNote(note)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note) ->
        @core.noteOn([[note, 1.0]])

    noteOff: -> @core.noteOff()

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        if @pattern[mytime] != 0
            notes = @pattern[mytime]
            @core.noteOn(notes)

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
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj.pattern = @pattern
        @view.readPattern(@pattern_obj)

    plusPattern: ->
        @pattern = @pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]])
        @player.resetSceneLength()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.resetSceneLength()

    addNote: (time, note, gain) ->
        if not Array.isArray(@pattern[time])
            @pattern[time] = [[@pattern[time], 1.0]]

        for i in [0...@pattern[time].length]
            if @pattern[time][i][0] == note
                @pattern[time].splice(i, 1)

        @pattern[time].push([note, gain])

    removeNote: (pos) ->
        for i in [0...@pattern[pos.x_abs].length]
            if @pattern[pos.x_abs][i][0] == pos.note
                @pattern[pos.x_abs].splice(i, 1)

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

    selectSample: (sample_now) ->
        @core.bindSample(sample_now)

    replaceWith: (s_new) ->
        @view.dom.replaceWith(s_new.view.dom)


    getParam: ->
        p = @core.getParam()
        p.name = @name
        p.effects = @getEffectsParam()
        return p

    readParam: (p) -> @core.readParam(p) if p?

    mute:   -> @core.mute()
    demute: -> @core.demute()

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
        @effects.push(fx)
