class @Mixer
    constructor: (@ctx, @player) ->
        @gain_master = 1.0
        @gains = (s.getGain() for s in @player.synth)

        @node = @ctx.createGain()
        @node.gain.value = @gain_master
        @node.connect(@ctx.destination)

        @view = new MixerView(this)

    addSynth: (synth) ->
        synth.connect(@node)
        @view.addSynth(synth)

    # removeSynth: () ->

    # setGain: (i, val) ->
    #     @gains[i] = val
    #     @player.synth[i].setGain(val)
    #     console.log(val)

    setGains: (@gains, @gain_master) ->
        for i in [0...@gains.length]
            @player.synth[i].setGain(@gains[i])
        @node.gain.value = @gain_master
        console.log(@gain_master)
