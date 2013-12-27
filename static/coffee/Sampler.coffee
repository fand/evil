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
    constructor: (@ctx, num) ->
        @node = @ctx.createGain()
        @node.gain.value = 0.0
        sample = window.SAMPLES[num]
        @setSample(sample)

        @head = 0
        @tail = 100
        @speed = 1.0

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
                    (@buffer) =>,
                    (err) => console.log('ajax error'); console.log(err)
                )
                sample.data = @buffer
            req.send()

    connect: (@dst) -> @node.connect(@dst)
    noteOn: (gain) ->
        return if not @buffer?
        source = @ctx.createBufferSource()
        source.buffer = @buffer
        source.connect(@node)
        @node.gain.value = gain if gain?
        source.start(0)

    setParam: (@head, @tail, @speed) ->
    getParam: -> [@head, @tail, @speed]

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

        @nodes = (new BufferNode(@ctx, i) for i in [0...10])
        @gains = (@ctx.createGain() for i in [0...10])

        for i in [0...10]
            @nodes[i].connect(@gains[i])
            @gains[i].gain.value = 1.0
            @gains[i].connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    setSampleParam: (i, head, tail, speed) ->
        @nodes[i].setParam(head, tail, speed)

    setSampleGain: (i, gain) ->
        ## Keep total gain <= 0.9
        @gains[i].gain.value = (gain / 100.0) * 0.11

    setGain: (@gain) ->
        @node.gain.value = @gain

    noteOn: (notes) ->
        if Array.isArray(notes)
            @nodes[n[0]].noteOn(n[1]) for n in notes
        else
            @nodes[notes].noteOn(1)

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
