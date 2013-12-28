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
        @scene_length = 32

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
        @session.play()
        T.setTimeout(( =>
            s.play() for s in @synth
            @playNext()
         ), 150)

    stop: ->
        s.stop() for s in @synth
        @is_playing = false
        @view.viewStop()
        @time = 0

    pause: ->
        s.pause(@time) for s in @synth
        @is_playing = false

    forward: ->
        if (@time + 32) > @scene_length
            @session.nextMeasure(@synth)
        @time = (@time + 32) % @scene_length
        @synth_now.redraw(@time)

    backward: (force) ->
        if force
            if @time >= 32
                @time = (@time - 32) % @scene_length
        else
            if @time % 32  < 3 and @time >= 32
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

            s.playAt(@time) for s in @synth

            if @time % 32 == 31
                @session.nextMeasure(@synth)

            if @time % 8 == 0
                @session.beat()

            @time++
            T.setTimeout(( => @playNext()), @duration)
        else
            @stop()

    addSynth: (scene_pos, name) ->
        s = new Synth(@context, @num_id++, this, name)
        s.setScale(@scene.scale)
        s.setKey(@scene.key)
        @synth.push(s)
        @mixer.addSynth(s)
        @session.addSynth(s, scene_pos)

    addSampler: (scene_pos, name) ->
        s = new Sampler(@context, @num_id++, this, name)
        @synth.push(s)
        @mixer.addSynth(s)
        @session.addSynth(s, scene_pos)

    changeSynth: (id, type) ->
        s_old  = @synth[id]
        name = s_old.name

        if type == 'REZ'
            s_new = new Synth(@context, id, this, name)
            s_new.setScale(@scene.scale)
            s_new.setKey(@scene.key)
            @mixer.changeSynth(id, s_new)

        else if type == 'SAMPLER'
            s_new = new Sampler(@context, id, this, name)
            @mixer.changeSynth(id, s_new)

        @synth[id] = s_new
        s_old.replaceWith(s_new)
        s_old.noteOff()

        @synth_now = s_new
#        @view.changeSynth(id, type)

        return s_new


    moveRight: (next_idx) ->
        @synth[next_idx - 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)
        @synth_pos++

    moveLeft: (next_idx) ->
        @synth[next_idx + 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)
        @synth_pos--

    moveTo: (synth_num) ->
        @view.moveBottom()
        if synth_num < @synth_pos
            while synth_num != @synth_pos
                @view.moveLeft()
        else
            while synth_num != @synth_pos
                @view.moveRight()

    readSong: (@song) ->
        for i in [0...@song.tracks.length]
            if @synth[i]?
                @synth[i].setSynthName(@song.tracks[i].name)
            else
                @addSynth(@song.tracks[i].name)
        @session.setSynth(@synth)
        @session.readSong(@song)
        @view.setSynthNum(@synth.length, @synth_pos)
        @resetSceneLength()

    clearSong: () ->
        @synth = []
        @num_id = 0

    readScene: (@scene) ->
        @setBPM(@scene.bpm) if @scene.bpm?
        @setKey(@scene.key) if @scene.key?
        @setScale(@scene.scale) if @scene.scale?
        @view.readParam(@bpm, @freq_key, @scale)

    setSceneLength: (@scene_length) ->

    resetSceneLength: (l) ->
        @scene_length = 0
        for s in @synth
            @scene_length = Math.max(@scene_length, s.pattern.length)

        console.log(@scene_length)

    showSuccess: (url) ->
        console.log("success!")
        console.log(url)

    showError: (error) ->
        console.log(error)
