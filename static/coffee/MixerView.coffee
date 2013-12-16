class @MixerView
    constructor: (@model) ->
        @dom = $('#mixer')

        @canvas_bank_dom    = $('#mixer-bank')
        @canvas_session_dom = $('#mixer-session')

        @session_wrapper = $('#mixer-session-wrapper')
        @mixer = $('#mixer-mixer')

        @gains = @dom.find('.mixer-track > .gain-slider')
        @gain_master = @dom.find('.mixer-track-master > .gain-slider')

        @pans = @dom.find('.mixer-track > .pan-slider')
        @pan_master = @dom.find('.mixer-track-master > .pan-slider')

        @canvas_session = @canvas_session_dom[0]
        @ctx_session = @canvas_session.getContext('2d')

        @track_dom = $('#templates > .mixer-track')
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
        @mixer.on('change', () =>    @setParams())

    redraw: (synth) ->
        @mixer.remove('mixer-track')
        for s in @synth
            @mixer.append(@track_dom.clone())

    addSynth: (synth) ->
        dom = @track_dom.clone()
        @mixer.append(dom)
        @pans.push(dom.find('.pan-slider'))
        @gains.push(dom.find('.gain-slider'))
        @mixer.on('change', () => @setGains())
        @setParams()

    setGains: ->
        g = (parseFloat(_g.val()) / -100.0 for _g in @gains)
        g_master = parseFloat(@gain_master.val() / 100.0)
        @model.setGains(g, g_master)

    setPans: ->
        p = (@pan2pos(1.0 - (parseFloat(_p.val())) / 100.0) for _p in @pans)
        p_master = @pan2pos(1.0 - parseFloat(@pan_master.val() / 100.0))
        @model.setPans(p, p_master)

    setParams: ->
        @setGains()
        @setPans()

    displayGains: (gains) ->

    pan2pos: (v) ->
        theta = v * Math.PI
        [Math.cos(theta), 0, -Math.sin(theta)]
