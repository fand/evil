class @Session
    constructor: (@ctx, @player) ->
        @scenes = []
        @scene_pos = 0
        @scene = {}

        @next_pattern

        @is_loop = true
        @is_waiting_next_pattern = false
        @is_waiting_next_scene = false

        @view = new SessionView(this)


    toggleLoop: -> @is_loop = !@is_loop

    nextMeasure: (@synth) ->
        if @is_loop
            if @is_waiting_next_scene
                @nextScene()
            else if @is_waiting_next_pattern
                @nextPattern()
        else
            @nextScene()

    nextPattern: () ->
        @is_waiting_next_pattern = false
        for i in [0...@synth.length]
            if @next_pattern[i]?
                pat = @song[i][@next_pattern[i]]
                @synth[i].readPattern(pat)

#        @view.draw()

    nextScene: (pos) ->
        if not pos?
            @scene_pos++
            pos = @scene_pos
        if @scene_pos >= @song_length
            @player.is_playing = false
            return

        for i in [0...@synth.length]
            pat = @song.tracks[i].patterns[pos].pattern
            if pat?
                @synth[i].readPattern(pat)
                @scene_length = Math.max(@scene_length, pat.length)

        @player.readScene(@song.master[@scene_pos])
        @player.setSceneLength(@scene_length)
        @view.drawScene(@scene_pos)

    getScene: (i) -> @song.master[i]

    cue: (synth_num, pat_num) ->
        @is_waiting_next_pattern = true
        @next_pattern[synth_num] = pat_num

    next: () ->
        @nextScene()
        @nextPattern()

    addSynth: (s) ->
#        @synth.push(new Synth())
#        @view.addSynth()

    setSynth: (@synth) ->

    readSong: (@song) ->
        @scene_pos = 0
        @song_length = 0
        for i in [0...@song.tracks.length]
            @synth[i].readPattern(@song.tracks[i].patterns[0].pattern)
            @song_length = Math.max(@song_length, song.tracks[i].patterns.length)
        @player.readScene(song.master[0])
        @view.readSong(song)

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
