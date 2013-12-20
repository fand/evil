class @SessionView
    constructor: (@model) ->
        @canvas_tracks_dom = $('#session-tracks')
        @canvas_master_dom = $('#session-master')

        @canvas_tracks = @canvas_tracks_dom[0]
        @canvas_master = @canvas_master_dom[0]

        @ctx_tracks = @canvas_tracks.getContext('2d')
        @ctx_master = @canvas_master.getContext('2d')

        @w = 80
        @h = 20
        @color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']

        # @cell = new Image()
        # @cell.src = 'static/img/session_cell.png'
        # @cell.onload = () => @initCanvas()
        @initCanvas()

    initCanvas: ->
        @canvas_tracks.width = @w * 8
        @canvas_master.width = @w
        @canvas_tracks.height = @canvas_master.height = @h*15 + 10

        @ctx_tracks.translate(0, 20)
        @ctx_master.translate(0, 20)

        @rect = @canvas_tracks.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

    readSong: (song) ->
        for x in [0...Math.max(song.tracks.length, 8)]
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

    drawCell: (ctx, p, x, y) ->
        @clearCell(ctx, x, y)
        ctx.fillStyle = @color[2]
        ctx.fillRect(x * @w, y * @h, @w, @h)
        ctx.fillStyle = @color[4]
        ctx.fillText(p.name, x * @w, (y + 1) * @h - 3)

    drawEmpty: (ctx, x, y) ->
        @clearCell(ctx, x, y)
        ctx.strokeStyle = @color[0]
        ctx.strokeRect(x * @w, y * @h, @w, @h)

    clearCell: (ctx, x, y) ->
        ctx.clearRect(x * @w, y * @h, @w, @h)

    drawTrackName: (ctx, name, x) ->
        ctx.fillStyle = @color[2]
        ctx.fillText(name, x * @w + 20, 5)
