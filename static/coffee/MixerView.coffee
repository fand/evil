class @MixerView
    constructor: (@model) ->
        @dom = $('#mixer')

        @canvas_bank_dom    = $('#mixer-bank')
        @canvas_session_dom = $('#mixer-session')

        @session_wrapper = $('#mixer-session-wrapper')
        @mixer = $('#mixer-mixer')
        @gain_master = @dom.find('.mixer-gain-master > input')

        @canvas_session = @canvas_session_dom[0]
        @ctx_session = @canvas_session.getContext('2d')

        @initEvent()

    initCanvas: ->
        @canvas_session.width  = @canvas_mixer.width  = 832
        @canvas_session.height = @canvas_mixer.height = 260

        @rect = @canvas_session.getBoundingClientRect()

        for i in [0...10]
            for j in [0...32]
                @ctx_off.drawImage(@cell,
                    0, 0, 26, 26,           # src (x, y, w, h)
                    j * 26, i * 26, 26, 26  # dst (x, y, w, h)
                )
        @readPattern(@pattern)

    initEvent: ->
        @mixer.on('change', () =>    @setGains())

    redraw: (synth) ->
        @mixer.remove('mixer-gain')
        for s in @synth
            dom = $('<div class="mixer-gain"><input class="gain-slider" type="range" min="0" max="100" value="100" /></div>')
            @mixer.append(dom)

    addSynth: (synth) ->
        dom = $('<div class="mixer-gain"><input class="gain-slider" type="range" min="0" max="100" value="100" /></div>')
        @mixer.append(dom)
        @mixer.on('change', () => @setGains())

    setGains: ->
        console.log(@gain_master)
        gains = (parseFloat(g.value) / 100.0 for g in @mixer.find('.mixer-gain > input'))
        gain_master = parseFloat(@gain_master.val() / 100.0)
        @model.setGains(gains, gain_master)

    displayGains: (gains) ->
