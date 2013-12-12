SEMITONE = 1.05946309
KEY_LIST =
    A:  55
    Bb: 58.27047018976124
    B:  61.7354126570155
    C:  32.70319566257483
    Db: 34.64782887210901
    D:  36.70809598967594
    Eb: 38.890872965260115
    E:  41.20344461410875
    F:  43.653528929125486
    Gb: 46.2493028389543
    G:  48.999429497718666
    Ab: 51.91308719749314

SCALE_LIST =
    IONIAN:     [0,2,4,5,7,9,11,12,14,16]
    DORIAN:     [0,2,3,5,7,9,10,12,14,15]
    PHRYGIAN:   [0,1,3,5,7,8,10,12,13,15]
    LYDIAN:     [0,2,4,6,7,9,11,12,14,16]
    MIXOLYDIAN: [0,2,4,5,7,9,10,12,14,16]
    AEOLIAN:    [0,2,3,5,7,8,10,12,14,15]
    LOCRIAN:    [0,1,3,5,6,8,10,12,13,15]

CONTEXT = new webkitAudioContext()
SAMPLE_RATE = CONTEXT.sampleRate
T = new MutekiTimer()



class @Player
    constructor: ->
        @bpm = 120
        @duration = 500  # msec
        @freq_key = 55
        @scale = []
        @is_playing = false
        @is_loop = true
        @time = 0
        @scene_pos = 0
        @scenes = []
        @scene = null

        @num_id = 0
        @context = CONTEXT
        @synth = [new Synth(@context, @num_id++, this)]
        @synth_now = @synth[0]
        @synth_pos = 0
        for s in @synth
            s.connect(@context.destination)

        @view = new PlayerView(this)

    setBPM: (@bpm) ->
        @duration = 15.0 / @bpm * 1000  # msec
        s.setDuration(@duration) for s in @synth

    setKey: (key)->
        @freq_key = KEY_LIST[key]
        s.setKey(@freq_key) for s in @synth

    setScale: (@scale) ->
        if ! Array.isArray(@scale)
            @scale = SCALE_LIST[@scale]
        s.setScale(@scale) for s in @synth

    isPlaying: -> @is_playing

    play: ->
        @is_playing = true
        T.setTimeout(( =>
            s.play() for s in @synth
            @playNext()
         ), 150)

    stop: ->
        s.stop() for s in @synth
        @is_playing = false
        @time = @scene_size

    pause: ->
        s.pause(@time) for s in @synth
        @is_playing = false

    forward: ->
        @time = (@time + 32) % @scene_size
        @synth_now.redraw(@time)

    backward: ->
        if @time % 32  < 3 && @time >= 32
            @time = (@time - 32 - (@time % 32)) % @scene_size
        else
            @time = @time - (@time % 32)
        @synth_now.redraw(@time)

    toggleLoop: ->
        @is_loop = !@is_loop

    noteOn: (note) -> @synth_now.noteOn(note)
    noteOff: ()    -> @synth_now.noteOff()

    playNext: ->
        if @is_playing
            if (not @is_loop) and @time >= @scene_size
                if @scene_pos == @scenes.length - 1
                    @is_playing = false
                    @view.viewStop()
                    @time = 0
                    @scene_pos = 0
                    @scene = @scenes[0]
                    @readScene(@scene)
                    return
                else
                    @time = 0
                    @scene_pos++
                    @scene = @scenes[@scene_pos]
                    @readScene(@scene)

            @time = 0 if @time >= @scene_size
            s.playAt(@time) for s in @synth
            @time++
            T.setTimeout(( => @playNext()), @duration)

    addSynth: ->
        s = new Synth(@context, @num_id++, this)
        s.setScale(@scale)
        s.setKey(@freq_key)
        s.connect(@context.destination)
        @synth.push(s)

    moveRight: (next_idx) ->
        @synth[next_idx - 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate()

    moveLeft: (next_idx) ->
        @synth[next_idx + 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate()

    saveSong: () ->
        for s in @scenes
        @scene =
            size:     @scene_size
            patterns: (s.pattern for s in @synth)
            bpm:      @bpm
            scale:    @scale
            key:      @key

        @scenes = [@scene]
        song_json = JSON.stringify(@scenes)
        csrf_token = $('#ajax-form > input[name=csrf_token]').val()
        $.ajax(
            url: '/'
            type: 'POST'
            dataType: 'text'
            data:
                json: song_json
                csrf_token: csrf_token
        ).done((d) =>
            @showSuccess(d)
        ).fail((err) =>
            @showError(err)
        )

    readSong: (song) ->
        if song_read?
            @scenes = song_read
        else
            @scenes = (o for o in song)
        @readScene(@scenes[0])

    readScene: (@scene) ->
        patterns = @scene.patterns
        while patterns.length > @synth.length
            @addSynth()
        @setBPM(@scene.bpm) if @scene.bpm?
        @setKey(@scene.key) if @scene.key?
        @setScale(@scene.scale) if @scene.scale?
        @view.readParam(@bpm, @freq_key, @scale)
        for i in [0...patterns.length]
            @synth[i].readPattern(patterns[i])
        @view.synth_total = @synth.length
        @setSceneSize()

    setSceneSize: ->
        @scene_size = Math.max.apply(null, (s.pattern.length for s in @synth))

    showSuccess: (url) ->
        console.log("success!")
        console.log(url)

    showError: (error) ->
        console.log(error)



class @PlayerView
    constructor: (@model) ->
        @dom = $("#control")

        @bpm   = @dom.find("[name=bpm]")
        @key   = @dom.find("[name=key]")
        @scale = @dom.find("[name=mode]")

        @setBPM()
        @setKey()
        @setScale()

        @footer = $('footer')

        @play  = $('#control-play')
        @stop  = $('#control-stop')
        @forward = $('#control-forward')
        @backward = $('#control-backward')
        @loop = $('#control-loop')

        @instruments = $('#instruments')
        @mixer = $('#mixer')

        @btn_left   = $('#btn-left')
        @btn_right  = $('#btn-right')
        @btn_top    = $('#btn-top')
        @btn_bottom = $('#btn-bottom')
        @synth_now = 0
        @synth_total = 1

        @btn_save = $('#btn-save')

        @initEvent()
        @resize()

    initEvent: ->
        @dom.on("change", () =>
            @setBPM()
            @setKey()
            @setScale()
        )
        @play.on('mousedown', () => @viewPlay())
        @stop.on('mousedown', () => @viewStop())
        @forward.on('mousedown', () => @model.forward())
        @backward.on('mousedown', () => @model.backward())
        @loop.on('mousedown', () =>
            if @model.toggleLoop()
                @loop.removeClass('control-off').addClass('control-on')
            else
                @loop.removeClass('control-on').addClass('control-off')

        )

        @btn_left.on('mousedown',  () => @moveLeft())
        @btn_right.on('mousedown', () => @moveRight())
        @btn_top.on('mousedown', () => @moveTop())
        @btn_bottom.on('mousedown', () => @moveBottom())

        @btn_save.on('click', () => @model.saveSong())

        $(window).on('resize', () => @resize())


    viewPlay: ->
        if @model.isPlaying()
            @model.pause()
            @play.removeClass("fa-pause").addClass("fa-play")
        else
            @model.play()
        @play.removeClass("fa-play").addClass("fa-pause")

    viewStop: ->
        @model.stop()
        @play.removeClass("fa-pause").addClass("fa-play")


    setBPM:   ->  @model.setBPM(parseInt(@bpm.val()))
    setKey:   ->  @model.setKey(@key.val())
    setScale: ->  @model.setScale(@scale.val())

    readParam: (bpm, key, scale) ->
        @bpm.val(bpm)
        for k, v of SCALE_LIST
            if v = scale
                @scale.val(k)
                break
        for k, v of KEY_LIST
            if v = key
                @key.val(k)
                break

    moveRight: ->
        if @synth_now == (@synth_total - 1)
            @model.addSynth()
            @synth_total++
        @synth_now++
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
        @model.moveRight(@synth_now)
        @btn_left.show()

    moveLeft: ->
        if @synth_now != 0
            @synth_now--
            @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
            @model.moveLeft(@synth_now)
        if @synth_now == 0
            @btn_left.hide()


    moveTop: ->
        @btn_left.hide()
        @btn_right.hide()
        @btn_top.hide()
        @btn_bottom.show()
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 700px, 0px)')
        @mixer.css('-webkit-transform', 'translate3d(0px, 700px, 0px)')

    moveBottom: ->
        @btn_left.show()
        @btn_right.show()
        @btn_top.show()
        @btn_bottom.hide()
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
        @mixer.css('-webkit-transform', 'translate3d(0px, 0px, 0px)')


    resize: ->
        w = $(window).width()
        h = $(window).height()
        space_w = (w - 910) / 2
        space_h = (h - 600) / 2

        pw = space_w/2 - 50
        ph = space_h/2 - 50

        @btn_left.css(
            width: space_w + 'px'
            padding: '250px ' + (pw + 5) + 'px'
        )
        @btn_right.css(
            width: space_w + 'px'
            padding: '250px ' + (pw + 15) + 'px'
        )
        @btn_top.css(
            height: space_h + 'px'
        )
        @btn_bottom.css(
            bottom: space_h + 'px'
            height: space_h + 'px'
        )
        @footer.css(
            height: space_h + 'px'
        )



$(() ->
    $("#twitter").socialbutton('twitter', {
        button: 'horizontal',
        text:   'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    })
    $("#hatena").socialbutton('hatena')
    $("#facebook").socialbutton('facebook_like', {
        button: 'button_count'
    })


    player = new Player()

    is_key_pressed = false
    $(window).keydown((e) ->
        if is_key_pressed == false
            is_key_pressed = true
            player.noteOff() if player.isPlaying()

            n = KEYCODE_TO_NOTE[e.keyCode]
            player.noteOn(n) if n?
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
        bpm: 80
        size: 32
        patterns: [
            [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8],
            [3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10,3,4,5,6,7,8,9,10]]

    song1 = [s1, s2]

    #player.readScene(scn22)
    player.readSong(song1)
)


KEYCODE_TO_NOTE =
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
