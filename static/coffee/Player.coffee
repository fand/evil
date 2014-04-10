class @Player
    constructor: ->
        @bpm = 120
        @duration = 500  # msec
        @key = 'A'
        @scale = 'Major'
        @is_playing = false
        @time = 0
        @scene = bpm: @bpm, key: @key, scale: @scale

        @num_id = 0
        @context = CONTEXT
        @synth = []

        @mixer = new Mixer(@context, this)
        @session = new Session(@context, this)
        @sidebar = new Sidebar(@context, this, @session, @mixer)

        @addSynth(0)
        @synth_now = @synth[0]
        @synth_pos = 0
        @scene_length = 32

        @view = new PlayerView(this)

    setBPM: (@bpm) ->
        @scene.bpm = @bpm

        # @duration = (60000.0 / @bpm) / 8.0
        @duration = 7500.0 / @bpm
        s.setDuration(@duration) for s in @synth

        @sidebar.setBPM(@bpm)

    setKey: (@key)->
        @scene.key = @key
        s.setKey(@key) for s in @synth

        @sidebar.setKey(@key)

    setScale: (@scale) ->
        @scene.scale = @scale
        s.setScale(@scale) for s in @synth

        @sidebar.setScale(@scale)

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

    noteOn: (note, force) -> @synth_now.noteOn(note, force)
    noteOff: (force)    -> @synth_now.noteOff(force)

    playNext: ->
        if @is_playing
            if @time >= @scene_length
                @time = 0

            s.playAt(@time) for s in @synth

            if @time % 32 == 31 and @time + 32 > @scene_length
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

    # Called by instruments.
    changeSynth: (id, type) ->
        s_old  = @synth[id]

        if type == 'REZ'
            s_new = new Synth(@context, id, this, s_old.name)
            s_new.setScale(@scene.scale)
            s_new.setKey(@scene.key)
        else if type == 'SAMPLER'
            s_new = new Sampler(@context, id, this, s_old.name)

        @synth_now = @synth[id] = s_new
        @synth_now = s_new

        @mixer.changeSynth(id, s_new)
        @session.changeSynth(id, type, s_new)
        @view.changeSynth(id, type)

        return s_new

    # Called by PlayerView.
    moveRight: (next_idx) ->
        if next_idx == @synth.length
            @addSynth()
            @session.play()

        @synth[next_idx - 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)
        @synth_pos++
        window.keyboard.setMode('SYNTH')

    moveLeft: (next_idx) ->
        @synth[next_idx + 1].inactivate()
        @synth_now = @synth[next_idx]
        @synth_now.activate(next_idx)
        @synth_pos--
        window.keyboard.setMode('SYNTH')

    moveTop: () ->
        window.keyboard.setMode('MIXER')

    moveBottom: () ->
        window.keyboard.setMode('SYNTH')

    moveTo: (synth_num) ->
        @view.moveBottom()
        if synth_num < @synth_pos
            while synth_num != @synth_pos
                @view.moveLeft()
        else
            while synth_num != @synth_pos
                @view.moveRight()

    solo: (solos) ->
        if solos.length == 0
            s.demute() for s in @synth
            return
        for s in @synth
            if (s.id + 1) in solos
                s.demute()
            else
                s.mute()

    readSong: (@song) ->
        @synth = []
        @num_id = 0
        @mixer.empty()
        @session.empty()
        @view.empty()

        for i in [0...@song.tracks.length]
            if not @song.tracks[i].type? or @song.tracks[i].type == 'REZ'
                @addSynth(0, @song.tracks[i].name)
            if @song.tracks[i].type == 'SAMPLER'
                @addSampler(0, @song.tracks[i].name)

        @synth_now = @synth[0]

        @readScene(@song.master[0])
        @setSceneLength(@song.master.length)
        for i in [0...@song.tracks.length]
            @synth[i].readParam(@song.tracks[i])

        @session.setSynth(@synth)
        @session.readSong(@song)
        @mixer.readParam(@song.mixer)

        @view.setSynthNum(@synth.length, @synth_pos)
        @resetSceneLength()

    clearSong: () ->
        @synth = []
        @num_id = 0

    readScene: (scene) ->
        if scene.bpm?
            @setBPM(scene.bpm)
            @view.setBPM(scene.bpm)
        if scene.key?
            @setKey(scene.key)
            @view.setKey(scene.key)
        if scene.scale?
            @setScale(scene.scale)
            @view.setScale(scene.scale)
        @view.setParam(scene.bpm, scene.key, scene.scale)

    getScene: -> @scene

    setSceneLength: (@scene_length) ->

    resetSceneLength: (l) ->
        @scene_length = 0
        for s in @synth
            @scene_length = Math.max(@scene_length, s.pattern.length)

    showSuccess: (url) ->
        console.log("success!")
        console.log(url)

    showError: (error) ->
        console.log(error)
