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

        @bus_delay = @ctx.createGain()
        @bus_delay.gain.value = 1.0
        @bus_delay.connect(@node_send)

        @bus_reverb = @ctx.createGain()
        @bus_reverb.gain.value = 1.0
        @bus_reverb.connect(@node_send)

        @gain_delay = []
        @gain_reverb = []

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
        @reverb = new Reverb(@ctx)
        @limiter = new Limiter(@ctx)

        @bus_delay.connect(@delay.in)
        @bus_reverb.connect(@reverb.in)

        @node_send.connect(@limiter.in)
        @delay.connect(@limiter.in)
        @reverb.connect(@limiter.in)

        @limiter.connect(@node)

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

        @delay_tracks = []
        @reverb_tracks = []

    addSynth: (synth) ->
        # Create new panner
        p = @ctx.createPanner()
        p.panningModel = "equalpower"
        synth.connect(p)
        p.connect(@node_send)
        @panners.push(p)

        g_delay = @ctx.createGain()
        g_reverb = @ctx.createGain()
        p.connect(g_delay)
        p.connect(g_reverb)
        g_delay.connect(@bus_delay)
        g_reverb.connect(@bus_reverb)
        g_delay.gain.value = 1.0
        g_reverb.gain.value = 1.0
        @gain_delay.push(g_delay)
        @gain_reverb.push(g_reverb)

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
