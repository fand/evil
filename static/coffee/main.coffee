# ------------------------------------------------------------------------------
# CONSTANT

@CONTEXT = new webkitAudioContext()
@STREAM_LENGTH = 1024
@SAMPLE_RATE = 48000
@SEMITONE = 1.05946309
@T = new MutekiTimer()


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



# ------------------------------------------------------------------------------
# Main

$(() ->

    window.player = new Player()

    is_key_pressed = false
    $(window).keydown((e) ->
        if is_key_pressed == false
            is_key_pressed = true
            player.noteOff() if player.isPlaying()

            n = KEYCODE_TO_NOTE[e.keyCode]
            if n?
                player.noteOn(n)
            else
                switch e.keyCode
                    when 37 then player.view.moveLeft() ;console.log('eleft')
                    when 38 then player.view.moveTop()  ;console.log('top')
                    when 39 then player.view.moveRight()
                    when 40 then player.view.moveBottom()
                    when 32 then player.view.viewPlay()
                    when 13 then player.view.viewPlay()
    )
    $(window).keyup( ->
        is_key_pressed = false
        player.noteOff()
    )

    footer_size = $(window).height()/2 - 300
    $('footer').css('height', footer_size + 'px')

    scn1 =
        size: 32
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2]
            ]
    scn2 =
        size: 64
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]
            ]
    scn55 =
        size: 32
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2]
            ]

    s1 =
        bpm: 80
        size: 32
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [1,1,8,1,8,1,7,1,1,1,8,1,8,1,7,1,3,3,8,3,8,3,7,3,5,5,8,5,8,5,9,5]]
    s2 =
        size: 32
        patterns: [
            [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8],
            [3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10]]

    song1 = [s1, s2]

    #player.readScene(scn22)
    player.readSong(song1)


    # Social Buttons
    $("#twitter").socialbutton('twitter', {
        button: 'horizontal',
        text:   'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    })
    $("#hatena").socialbutton('hatena')
    $("#facebook").socialbutton('facebook_like', {
        button: 'button_count'
    })

)
