class @SessionView
    constructor: (@model) ->
        @canvas_tracks_dom = $('#session-tracks')
        @canvas_master_dom = $('#session-master')
        @canvas_tracks_hover_dom = $('#session-tracks-hover')
        @canvas_master_hover_dom = $('#session-master-hover')

        @canvas_tracks = @canvas_tracks_dom[0]
        @canvas_master = @canvas_master_dom[0]
        @canvas_tracks_hover = @canvas_tracks_hover_dom[0]
        @canvas_master_hover = @canvas_master_hover_dom[0]

        @ctx_tracks = @canvas_tracks.getContext('2d')
        @ctx_master = @canvas_master.getContext('2d')
        @ctx_tracks_hover = @canvas_tracks_hover.getContext('2d')
        @ctx_master_hover = @canvas_master_hover.getContext('2d')

        @w = 80
        @h = 22
        @color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']

        # @cell_hover = new Image()
        # @cell.src = 'static/img/session_cell.png'
        # @cell.onload = () => @initCanvas()

        @initCanvas()
        @initEvent()

    initCanvas: ->
        @canvas_tracks.width = @canvas_tracks_hover.width = @w * 8 + 1
        @canvas_master.width = @canvas_master_hover.width = @w + 1
        @canvas_tracks.height = @canvas_master.height = @h*15 + 10
        @canvas_tracks_hover.height = @canvas_master_hover.height = @h*15 + 10

        @offset_y = 20
        @ctx_tracks.translate(0, @offset_y)
        @ctx_master.translate(0, @offset_y)
        @ctx_tracks_hover.translate(0, @offset_y)
        @ctx_master_hover.translate(0, @offset_y)

        @font_size = 12
        @ctx_tracks.font = @ctx_master.font = @font_size + 'px "ＭＳ Ｐゴシック"';

        @rect_tracks = @canvas_tracks_hover.getBoundingClientRect()
        @rect_master = @canvas_master_hover.getBoundingClientRect()
        @offset_translate = 700 + @offset_y

    getPos: (rect, e) ->
        _x = Math.floor((e.clientX - rect.left) / @w)
        _y = Math.floor((e.clientY - rect.top - @offset_translate) / @h)
        x: _x
        y: _y

    initEvent: ->

        @canvas_tracks_hover_dom.on('mousemove', (e) =>
            pos = @getPos(@rect_tracks, e)
        )
        @canvas_master_hover_dom.on('mousemove', (e) =>
            pos = @getPos(@rect_master, e)
        )


    readSong: (song) ->
        for x in [0...Math.max(song.tracks.length + 1, 8)]
            t = song.tracks[x]
            @drawTrackName(@ctx_tracks, t.name, x) if t? and t.name?
            for y in [0...Math.max(song.length, 10)]
                if t? and t.patterns[y]?
                    @drawCell(@ctx_tracks, t.patterns[y], x, y)
                else
                    @drawEmpty(@ctx_tracks, x, y)

        for y in [0...Math.max(song.master.length, 10)]
            if song.master[y]?
                @drawCell(@ctx_master, song.master[y], 0, y)
            else
                @drawEmpty(@ctx_master, 0, y)

        @drawScene(0)

    drawCell: (ctx, p, x, y) ->
        @clearCell(ctx, x, y)
        ctx.fillStyle = @color[2]
        ctx.fillRect(x * @w + 2, y * @h + 2, @w-2, @h-2)
        ctx.fillStyle = @color[4]
        ctx.fillText(p.name, x * @w + 4, (y + 1) * @h - 6)

    drawEmpty: (ctx, x, y) ->
        @clearCell(ctx, x, y)
        ctx.strokeStyle = @color[0]
        ctx.strokeRect(x * @w + 2, y * @h + 2, @w-2, @h-2)

    clearCell: (ctx, x, y) ->
        ctx.clearRect(x * @w, y * @h, @w, @h)

    drawTrackName: (ctx, name, x) ->
        ctx.fillStyle = @color[1]
        ctx.fillRect(x * @w + 2, -20, @w - 2, 18)

        m = ctx.measureText(name)
        dx = (@w - m.width)  / 2
        dy = (@offset_y - @font_size) / 2

        ctx.shadowColor = '#fff'
        ctx.shadowBlur  = 1
        ctx.fillStyle   = '#fff'
        ctx.fillText(name, x * @w + dx + 2, -dy-3)
        ctx.shadowBlur  = 0

    drawScene: (pos) ->
        @ctx_tracks_hover.clearRect(0, @scene_pos * @h, @w * 8, @h)
        @ctx_master_hover.clearRect(0, @scene_pos * @h, @w, @h)

        @ctx_tracks_hover.shadowColor = @ctx_master_hover.shadowColor = '#0df'
        @ctx_tracks_hover.shadowBlur  = @ctx_master_hover.shadowBlur  = 3

        @ctx_tracks_hover.fillStyle = 'rgba(255,255,255,0.4)'
        @ctx_tracks_hover.fillRect(2, pos * @h + 2, @w * 8 - 2, @h - 2)
        @ctx_master_hover.fillStyle = 'rgba(255,255,255,0.4)'
        @ctx_master_hover.fillRect(2, pos * @h + 2, @w - 2, @h - 2)

        @ctx_tracks_hover.clearRect(2, pos * @h + 2, @w * 8 - 2, @h - 2)
        @ctx_master_hover.clearRect(2, pos * @h + 2, @w - 2, @h - 2)

        @scene_pos = pos
