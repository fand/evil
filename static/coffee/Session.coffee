_master =
    name: 'section-0'
    bpm: 120
    key: 'A'
    sclae: 'IONIAN'

SONG_DEFAULT =
    tracks: []
    length: 1
    master: [_master]


class @Session
    constructor: (@ctx, @player) ->
        @scenes = []
        @scene_pos = 0
        @scene = {}
        @scene_length = 32

        @current_cells = []
        @next_pattern_pos = []
        @next_scene_pos = undefined

        @is_loop = true
        @is_waiting_next_pattern = false
        @is_waiting_next_scene = false

        @cue_queue = []

        @song = SONG_DEFAULT

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

        if @scene_pos >= @song.length
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

    play: () ->
        @view.drawScene(@scene_pos)

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

        name = s.id + '-' + pos
        s.readPatternName(name)

        pp = []
        pp[pos] = name: s.pattern_name, pattern: s.pattern
        s_obj = id: s.id, type: 'REZ', name: 'Synth #' + s.id, patterns: pp, params: [], gain: 1.0, pan: 0.0

        @song.tracks.push(s_obj)
        @current_cells.push(pos)

        @view.addSynth(@song)

    setSynth: (@synth) ->

    setPattern: (pat, synth_num, pat_num) ->
        @song.tracks[synth_num].patterns[pat_num] = pat
        if not @song.master[pat_num]?
            @song.master[pat_num] = name: 'section-' + pat_num
        if pat_num + 2 > @song_length
            @song_length = pat_num + 2
            @song.length = pat_num + 2

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

        # Save old pattern (for old @current_cells)
        @savePattern(synth_num, @current_cells[synth_num])

        if @song.tracks[synth_num].patterns[pat_num]?
            @player.synth[synth_num].readPattern(@song.tracks[synth_num].patterns[pat_num])
        else
            # set new pattern
            pat_name = synth_num + '-' + pat_num
            @player.synth[synth_num].clearPattern()
            @player.synth[synth_num].readPatternName(pat_name)
            @song.tracks[synth_num].patterns[pat_num] = @player.synth[synth_num].getPattern()

        # draw
        @current_cells[synth_num] = pat_num
        @view.readSong(@song, @current_cells)
        @player.moveTo(synth_num)

        return [synth_num, pat_num, @song.tracks[synth_num].patterns[pat_num]]

    savePatterns: ->
        for i in [0...@current_cells.length]
            @savePattern(i, @current_cells[i])

    savePattern: (x, y) ->
        if @song.tracks[x].patterns[y]?
            @song.tracks[x].patterns[y].pattern = @player.synth[x].pattern
        else
            @song.tracks[x].patterns[y] = pattern: @player.synth[x].pattern

    saveTracks: ->
        for i in [0...@player.synth.length]
            param = @player.synth[i].getParam()
            if @song.tracks[i].patterns?
                param.patterns = @song.tracks[i].patterns
            @song.tracks[i] = param

    saveMaster: ->
        @song.master[@scene_pos] = @player.getScene()

    saveMasters: ->
        if @song.master == []
            @song.master.push(@player.getScene())

    saveMixer: ->
        @song.mixer = @player.mixer.getParam()

    readTracks: (tracks) ->
        for i in [0...tracks.length]
            @player.synth[i].readParam(tracks[i])

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
        @player.readScene(@song.master[0])
        @player.setSceneLength(@scene_length)
        @readTracks(@song.tracks)
        @player.mixer.readParam(@song.mixer)
        @view.readSong(song, @current_cells)

    saveSong: () ->
        @savePatterns()
        @saveTracks()
        @saveMasters()
        @saveMixer()
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
        @view.drawTrackName(synth_id, name, @song.tracks[synth_id].type)

    setPatternName: (synth_id, name) ->
        pat_num = @current_cells[synth_id]

        if @song.tracks[synth_id].patterns[pat_num]?
            @song.tracks[synth_id].patterns[pat_num].name = name
        else
            @song.tracks[synth_id].patterns[pat_num] = name: name

        @view.drawPatternName(synth_id, pat_num, @song.tracks[synth_id].patterns[pat_num])

    setSongTitle: (title) -> @song.title = @view.song.title = title
    setCreatorName: (name) -> @song.creator = @view.song.creator = name

    changeSynth: (id, type) ->
        s = @player.changeSynth(id, type)

        pat_name = s.id + '-' + @scene_pos
        s.readPatternName(pat_name)

        pp = []
        pp[@scene_pos] = name: pat_name, pattern: s.pattern

        s_obj = id: s.id, type: type, name: 'Synth #' + s.id, patterns: pp, params: [], gain: 1.0, pan: 0.0
        @song.tracks[id] = s_obj
        s.readPattern(pp[@scene_pos])

        @view.changeSynth(id, type)

    empty: ->
        @next_pattern_pos = []
        @scenes = []
        @scene_pos = 0
        @scene = {}
        @scene_length = 32

        @current_cells = []
        @next_pattern_pos = []
        @next_scene_pos = undefined

        @is_loop = true
        @is_waiting_next_pattern = false
        @is_waiting_next_scene = false

        @cue_queue = []

        @song = tracks: [], master: [], length: 0, mixer: []
