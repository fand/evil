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
        @scene =
            bpm: @bpm
            key: @freq_key
            patterns: [[8,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

        @context = CONTEXT
        @synth = [new Synth(@context, 42)]
        @synth_now = @synth[0]
        for s in @synth
            s.connect(@context.destination)
        
        @view = new PlayerView(this)

    setBPM: (@bpm) ->
        @duration = 15.0 / @bpm * 1000  # msec
        s.setDuration(@duration) for s in @synth
        
    setKey: (key)->
        @freq_key = KEY_LIST[key]
        s.setKey(@freq_key) for s in @synth
            
    setScale: (scale) ->
        @scale = SCALE_LIST[scale]
        s.setScale(@scale) for s in @synth

    addNote: (time, note) ->
        @pattern[time] = note
    
    removeNote: (time) ->
        @pattern[time] = 0

    isPlaying: -> @is_playing

    play: (pos) ->
        @is_playing = true
        @time = pos if pos?        
        T.setTimeout(( => @play_seq()), 100)

    play_seq: ->
        if @is_playing
            if @time >= @scene.num_measure * 32
                @time = 0                
            s.play(@time) for s in @synth
            T.setTimeout(( => @time++; @play_seq()), @duration)
            
    stop: ->
        s.stop() for s in @synth
        @is_playing = false
        @time = @scene.num_measure * 32 - 1

    pause: ->
        @noteOff()
        @is_playing = false
        
    noteOn: (note)->
        for s in @synth
            s.noteOn(note)
            
    noteOff: ->
        for s in @synth
            s.noteOff()

    intervalToSemitone: (ival) ->
        Math.floor((ival-1)/7) * 12 + @scale[(ival-1) % 7]


    readSong: (song) -> null
        
    readPattern: (pat) ->        
        $(".on").removeClass("on").addClass("off")

        for i in [0...pat.length]
            if pat[i] != 0
                $("tr").eq(10 - pat[i]).find("td").eq(i).removeClass("off").addClass("on")

        @pattern = pat

    getPattern: -> @pattern

    readScene: (@scene) ->
        patterns = @scene.patterns
        while patterns.length > @synth.length
            @synth.push(new Synth())
        for i in [0...patterns.length]
            @synth[i].readPattern(patterns[i])



class @PlayerView
    constructor: (@model) ->
        @dom = $("#control")

        @play  = @dom.find('[name=play]')
        @stop  = @dom.find('[name=stop]')        
                
        @bpm   = @dom.find("[name=bpm]")
        @key   = @dom.find("[name=key]")
        @scale = @dom.find("[name=mode]")

        @setBPM()
        @setKey()
        @setScale()
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
                @play.attr("value", "play")
            else 
                @model.play()
                @play.attr("value", "pause")
        )
        @stop.on('mousedown', () =>
            @model.stop()
            @play.attr("value", "play")
        )

    setBPM:   ->  @model.setBPM(parseInt(@bpm.val()))
    setKey:   ->  @model.setKey(@key.val())
    setScale: ->  @model.setScale(@scale.val())



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
    
    scn =
        num_measure: 1
        patterns: [[3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2]]
    player.readScene(scn)
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
    
