class @MixerView
    constructor: (@model) ->
        @dom = $('#mixer')

        @tracks = $('#mixer-tracks')
        @master = $('#mixer-master')
        @console_tracks = @tracks.find('#console-tracks')
        @console_master= @master.find('#console-master')

        @gains = @tracks.find('.console-track > .gain-slider')
        @gain_master = @master.find('.console-track > .gain-slider')

        @pans = @tracks.find('.console-track > .pan-slider')
        @pan_master = @master.find('.console-track > .pan-slider')

        @canvas_tracks_dom = @tracks.find('.vu-meter')
        @canvas_tracks = (d[0] for d in @canvas_tracks_dom)
        @ctx_tracks = (c.getContext('2d') for c in @canvas_tracks)
        for c in @canvas_tracks
            [c.width, c.height] = [70, 110]

        @canvas_master_dom = @master.find('.vu-meter')
        @canvas_master = @canvas_master_dom[0]
        @ctx_master = @canvas_master.getContext('2d')
        @canvas_master.width = 70
        @canvas_master.height = 110

        @track_dom = $('#templates > .console-track')
        @initEvent()


    initEvent: ->
        @console_tracks.on('change', () => @setParams())
        @console_master.on('change', () => @setParams())

    drawGainTracks: (i, data) ->
        v = Math.max.apply(null, data)
        h = (v - 128) / 128 * 110

        @ctx_tracks[i].clearRect(0, 0, 70, 110)
        @ctx_tracks[i].fillStyle = '#0df'
        @ctx_tracks[i].fillRect(50,  110 - h, 10, h)

    drawGainMaster: (data_l, data_r) ->
        v_l = Math.max.apply(null, data_l)
        v_r = Math.max.apply(null, data_r)
        h_l = (v_l - 128) / 128 * 110
        h_r = (v_r - 128) / 128 * 110

        @ctx_master.clearRect(0, 0, 70, 110)
        @ctx_master.fillStyle = '#0df'
        @ctx_master.fillRect(0,  110 - h_l, 10, h_l)
        @ctx_master.fillRect(60, 110 - h_r, 10, h_r)

    addSynth: (synth) ->
        dom = @track_dom.clone()
        @console_tracks.append(dom)
        @pans.push(dom.find('.pan-slider'))
        @gains.push(dom.find('.gain-slider'))

        d = dom.find('.vu-meter')
        @canvas_tracks_dom.push(d)
        @canvas_tracks.push(d[0])
        @ctx_tracks.push(d[0].getContext('2d'))
        [d[0].width, d[0].height] = [70, 110]

        @console_tracks.css(width: (@gains.length * 80 + 2) + 'px')
        @console_tracks.on('change', () => @setGains())

        @setParams()

    setGains: ->
        g = (parseFloat(_g.val()) / 100.0 for _g in @gains)
        g_master = parseFloat(@gain_master.val() / 100.0)
        @model.setGains(g, g_master)

    setPans: ->
        p = (@pan2pos(1.0 - (parseFloat(_p.val())) / 100.0) for _p in @pans)
        p_master = @pan2pos(1.0 - parseFloat(@pan_master.val() / 100.0))
        @model.setPans(p, p_master)

    readGains: (g, g_master) ->
        for i in [0...g.length]
            @gains[i].val(g[i] * 100.0)
        @gain_master.val(g_master * 100.0)

    readPans: (p, p_master)->
        for i in [0...p.length]
            @pans[i].val(@pos2pan(1.0 - (p[i] * 100.0)))
        # @pan_master.val(@pos2pan(1.0 - (p_master[i] * 100.0)))

    setParams: ->
        @setGains()
        @setPans()

    displayGains: (gains) ->

    pan2pos: (v) ->
        theta = v * Math.PI
        [Math.cos(theta), 0, -Math.sin(theta)]

    pos2pan: (v) ->
        Math.acos(v[0]) / Math.PI

    empty: ->
        @console_tracks.empty()
        @pans = []
        @gains = []
