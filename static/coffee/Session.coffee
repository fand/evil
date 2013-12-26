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

        @song = tracks: [], master: [], length: 0

        @view = new SessionView(this, @song)

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
        @savePatterns()

        @is_waiting_next_pattern = false
        for q in @cue_queue
            pat = @song.tracks[q[0]].patterns[q[1]]
            @synth[q[0]].readPattern(pat)
            @current_cells[q[0]] = q[1]
        @view.drawScene(@scene_pos, @current_cells)
        @next_pattern_pos = []
        @cue_queue = []

    nextScene: (pos) ->
        @savePatterns()

        @is_waiting_next_scene = false
        if not pos?
            @scene_pos++
            pos = @scene_pos
        else
            @scene_pos = pos

        if @scene_pos >= @song_length
            @player.is_playing = false
            @view.clearAllActive()
            @scene_pos = @next_scene_pos = 0
            return

        for i in [0...@synth.length]
            continue if not @song.tracks[i].patterns[pos]?
            pat = @song.tracks[i].patterns[pos]
            if pat?
                @synth[i].readPattern(pat)
                @scene_length = Math.max(@scene_length, pat.pattern.length)
                @current_cells[i] = pos

        @player.readScene(@song.master[@scene_pos]) if @song.master[@scene_pos]?
        @player.setSceneLength(@scene_length)
        @view.drawScene(@scene_pos)
        @next_pattern_pos = []
        @next_scene_pos = undefined
        @cue_queue = []

    getScene: (i) -> @song.master[i]

    play: () -> @view.drawScene(@scene_pos)

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

    addSynth: (s, _pos) ->
        pos = if _pos then _pos else @scene_pos
        pp = []
        pp[pos] = name: (s.id + '-' + pos), pattern: s.pattern
        s_obj = id: s.id, name: 'Synth #' + s.id, patterns: pp, params: [], gain: 1.0, pan: 0.0
        @song.tracks.push(s_obj)
        @view.readSong(@song, @current_cells)

    setSynth: (@synth) ->


    editPattern: (_synth_num, pat_num) ->
        # add master
        if not @song.master[pat_num]?
            @song.master[pat_num] = name: 'section-' + pat_num
        if pat_num + 2 > @song_length
            @song_length = pat_num + 2
            @song.length = pat_num + 2

        # add track pattern
        synth_num = _synth_num
        if @song.tracks.length <= _synth_num
            synth_num = @song.tracks.length
            @player.addSynth(pat_num)

        if @song.tracks[synth_num].patterns[pat_num]?
            @player.synth[synth_num].readPattern(@song.tracks[synth_num].patterns[pat_num])
        else
            @player.synth[synth_num].clearPattern()
            @player.synth[synth_num].setPatternName(synth_num + '-' + pat_num)
            @song.tracks[synth_num].patterns[pat_num] = @player.synth[synth_num].pattern_obj

        # draw
        @current_cells[synth_num] = pat_num
        @view.readSong(@song, @current_cells)
        @player.moveTo(synth_num)

        return [synth_num, pat_num, @song.tracks[synth_num].patterns[pat_num].pattern]

    savePatterns: ->
        for i in [0...@current_cells.length]
            if @song.tracks[i].patterns[@current_cells[i]]?
                @song.tracks[i].patterns[@current_cells[i]].pattern = @player.synth[i].pattern
            else
                @song.tracks[i].patterns[@current_cells[i]] = pattern: @player.synth[i].pattern

    readSong: (@song) ->
        @scene_pos = 0
        @song_length = 0
        @scene_length = 0
        for i in [0...@song.tracks.length]
            pat = @song.tracks[i].patterns[0].pattern
            if pat?
                @synth[i].readPattern(@song.tracks[i].patterns[0])
                @current_cells[i] = 0
            @song_length = Math.max(@song_length, song.tracks[i].patterns.length)
            @scene_length = Math.max(@scene_length, song.tracks[i].patterns[0].pattern.length)
        @player.readScene(song.master[0])
        @player.setSceneLength(@scene_length)
        @view.readSong(song, @current_cells)

    saveSong: () ->
        console.log(@song)
        song_json = JSON.stringify(@song)
        csrf_token = $('#ajax-form > input[name=csrf_token]').val()
        $.ajax(
            url: '/'
            type: 'POST'
            dataType: 'text'
            data:
                json: song_json
                csrf_token: csrf_token
        ).done((d) =>
            @view.showSuccess(d, @song.title, @song.creator)
        ).fail((err) =>
            @view.showError(err)
        )

    setSynthName: (synth_id, name) ->
        @song.tracks[synth_id].name = name
        @view.drawTrackName(synth_id, name)

    setPatternName: (synth_id, name) ->
        pat_num = @current_cells[synth_id]
        @song.tracks[synth_id].patterns[pat_num].name = name
        @view.drawPatternName(synth_id, pat_num, @song.tracks[synth_id].patterns[pat_num])

    setSongTitle: (title) -> @song.title = @view.song.title = title
    setCreatorName: (name) -> @song.creator = @view.song.creator = name

    changeSynth: (id, type) ->
        s = @player.changeSynth(id, type)
        @synth[id] = s

        pp = []
        pp[@scene_pos] = name: (s.id + '-' + @scene_pos), pattern: s.pattern
        s_obj = id: s.id, name: 'Synth #' + s.id, patterns: pp, params: [], gain: 1.0, pan: 0.0
        @song.tracks[id] = s_obj
        s.readPattern(pp[@scene_pos])
