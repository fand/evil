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

        @track_dom = $('#templates > .console-track')
        @initEvent()

    initEvent: ->
        @console_tracks.on('change', () => @setParams())
        @console_master.on('change', () => @setParams())

    addSynth: (synth) ->
        dom = @track_dom.clone()
        @console_tracks.append(dom)
        @pans.push(dom.find('.pan-slider'))
        @gains.push(dom.find('.gain-slider'))
        @console_tracks.css(width: (@gains.length * 80 + 2) + 'px')
#        @canvas_tracks.css(width: (@gains.length * 80 + 2) + 'px')
        @console_tracks.on('change', () => @setGains())

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
