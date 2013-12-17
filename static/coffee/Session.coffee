class @Session
    constructor: (@synth) ->
        @scenes = []
        @scene_pos = 0
        @scene = {}

        @next_pattern

        @is_loop = true
        @is_waiting_next_pattern = false
        @is_waiting_next_scene = false

        @view = new SessionView(this)

    nextPattern: () ->
        @is_waiting_next_pattern = false
        for i in [0...@synth.length]
            if @next_pattern[i]?
                pat = @song[i][@next_pattern[i]]
                @synth[i].readPattern(pat)

    nextScene: (pos) ->
        if not pos?
            @scene_pos++
            pos = @scene_pos
        for i in [0...@synth.length]
            pat = @song[i][pos]
            @synth[i].readPattern(pat) if pat?

    cue: (synth_num, pat_num) ->
        @is_waiting_next_pattern = true
        @next_pattern[synth_num] = pat_num

    next: () ->
        @nextScene()
        @nextPattern()

    addSynth: (s) ->
        @view.addSynth()
