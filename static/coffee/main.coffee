# ------------------------------------------------------------------------------
# CONSTANT

#@CONTEXT = new webkitAudioContext()
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

    console.log('Welcome to evil!')
    ua = window.navigator.userAgent.toLowerCase()
    if ua.match(/chrome/g)
        initEvil()
    else
        console.log(ua)
        sorry()
)



@sorry = ->
    $('#top-sorry').show()
    $('#top-logo-wrapper').addClass('logo-sorry')


@initEvil = ->

    T.setTimeout((() =>
        $('#top').css(
            opacity: '0'
        ).delay(500).css('z-index', '-1')
        $('#top-logo').css(
            '-webkit-transform': 'translate3d(0px, -100px, 0px)'
            opacity: '0'
        )
    ), 1500)

    window.CONTEXT = new webkitAudioContext()

    window.player = new Player()

    window.is_input_mode = false
    is_key_pressed = false
    $(window).keydown((e) ->
        return if window.is_input_mode
        if is_key_pressed == false
            is_key_pressed = true
            player.noteOff() if player.isPlaying()

            n = KEYCODE_TO_NOTE[e.keyCode]
            if n?
                player.noteOn(n)
            else
                switch e.keyCode
                    when 37 then player.view.moveLeft()
                    when 38 then player.view.moveTop()
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
            [10,10,17,10,17,10,16,10,10,10,17,10,17,10,16,10,8,8,17,8,17,8,16,8,9,9,17,9,17,9,16,9],
            [8,8,15,8,15,8,14,8,8,8,15,8,15,8,14,8,6,6,15,6,15,6,14,6,7,7,15,7,15,7,14,7]]
    s2 =
        size: 32
        patterns: [
            [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8],
            [3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10]]

    song1 = [s1, s2]

    p1 = name: 'p1', pattern: [10,10,17,10,17,10,16,10,10,10,17,10,17,10,16,10,8,8,17,8,17,8,16,8,9,9,17,9,17,9,16,9]
    p2 = name: 'p2', pattern: [8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15]
    p3 = name: 'p3', pattern: [8,8,15,8,15,8,14,8,8,8,15,8,15,8,14,8,6,6,15,6,15,6,14,6,7,7,15,7,15,7,14,7]
    p4 = name: 'p4', pattern: [10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17]
    t1 = id: 1, name: 'lead', patterns: [p1, p2], params: [], gain: 1.0, pan: -1.0
    t2 = id: 2, name: 'chorus', patterns: [p3, p4], params: [], gain: 1.0, pan: 1.0
    c1 = name: 'intro', bpm: 80, key: 'A', scale: 'IONIAN'
    c2 = name: 'outro', bpm: 100, key: 'G', scale: 'AEOLIAN'

    song2 =
        title: 'hello'
        creator: 'fand'
        tracks: [t1, t2]
        master: [c1, c2]
        length: 2

    #player.readScene(scn22)
    player.readSong(song2)


    # Social Buttons
    $("#twitter").socialbutton('twitter', {
        button: 'horizontal',
        text:   'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    })
    $("#hatena").socialbutton('hatena')
    $("#facebook").socialbutton('facebook_like', {
        button: 'button_count'
    })
