# ------------------------------------------------------------------------------
# CONSTANT

#@CONTEXT = new webkitAudioContext()
@STREAM_LENGTH = 1024
@SAMPLE_RATE = 48000
@SEMITONE = 1.05946309
@T = new MutekiTimer()



# ------------------------------------------------------------------------------
# Main

$(() ->

    console.log('Welcome to evil!')

    ua = window.navigator.userAgent.toLowerCase()
    if ua.match(/chrome/g)
        initEvil()
    else
        sorry()
)



@sorry = ->
    $('#top-sorry').show()
    $('#top-logo-wrapper').addClass('logo-sorry')


@initEvil = ->

    # Don't use MutekiTimer here!!
    # (it causes freeze)
    setTimeout((() =>
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
    window.keyboard = new Keyboard(window.player)

    footer_size = $(window).height()/2 - 300
    $('footer').css('height', footer_size + 'px')

    if debug?
        # test song
        p1 = name: 'p1', pattern: [10,10,17,10,17,10,16,10,10,10,17,10,17,10,16,10,8,8,17,8,17,8,16,8,9,9,17,9,17,9,16,9]
        p2 = name: 'p2', pattern: [8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15]
        p3 = name: 'p3', pattern: [8,8,15,8,15,8,14,8,8,8,15,8,15,8,14,8,6,6,15,6,15,6,14,6,7,7,15,7,15,7,14,7]
        p4 = name: 'p4', pattern: [10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17,10,11,12,13,14,15,16,17]
        t1 = id: 1, name: 'lead', patterns: [p1, p2], params: [], gain: 1.0, pan: -1.0
        t2 = id: 2, name: 'chorus', patterns: [p3, p4], params: [], gain: 1.0, pan: 1.0
        c1 = name: 'intro', bpm: 80, key: 'A', scale: 'Major'
        c2 = name: 'outro', bpm: 100, key: 'G', scale: 'minor'

        song2 =
            title: 'hello'
            creator: 'fand'
            tracks: [t1, t2]
            master: [c1, c2]
            length: 2

        player.readSong(song2)


    # Read song
    player.readSong(song_read) if song_read?
