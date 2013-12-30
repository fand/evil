class @Mixer
    constructor: (@ctx, @player) ->
        @gain_master = 1.0
        @gain_tracks = (s.getGain() for s in @player.synth)

        @node = @ctx.createGain()
        @node.gain.value = @gain_master
        @node.connect(@ctx.destination)

        @panners = []

        @view = new MixerView(this)

    empty: ->
        @gain_tracks = []
        @panners = []
        @view.empty()

    addSynth: (synth) ->
        # Create new panner
        p = @ctx.createPanner()
        p.panningModel = "equalpower"
        synth.connect(p)
        p.connect(@node)
        @panners.push(p)

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
