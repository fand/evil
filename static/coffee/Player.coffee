class @Player
    constructor: ->
        @bpm = 120
        @duration = 500  # msec
        @key = 'A'
        @scale = 'IONIAN'
        @is_playing = false
        @time = 0
        @scene = {}

        @num_id = 0
        @context = CONTEXT
        @synth = []

        @mixer = new Mixer(@context, this)
        @session = new Session(@context, this)

        @addSynth()
        @synth_now = @synth[0]
        @synth_pos = 0

        @view = new PlayerView(this)

    setBPM: (@bpm) ->
        @scene.bpm = @bpm

        # @duration = (60000.0 / @bpm) / 8.0
        @duration = 7500.0 / @bpm
        s.setDuration(@duration) for s in @synth

    setKey: (key)->
        @scene.key = key
        s.setKey(key) for s in @synth

    setScale: (@scale) ->
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
        @readSong(@song)

    pause: ->
        s.pause(@time) for s in @synth
        @is_playing = false

    forward: ->
        @time = (@time + 32) % @scene_length
        @synth_now.redraw(@time)

    backward: ->
        if @time % 32  < 3 && @time >= 32
            @time = (@time - 32 - (@time % 32)) % @scene_length
        else
            @time = @time - (@time % 32)
        @synth_now.redraw(@time)

    toggleLoop: -> @session.toggleLoop()

    noteOn: (note) -> @synth_now.noteOn(note)
    noteOff: ()    -> @synth_now.noteOff()

    playNext: ->
        if @is_playing
            if @time >= @scene_length
                @time = 0
                @session.next()
                @readScene(@scene)

            @time = 0 if @time >= @scene_length
            s.playAt(@time) for s in @synth

            if @time % 32 == 31
                @session.nextMeasure(@synth)

            @time++
            T.setTimeout(( => @playNext()), @duration)
        else
            @stop()

    addSynth: ->
        s = new Synth(@context, @num_id++, this)
        s.setScale(@scale)
        s.setKey(@freq_key)
        @synth.push(s)
        @mixer.addSynth(s)
        @session.addSynth(s)

    moveRight: (next_idx) ->
        @synth[next_idx - 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)

    moveLeft: (next_idx) ->
        @synth[next_idx + 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)

    readSong: (@song) ->
        while @song.tracks.length > @synth.length
            @addSynth()

        @session.setSynth(@synth)
        @session.readSong(song)
        @view.setSynthNum(@synth.length, @synth_pos)

    readScene: (@scene) ->
        @setBPM(@scene.bpm) if @scene.bpm?
        @setKey(@scene.key) if @scene.key?
        @setScale(@scene.scale) if @scene.scale?
        @view.readParam(@bpm, @freq_key, @scale)

    setSceneLength: (@scene_length) ->

    showSuccess: (url) ->
        console.log("success!")
        console.log(url)

    showError: (error) ->
        console.log(error)
