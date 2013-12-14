class MixerView
    constructor: ->
        @dom = $('#mixer')

        @canvas_session_dom = $('#mixer-session')
        @canvas_mixer_dom   = $('#mixer-mixer')

        @canvas_session = @canvas_session_dom[0]
        @canvas_mixer   = @canvas_mixer_dom[0]

        @ctx_session = @canvas_session.getContext('2d')
        @ctx_mixer   = @canvas_mixer.getContext('2d')


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
