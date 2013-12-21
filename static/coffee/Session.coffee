class @Session
    constructor: (@ctx, @player) ->
        @scenes = []
        @scene_pos = 0
        @scene = {}

        @current_cells = []
        @next_pattern_pos = []
        @next_scene_pos = undefined

        @is_loop = true
        @is_waiting_next_pattern = false
        @is_waiting_next_scene = false

        @cue_queue = []

        @view = new SessionView(this)

    toggleLoop: -> @is_loop = !@is_loop

    nextMeasure: (@synth) ->
        if @is_loop
            if @is_waiting_next_scene
                @nextScene(@next_scene_pos)
            else if @is_waiting_next_pattern
                @nextPattern()
        else
            @nextScene()

    nextPattern: () ->
        @is_waiting_next_pattern = false
        for q in @cue_queue
            pat = @song.tracks[q[0]].patterns[q[1]].pattern
            @synth[q[0]].readPattern(pat)
            @current_cells[q[0]] = q[1]
        @view.drawScene(@scene_pos, @current_cells)
        @next_pattern_pos = []
        @cue_queue = []

    nextScene: (pos) ->
        @is_waiting_next_scene = false
        if not pos?
            @scene_pos++
            pos = @scene_pos
        else
            @scene_pos = pos

        if @scene_pos >= @song_length
            @player.is_playing = false
            return

        for i in [0...@synth.length]
            pat = @song.tracks[i].patterns[pos].pattern
            if pat?
                @synth[i].readPattern(pat)
                @scene_length = Math.max(@scene_length, pat.length)
                @current_cells[i] = pos

        @player.readScene(@song.master[@scene_pos])
        @player.setSceneLength(@scene_length)
        @view.drawScene(@scene_pos)
        @next_pattern_pos = []
        @next_scene_pos = undefined
        @cue_queue = []

    getScene: (i) -> @song.master[i]

    beat: () ->
        if @is_waiting_next_scene
            @view.beat(true, [0, @next_scene_pos])
        else
            @view.beat(false, @cue_queue)

    cuePattern: (synth_num, pat_num) ->
        @is_waiting_next_pattern = true
        @next_pattern_pos[synth_num] = pat_num
        @cue_queue.push([synth_num, pat_num])

    cueScene: (scene_num) ->
        @is_waiting_next_scene = true
        @next_scene_pos = scene_num

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
        @scene_length = 0
        for i in [0...@song.tracks.length]
            pat = @song.tracks[i].patterns[0].pattern
            if pat?
                @synth[i].readPattern(@song.tracks[i].patterns[0].pattern)
                @current_cells[i] = 0
            @song_length = Math.max(@song_length, song.tracks[i].patterns.length)
            @scene_length = Math.max(@scene_length, song.tracks[i].patterns[0].pattern.length)
        @player.readScene(song.master[0])
        @player.setSceneLength(@scene_length)
        @view.readSong(song, @current_cells)

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
