@KEYCODE_TO_NOTE =
    90:   1
    88:   2
    67:   3
    86:   4
    66:   5
    78:   6
    77:   7
    65:   8
    83:   9
    68:  10
    188:  8
    190:  9
    192: 10
    70:  11
    71:  12
    72:  13
    74:  14
    75:  15
    76:  16
    187: 17
    81:  15
    87:  16
    69:  17
    82:  18
    84:  19
    89:  20
    85:  21
    73:  22
    79:  23
    80:  24
    49:  22
    50:  23
    51:  24
    52:  25
    53:  26
    54:  27
    55:  28
    56:  29
    57:  30
    48:  31


@KEYCODE_TO_NUM =
    49:  1
    50:  2
    51:  3
    52:  4
    53:  5
    54:  6
    55:  7
    56:  8
    57:  9
    48:  0


class @Keyboard
    constructor: (@player) ->
        @mode = 'SYNTH'
        @is_writing = false
        @is_pressed = false

        @solos = []

        @initEvent()

    initEvent: ->
        $(window).keydown((e) =>
            return if @is_writing
            if @is_pressed == false
                @is_pressed = true
            @on(e)
        )
        $(window).keyup((e) =>
            @is_pressed = false
            @off(e)
        )


    beginInput: -> @is_writing = true
    endInput:   -> @is_writing = false

    setMode: (@mode) ->

    on: (e) ->
        switch e.keyCode
            when 37 then @player.view.moveLeft()
            when 38 then @player.view.moveTop()
            when 39 then @player.view.moveRight()
            when 40 then @player.view.moveBottom()
            when 32 then @player.view.viewPlay()
            when 13 then @player.view.viewPlay()
            else
                @onPlayer(e) if @mode == 'SYNTH'
                @onMixer(e)  if @mode == 'MIXER'

    onPlayer: (e) ->
        @player.noteOff() if @player.isPlaying()
        n = KEYCODE_TO_NOTE[e.keyCode]
        @player.noteOn(n) if n?

    onMixer: (e) ->
        num = KEYCODE_TO_NUM[e.keyCode]
        if num? and num < 10
            @solos.push(num) if num not in @solos
            @player.solo(@solos)

    off: (e) ->
        @offPlayer(e) if @mode == 'SYNTH'
        @offMixer(e)  if @mode == 'MIXER'

    offPlayer: (e) -> @player.noteOff()

    offMixer: (e) ->
        num = KEYCODE_TO_NUM[e.keyCode]
        if num? and num < 10
            @solos = @solos.filter((n) -> n != num)
            @player.solo(@solos)
