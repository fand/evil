Panner = require './Panner'
SamplerCore = require './Sampler/Core'
SamplerView = require './Sampler/View'
SAMPLES = require './Sampler/Constant.coffee'
$ = require 'jquery'


class Sampler
    constructor: (@ctx, @id, @player, @name) ->
        @type = 'SAMPLER'
        @name = 'Sampler #' + @id if not @name?

        @pattern_name = 'pattern 0'
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj = name: @pattern_name, pattern: @pattern

        @time = 0
        @view = new SamplerView(this, @id)
        @core = new SamplerCore(this, @ctx, @id)

        @is_sustaining = false
        @session = @player.session

        @send = @ctx.createGain()
        @send.gain.value = 1.0
        @return = @ctx.createGain()
        @return.gain.value = 1.0
        @core.connect(@send)
        @send.connect(@return)

        @effects = []

    connect: (dst) ->
        if dst instanceof Panner
            @return.connect(dst.in)
        else
            @return.connect(dst)

    disconnect: ->
        @return.disconnect()

    setDuration: ->
    setKey:  ->
    setScale: ->
    setNote: (note) -> @core.setNote(note)

    setGain: (gain) -> @core.setGain(gain)
    getGain: ()     -> @core.gain

    noteOn: (note) ->
        @core.noteOn([[note, 1.0]])

    noteOff: -> @core.noteOff()

    playAt: (@time) ->
        mytime = @time % @pattern.length
        @view.playAt(mytime)
        if @pattern[mytime] != 0
            notes = @pattern[mytime]
            @core.noteOn(notes)

    play: () ->
        @view.play()

    stop: () ->
        @core.noteOff()
        @view.stop()

    pause: (time) ->
        @core.noteOff()

    setPattern: (_pattern_obj) ->
        @pattern_obj = $.extend(true, {}, _pattern_obj)
        @pattern = @pattern_obj.pattern
        @pattern_name = @pattern_obj.name
        @view.setPattern(@pattern_obj)

    getPattern: () ->
        @pattern_obj = name: @pattern_name, pattern: @pattern
        $.extend(true, {}, @pattern_obj)

    clearPattern: () ->
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj.pattern = @pattern
        @view.setPattern(@pattern_obj)

    plusPattern: ->
        @pattern = @pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]])
        @player.resetSceneLength()

    minusPattern: ->
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @player.resetSceneLength()

    addNote: (time, note, gain) ->
        if not Array.isArray(@pattern[time])
            @pattern[time] = [[@pattern[time], 1.0]]

        for i in [0...@pattern[time].length]
            if @pattern[time][i][0] == note
                @pattern[time].splice(i, 1)

        @pattern[time].push([note, gain])

    removeNote: (pos) ->
        for i in [0...@pattern[pos.x_abs].length]
            if @pattern[pos.x_abs][i][0] == pos.note
                @pattern[pos.x_abs].splice(i, 1)

    activate: (i) -> @view.activate(i)
    inactivate: (i) -> @view.inactivate(i)

    redraw: (@time) ->
        @view.drawPattern(@time)

    setSynthName: (@name) ->
        @session.setSynthName(@id, @name)
        @view.setSynthName(@name)

    # called by SamplerView.
    inputPatternName: (@pattern_name) ->
        @session.setPatternName(@id, @pattern_name)

    setPatternName: (@pattern_name) ->
        @view.setPatternName(@pattern_name)

    selectSample: (sample_now) ->
        @core.bindSample(sample_now)

    changeSynth: (type) ->
        s_new = @player.changeSynth(@id, type, s_new)
        @view.dom.replaceWith(s_new.view.dom)
        @noteOff(true)
        @disconnect()

    getParam: ->
        p = @core.getParam()
        p.name = @name
        p.effects = @getEffectsParam()
        return p

    setParam: (p) -> @core.setParam(p) if p?

    mute:   -> @core.mute()
    demute: -> @core.demute()

    getEffectsParam: ->
        f.getParam() for f in @effects

    insertEffect: (fx) ->

        if @effects.length == 0
            @send.disconnect()
            @send.connect(fx.in)
        else
            @effects[@effects.length - 1].disconnect()
            @effects[@effects.length - 1].connect(fx.in)

        fx.connect(@return)
        fx.setSource(this)
        @effects.push(fx)


    removeEffect: (fx) ->
        i = @effects.indexOf(fx)
        return if i == -1

        if i == 0
            prev = @send
        else
            prev = @effects[i - 1]

        prev.disconnect()
        if @effects[i + 1]?
            prev.connect(@effects[i + 1].in)
        else
            prev.connect(@return)

        fx.disconnect()
        @effects.splice(i, 1)


# Export!
module.exports = Sampler
