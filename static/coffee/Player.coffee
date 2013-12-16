@KEY_LIST =
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

@SCALE_LIST =
    IONIAN:     [0,2,4,5,7,9,11,12,14,16]
    DORIAN:     [0,2,3,5,7,9,10,12,14,15]
    PHRYGIAN:   [0,1,3,5,7,8,10,12,13,15]
    LYDIAN:     [0,2,4,6,7,9,11,12,14,16]
    MIXOLYDIAN: [0,2,4,5,7,9,10,12,14,16]
    AEOLIAN:    [0,2,3,5,7,8,10,12,14,15]
    LOCRIAN:    [0,1,3,5,6,8,10,12,13,15]




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
        @scene = {}

        @num_id = 0
        @context = CONTEXT
        @synth = [new Synth(@context, @num_id++, this)]
        @synth_now = @synth[0]
        @synth_pos = 0

        @mixer = new Mixer(@context, this)
        @mixer.addSynth(@synth[0])

        @view = new PlayerView(this)

    setBPM: (@bpm) ->
        @scene.bpm = @bpm
        @duration = 15.0 / @bpm * 1000  # msec
        s.setDuration(@duration) for s in @synth

    setKey: (key)->
        @scene.key = key
        @freq_key = KEY_LIST[key]
        s.setKey(@freq_key) for s in @synth

    setScale: (@scale) ->
        if ! Array.isArray(@scale)
            @scale = SCALE_LIST[@scale]
        @scene.scale = @scale
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
        @view.viewStop()
        @time = 0
        @scene_pos = 0
        @scene = @scenes[0]
        @readScene(@scene)

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
                    @stop()
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
        @synth.push(s)
        @mixer.addSynth(s)

    moveRight: (next_idx) ->
        @synth[next_idx - 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)

    moveLeft: (next_idx) ->
        @synth[next_idx + 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)

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
            @view.btn_right.attr('data-line1', 'next')
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
