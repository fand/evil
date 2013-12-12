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
        @is_loop = false
        @time = 0
        @scene_position = 0
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

    playNext: ->
        if @is_playing
            @time = 0 if @time >= @scene_size
            s.playAt(@time) for s in @synth
            @time++
            T.setTimeout(( => @playNext()), @duration)

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

    noteOn: (note) -> @synth_now.noteOn(note)
    noteOff: ()    -> @synth_now.noteOff()

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

    readSong: (scn) ->
        if song_read?
            @scenes = song_read
        else
            @scenes = [scn]
        @readScene(@scenes[0])

    readScene: (@scene) ->
        #@scenes = [@scene]
        @scene_size = @scene.size
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

        @play  = $('#control-play')
        @stop  = $('#control-stop')
        @forward = $('#control-forward')
        @backward = $('#control-backward')

        @instruments = $('#instruments')
        @btn_left  = $('#btn-left')
        @btn_right = $('#btn-right')
        @synth_now = 0
        @synth_total = 1

        @btn_save = $('#btn-save')

        @initEvent()

    initEvent: ->
        @dom.on("change", () =>
            @setBPM()
            @setKey()
            @setScale()
        )
        @play.on('mousedown', () =>
            if @model.isPlaying()
                @model.pause()
                @play.removeClass("fa-pause").addClass("fa-play")
            else
                @model.play()
                @play.removeClass("fa-play").addClass("fa-pause")
        )
        @stop.on('mousedown', () =>
            @model.stop()
            @play.removeClass("fa-pause").addClass("fa-play")
        )
        @forward.on('mousedown', () =>
            @model.forward()
        )
        @backward.on('mousedown', () =>
            @model.backward()
        )

        @btn_left.on('mousedown',  () => @moveLeft())
        @btn_right.on('mousedown', () => @moveRight())
        @btn_save.on('click', () => @model.saveSong())

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

    moveLeft: ->
        if @synth_now != 0
            @synth_now--
            @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
            @model.moveLeft(@synth_now)




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

    scn55 =
        size: 32
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2]
            ]
    scn22 =
        size: 32
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2],
            [1,1,8,1,8,1,7,1,1,1,8,1,8,1,7,1,3,1,3,1,1,2,3,5,8,1,8,7,5,1,3,2]
        ]
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
    scn3 =
        size: 96
        bpm: 240
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,
             1,2,3,5,8,3,5,8,2,3,4,6,9,4,6,9,3,4,5,7,10,5,7,10,7,8,1,3,5,8,1,1]
            ]
    scn8 =
        bpm: 240
        size: 256
        patterns: [
            [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,
             1,2,3,5,8,3,5,8,2,3,4,6,9,4,6,9,3,4,5,7,10,5,7,10,7,8,1,3,5,8,1,1,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,
             10,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,
             1,2,3,5,8,3,5,8,2,3,4,6,9,4,6,9,3,4,5,7,10,5,7,10,7,8,1,3,5,8,1,1,
             1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]
            ]
    #player.readScene(scn22)
    player.readSong(scn3)
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
