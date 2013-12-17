class @SessionView
    constructor: (@model) ->
        @canvas_tracks_dom = $('#session')
        @canvas_master_dom = $('#session-master')

        @canvas_tracks = @canvas_tracks_dom[0]
        @canvas_master = @canvas_master_dom[0]

        @ctx_tracks = @canvas_tracks.getContext('2d')
        @ctx_master = @canvas_master.getContext('2d')

        # @cell = new Image()
        # @cell.src = 'static/img/session_cell.png'
        # @cell.onload = () => @initCanvas()
        @initCanvas()

    initCanvas: ->
        @canvas_tracks.width = 720
        @canvas_master.width = 190
        @canvas_tracks.height = @canvas_master.height = 360

        @rect = @canvas_tracks.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top
        # for i in [0...20]
        #     for j in [0...32]
        #         @ctx_off.drawImage(@cell,
        #             0, 0, 26, 26,           # src (x, y, w, h)
        #             j * 26, i * 26, 26, 26  # dst (x, y, w, h)
        #         )
        # @readPattern(@pattern)



    addSynth: (s) ->
