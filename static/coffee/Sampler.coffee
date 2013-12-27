@SAMPLES = [
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick1', url: 'static/wav/kick1.wav'},
    {name: 'kick2', url: 'static/wav/kick2.wav'},
    {name: 'snare1', url: 'static/wav/snare1.wav'},
    {name: 'snare2', url: 'static/wav/snare2.wav'},
    {name: 'clap', url: 'static/wav/clap.wav'},
    {name: 'hat_closed', url: 'static/wav/hat_closed.wav'},
    {name: 'hat_open', url: 'static/wav/hat_open.wav'},
    {name: 'ride', url: 'static/wav/ride.wav'}
]



class @BufferNode
    constructor: (@ctx, @id, @parent) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        sample = window.SAMPLES[@id]
        @setSample(sample)

        @head = 0.0
        @tail = 1.0
        @speed = 1.0

        @eq_gains = [0.0, 0.0, 0.0]

        [eq1, eq2, eq3] = [@ctx.createBiquadFilter(), @ctx.createBiquadFilter(), @ctx.createBiquadFilter()]
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf']
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6]
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000]
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = @eq_gains
        @eq_nodes = [eq1, eq2, eq3]

        @panner = @ctx.createPanner()

        eq1.connect(eq2)
        eq2.connect(eq3)
        eq3.connect(@panner)
        @panner.connect(@node)

    setSample: (sample) ->
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

    connect: (@dst) -> @node.connect(@dst)

    noteOn: (gain, time) ->
        return if not @buffer?
        source = @ctx.createBufferSource()
        source.buffer = @buffer
        node = @ctx.createGain()
        source.connect(node)
        node.connect(@eq_nodes[0])

        head_time = time + @buffer_duration * @head
        tail_time = time + @buffer_duration * @tail
        source.start(0)
        node.gain.setValueAtTime(0, time)
        node.gain.linearRampToValueAtTime(gain, head_time + 0.001)
        node.gain.setValueAtTime(gain, tail_time)
        node.gain.linearRampToValueAtTime(0, tail_time + 0.001)

    setParam: (@head, @tail, @speed) ->
    getParam: -> [@head, @tail, @speed]

    setEQParam: (@eq_gains) ->
        [@eq_nodes[0].gain.value, @eq_nodes[1].gain.value, @eq_nodes[2].gain.value] = (g * 0.2 for g in @eq_gains)

    getEQParam: -> @eq_gains

    getData: -> @buffer


class @ResFilter
    constructor: (@ctx) ->
        @lpf = @ctx.createBiquadFilter()
        @lpf.type = 'lowpass'  # lowpaegss == 0
        @lpf.gain.value = 1.0

    connect:    (dst)  -> @lpf.connect(dst)
    getResonance:      -> @lpf.Q.value
    setQ: (Q) -> @lpf.Q.value = Q



class @SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @gain = 1.0

        @nodes = (new BufferNode(@ctx, i, this) for i in [0...10])
        @gains = (@ctx.createGain() for i in [0...10])

        for i in [0...10]
            @nodes[i].connect(@gains[i])
            @gains[i].gain.value = 1.0
            @gains[i].connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    setSampleParam: (i, head, tail, speed) ->
        @nodes[i].setParam(head, tail, speed)

    setSampleEQParam: (i, lo, mid, hi) ->
        @nodes[i].setEQParam([lo, mid, hi])

    setSampleGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gains[i].gain.value = (gain / 100.0) * 0.11

    setGain: (@gain) ->
        @node.gain.value = @gain

    noteOn: (notes) ->
        time = @ctx.currentTime
        if Array.isArray(notes)
            @nodes[n[0]].noteOn(n[1], time) for n in notes
        else
            @nodes[notes].noteOn(1, time)

    noteOff: ->
        t0 = @ctx.currentTime

    setKey: (key) ->
    setScale: (scale) ->

    connect: (dst) ->
        @node.connect(dst)

    setNote: (note) ->
        for n in @nodes
            n.setNote(note)
            n.setFreq()

    getSampleParam: (i) ->
        @nodes[i].getParam()

    getSampleData: (i) ->
        @nodes[i].getData()

    getSampleEQParam: (i) ->
        @nodes[i].getEQParam()

    sampleLoaded: (id) ->
        @view.updateWaveformCanvas(id)


class @Sampler
    constructor: (@ctx, @id, @player, @name) ->
        @name = 'Sampler #' + @id if not @name?

        @pattern_name = 'pattern 0'
        # @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern = [
            [[1,1]],0,0,0,[[7,1]],0,0,0,[[1,1],[6,1]],0,0,0,[[7,1]],0,0,0,
            [[1,1]],0,0,0,[[7,1]],0,0,0,[[1,1],[6,1]],0,0,0,[[7,1]],0,0,0,
            [[1,1]],0,0,0,[[7,1]],0,0,0,[[1,1],[6,1]],0,0,0,[[7,1]],0,0,0,
            [[1,1]],0,0,0,[[7,1]],0,0,0,[[1,1],[6,1]],0,0,0,[[7,1]],0,0,0
        ]
        @pattern_obj = name: @pattern_name, pattern: @pattern

        @time = 0
        @view = new SamplerView(this, @id)
        @core = new SamplerCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

    connect: (dst) ->
        @core.connect(dst)

    setDuration: ->
    setKey:  ->
    setScale: ->
    setNote: (note) -> @core.setNote(note)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note) ->
        @core.setNote(note)
        @core.noteOn()

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
