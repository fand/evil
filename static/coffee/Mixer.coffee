class @FX
    constructor: (@ctx) ->
        @in = @ctx.createGain()
        @in.gain.value = 0.0
        @out = @ctx.createGain()
        @out.gain.value = 1.0

    insert: (src, dst) ->
        src.connect(@in)
        @out.connect(dst)

    setInput:  (d) -> @in.gain.value = d
    setOutput: (d) -> @out.gain.value = d


class @Delay extends @FX
    constructor: (@ctx) ->
        super(@ctx)
        @delay = @ctx.createDelay()
        @delay.delayTime.value = 0.23
        # @hi = @ctx.createBiquadFilter()
        # @lo = @ctx.createBiquadFilter()
        @feedback = @ctx.createGain()
        @feedback.gain.value = 0.4
        @in.connect(@delay)
        @delay.connect(@out)
        @delay.connect(@feedback)
        @feedback.connect(@delay)


    setDelay: (d) -> @delay.delayTime.value = d
    setFeedback: (d) -> @feedback.gain.value = d

    setParam: (p) ->
        @setDelay(p.delay) if p.delay?
        @setFeedback(p.feedback) if p.feedback?
        @setInput(p.input) if p.input?
        @setOutput(p.output) if p.output?

IR_URL =
    'binaural_1': 'static/IR/binaural/s1_r1_b.wav'
    'binaural_2': 'static/IR/binaural/s1_r2_b.wav'
    'binaural_3': 'static/IR/binaural/s1_r3_b.wav'
    'binaural_4': 'static/IR/binaural/s1_r4_b.wav'
    'binaural_4': 'static/IR/binaural/s1_r4_b.wav'
    'BIG_SNARE':  'static/IR/H3000/206_BIG_SNARE.wav'

IR_LOADED = {}



class @Reverb extends @FX
    constructor: (@ctx) ->
        super(@ctx)
        @reverb = @ctx.createConvolver()
        @in.connect(@reverb)
        @reverb.connect(@out)
        @reverb.connect(@ctx.destination)
        @setIR('BIG_SNARE')
        @in.gain.value = 1.0
        @out.gain.value = 1.0

    setIR: (name) ->
        if IR_LOADED[name]?
            @reverb.buffer = IR_LOADED[name]
            return

        url = IR_URL[name]
        return if not url?

        req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.responseType = "arraybuffer"
        req.onload = () =>
            @ctx.decodeAudioData(
                req.response,
                ((buffer) =>
                    @reverb.buffer = buffer
                    IR_LOADED[name] = buffer
                ),
                (err) => console.log('ajax error'); console.log(err)
            )
        req.send()

    setParam: (p) ->
        @setIR(p.name) if p.name?
        @setInput(p.input) if p.input?
        @setOutput(p.output) if p.output?



class @Mixer
    constructor: (@ctx, @player) ->
        @gain_master = 1.0
        @gain_tracks = (s.getGain() for s in @player.synth)

        @node = @ctx.createGain()
        @node.gain.value = @gain_master
        @node.connect(@ctx.destination)

        @node_send = @ctx.createGain()
        @node_send.gain.value = 1.0
        @node_send.connect(@node)

        @panners = []
        @analysers = []

        # Master VU meter
        @splitter_master = @ctx.createChannelSplitter(2)
        @analyser_master = [@ctx.createAnalyser(), @ctx.createAnalyser()]
        @node.connect(@splitter_master)
        for i in [0,1]
            @splitter_master.connect(@analyser_master[i], i)
            @analyser_master[i].fftSize = 1024
            @analyser_master[i].minDecibels = -100.0
            @analyser_master[i].maxDecibels = 0.0
            @analyser_master[i].smoothingTimeConstant = 0.0

        # Master Effects
        @delay = new Delay(@ctx)
        @delay.insert(@node_send, @node)
        @reverb = new Reverb(@ctx)
        @reverb.insert(@node_send, @node)


        @view = new MixerView(this)

        setInterval(( =>
            @drawGains()
        ), 30)

    drawGains: ->
        # Tracks
        for i in [0...@analysers.length]
            data = new Uint8Array(@analysers[i].frequencyBinCount)
            @analysers[i].getByteTimeDomainData(data)
            @view.drawGainTracks(i, data)

        # Master
        data_l = new Uint8Array(@analyser_master[0].frequencyBinCount)
        data_r = new Uint8Array(@analyser_master[1].frequencyBinCount)
        @analyser_master[0].getByteTimeDomainData(data_l)
        @analyser_master[1].getByteTimeDomainData(data_r)
        @view.drawGainMaster(data_l, data_r)


    empty: ->
        @gain_tracks = []
        @panners = []
        @view.empty()

    addSynth: (synth) ->
        # Create new panner
        p = @ctx.createPanner()
        p.panningModel = "equalpower"
        synth.connect(p)
        p.connect(@node_send)
        @panners.push(p)

        a = @ctx.createAnalyser()
        synth.connect(a)
        @analysers.push(a)

        @view.addSynth(synth)

    removeSynth: (i) ->
        @panners.splice(i)

    setGains: (@gain_tracks, @gain_master) ->
        for i in [0...@gain_tracks.length]
            @player.synth[i].setGain(@gain_tracks[i])
        @node.gain.value = @gain_master

    setPans: (@pan_tracks, @pan_master) ->
        for i in [0...@pan_tracks.length]
            p = @pan_tracks[i]
            @panners[i].setPosition(p[0], p[1], p[2])

    readGains: (@gain_tracks, @gain_master) ->
        @setGains(@gain_tracks, @gain_master)
        @view.readGains(@gain_tracks, @gain_master)

    readPans: (@pan_tracks, @pan_master) ->
        @setPans(@pan_tracks, @pan_master)
        @view.readPans(@pan_tracks, @pan_master)

    getParam: ->
        gain_tracks: @gain_tracks, gain_master: @gain_master, pan_tracks: @pan_tracks, pan_master: @pan_master

    readParam: (p) ->
        return if not p?
        @readGains(p.gain_tracks, p.gain_master)
        @readPans(p.pan_tracks, p.pan_master)

    changeSynth: (id, synth) ->
        synth.connect(@panners[id])
        synth.connect(@analysers[id])


    # You should Mute / Solo by sending messages to Synth / Samplers.
    # (for better timing)

    # solo: (id) ->
    #     return if id >= @panners.length
    #     for i in [0...@panners.length]
    #         @panners[i].disconnect() if i != id

    # desolo: (id) ->
    #     return if id >= @panners.length
    #     for i in [0...@panners.length]
    #         @panners[i].connect(@node)

    # mute: (id) ->
    #     @panners[id].disconnect()

    # demute: (id) ->
    #     @panners[id].connect(@node)
