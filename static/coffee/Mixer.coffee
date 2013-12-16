class @Mixer
    constructor: (@ctx, @player) ->
        @gain_master = 1.0
        @gains = (s.getGain() for s in @player.synth)

        @node = @ctx.createGain()
        @node.gain.value = @gain_master
        @node.connect(@ctx.destination)

        @panners = []

        @view = new MixerView(this)

    addSynth: (synth) ->
        p = @ctx.createPanner()
        p.panningModel = "equalpower"
        synth.connect(p)
        p.connect(@node)
        @panners.push(p)
        @view.addSynth(synth)

    removeSynth: (i) ->
        @panners.splice(i)

    setGains: (@gains, @gain_master) ->
        for i in [0...@gains.length]
            @player.synth[i].setGain(@gains[i])
        @node.gain.value = @gain_master

    setPans: (pans, pan_master) ->
        for i in [0...pans.length]
            p = pans[i]
            @panners[i].setPosition(p[0], p[1], p[2])
