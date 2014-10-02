class @Mixer
    constructor: (@ctx, @player) ->
        @gain_master = 1.0
        @gain_tracks = (s.getGain() for s in @player.synth)

        @out = @ctx.createGain()
        @out.gain.value = @gain_master

        @send = @ctx.createGain()
        @send.gain.value = 1.0

        @return = @ctx.createGain()
        @return.gain.value = 1.0

        @panners = []
        @analysers = []

        # Master VU meter
        @splitter_master = @ctx.createChannelSplitter(2)
        @analyser_master = [@ctx.createAnalyser(), @ctx.createAnalyser()]
        @out.connect(@splitter_master)
        for i in [0,1]
            @splitter_master.connect(@analyser_master[i], i)
            @analyser_master[i].fftSize = 1024
            @analyser_master[i].minDecibels = -100.0
            @analyser_master[i].maxDecibels = 0.0
            @analyser_master[i].smoothingTimeConstant = 0.0

        # Master Effects
        @limiter = new Limiter(@ctx)

        @send.connect(@return)
        @return.connect(@limiter.in)
        @limiter.connect(@out)

        @effects_master = []

        @out.connect(@ctx.destination)

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
        @analysers = []
        @view.empty()

    addSynth: (synth) ->
        # Create new panner
        p = new Panner(@ctx)
        synth.connect(p.in)
        p.connect(@send)
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
        @out.gain.value = @gain_master

    setPans: (@pan_tracks, @pan_master) ->
        for i in [0...@pan_tracks.length]
            @panners[i].setPosition(@pan_tracks[i])

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
        synth.connect(@panners[id].in)
        synth.connect(@analysers[id])

        # a = @ctx.createAnalyser()
        # synth.connect(a)
        # @analysers[id] = a


    # You should Mute / Solo by sending messages to Synth / Samplers.
    # (for better timing)

    # solo: (id) ->
    #     return if id >= @panners.length
    #     for i in [0...@panners.length]
    #         @panners[i].disconnect() if i != id

    # desolo: (id) ->
    #     return if id >= @panners.length
    #     for i in [0...@panners.length]
    #         @panners[i].connect(@out)

    # mute: (id) ->
    #     @panners[id].disconnect()

    # demute: (id) ->
    #     @panners[id].connect(@out)


    addMasterEffect: (name) =>
        if name == 'Fuzz'
            fx = new Fuzz(@ctx)
        else if name == 'Delay'
            fx = new Delay(@ctx)
        else if name == 'Reverb'
            fx = new Reverb(@ctx)
        else if name == 'Comp'
            fx = new Compressor(@ctx)
        else if name == 'Double'
            fx = new Double(@ctx)

        pos = @effects_master.length
        if pos == 0
            @send.disconnect()
            @send.connect(fx.in)
        else
            @effects_master[pos - 1].disconnect()
            @effects_master[pos - 1].connect(fx.in)

        fx.connect(@return)
        fx.setSource(this)
        @effects_master.push(fx)

        return fx

    addTracksEffect: (x, name) ->
        if name == 'Fuzz'
            fx = new Fuzz(@ctx)
        else if name == 'Delay'
            fx = new Delay(@ctx)
        else if name == 'Reverb'
            fx = new Reverb(@ctx)
        else if name == 'Comp'
            fx = new Compressor(@ctx)
        else if name == 'Double'
            fx = new Double(@ctx)

        @player.synth[x].insertEffect(fx)
        return fx

    removeEffect: (fx) ->

        i = @effects_master.indexOf(fx)
        return if i == -1

        if i == 0
            prev = @send
        else
            prev = @effects_master[i - 1]

        prev.disconnect()
        if @effects_master[i + 1]?
            prev.connect(@effects_master[i + 1])
        else
            prev.connect(@return)

            fx.disconnect()

        @effects_master.splice(i, 1)
