class @SampleNode
    constructor: (@ctx, @id, @parent) ->
        @out = @ctx.createGain()
        @out.gain.value = 1.0
        @name = SAMPLES_DEFAULT[@id]
        @setSample(@name)

        @head = 0.0
        @tail = 1.0
        @speed = 1.0

        # for mono source
        @merger = @ctx.createChannelMerger(2)

        # node to set gain for individual nodes
        @node_buf = @ctx.createGain()
        @node_buf.gain.value = 1.0

        @eq_gains = [0.0, 0.0, 0.0]

        [eq1, eq2, eq3] = [@ctx.createBiquadFilter(), @ctx.createBiquadFilter(), @ctx.createBiquadFilter()]
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf']
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6]
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000]
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = @eq_gains
        @eq_nodes = [eq1, eq2, eq3]

        @panner = new Panner(@ctx)
        @pan_value = 0.5

        @node_buf.connect(eq1)
        eq1.connect(eq2)
        eq2.connect(eq3)
        eq3.connect(@panner.in)
        @panner.connect(@out)


    setSample: (@name) ->
        sample = SAMPLES[@name]
        return if not sample?
        @sample = sample
        if sample.data?
            @buffer = sample.data
        else
            req = new XMLHttpRequest()
            req.open('GET', sample.url, true)
            req.responseType = "arraybuffer"
            req.onload = () =>
                @ctx.decodeAudioData(
                    req.response,
                    ((@buffer) =>
                        @buffer_duration = (@buffer.length / window.SAMPLE_RATE)
                        @parent.sampleLoaded(@id)
                    ),
                    (err) => console.log('ajax error'); console.log(err)
                )
                sample.data = @buffer
            req.send()

    connect: (@dst) -> @out.connect(@dst)

    noteOn: (gain, time) ->
        return if not @buffer?
        @source_old.stop(time) if @source_old?
        source = @ctx.createBufferSource()
        source.buffer = @buffer

        # source.connect(@node_buf)            # for mono source
        source.connect(@merger, 0, 0)     # for stereo source
        source.connect(@merger, 0, 1)
        @merger.connect(@node_buf)

        head_time = time + @buffer_duration * @head
        tail_time = time + @buffer_duration * @tail
        source.playbackRate.value = @speed
        source.start(0)
        @node_buf.gain.value = gain
        @source_old = source

    setTimeParam: (@head, @tail, @speed) ->
    getTimeParam: -> [@head, @tail, @speed]

    setEQParam: (@eq_gains) ->
        [@eq_nodes[0].gain.value, @eq_nodes[1].gain.value, @eq_nodes[2].gain.value] = (g * 0.2 for g in @eq_gains)

    getEQParam: -> @eq_gains

    setOutputParam: (@pan_value, gain) ->
        @panner.setPosition(@pan_value)
        @out.gain.value = gain

    getOutputParam: ->
        [@pan_value, @out.gain.value]

    getData: -> @buffer

    getParam: ->
        wave: @name, time: @getTimeParam(), gains: @eq_gains, output: @getOutputParam()

    setParam: (p) ->
        @setSample(p.wave) if p.wave?
        @setTimeParam(p.time[0], p.time[1], p.time[2]) if p.time?
        @setEQParam(p.gains) if p.gains?
        @setOutputParam(p.output[0], p.output[1]) if p.output?




class @SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @gain = 1.0
        @is_mute = false

        @samples = (new SampleNode(@ctx, i, this) for i in [0...10])

        for i in [0...10]
            @samples[i].connect(@node)

        @view = new SamplerCoreView(this, id, @parent.view.dom.find('.sampler-core'))

    noteOn: (notes) ->
        return if @is_mute
        time = @ctx.currentTime
        if Array.isArray(notes)
            # return if notes.length == 0
            @samples[n[0] - 1].noteOn(n[1], time) for n in notes
        # else
        #     @samples[notes - 1].noteOn(1, time)

    noteOff: ->
        t0 = @ctx.currentTime

    connect: (dst) ->
        @node.connect(dst)

    setSample: (i, name) -> @samples[i].setSample(name)

    setSampleTimeParam: (i, head, tail, speed) ->
        @samples[i].setTimeParam(head, tail, speed)

    setSampleEQParam: (i, lo, mid, hi) ->
        @samples[i].setEQParam([lo, mid, hi])

    setSampleOutputParam: (i, pan, gain) ->
        @samples[i].setOutputParam(pan, gain)

    setGain: (@gain) ->
        @node.gain.value = @gain

    getSampleTimeParam: (i) ->
        @samples[i].getTimeParam()

    getSampleData: (i) ->
        @samples[i].getData()

    getSampleEQParam: (i) ->
        @samples[i].getEQParam()

    getSampleOutputParam: (i) ->
        @samples[i].getOutputParam()

    sampleLoaded: (id) ->
        @view.updateWaveformCanvas(id)

    bindSample: (sample_now) ->
        @view.bindSample(sample_now, @samples[sample_now].getParam())
        @view.setSampleTimeParam(@getSampleTimeParam(sample_now))
        @view.setSampleEQParam(@getSampleEQParam(sample_now))
        @view.setSampleOutputParam(@getSampleOutputParam(sample_now))

    getParam: ->
        type: 'SAMPLER'
        samples: (s.getParam() for s in @samples)

    setParam: (p) ->
        if p.samples?
            for i in [0...p.samples.length]
                @samples[i].setParam(p.samples[i])
        @bindSample(0)


    mute:   -> @is_mute = true
    demute: -> @is_mute = false



class @Sampler
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



# -------------------------------
# Samples DATA
#

SAMPLES_DEFAULT = [
    'bd_909dwsd', 'bd_sub808',
    'snr_drm909kit1', 'snr_mpc',
    'clp_raw', 'clp_basics',
    'hat_lilcloser', 'hat_nice909open',
    'shaker_bot', 'tam_lifein2d'
]

@SAMPLES =
    'kick1':  url: 'static/wav/kick1.wav'
    'kick2':  url: 'static/wav/kick2.wav'
    'snare1': url: 'static/wav/snare1.wav'
    'snare2': url: 'static/wav/snare2.wav'
    'clap':   url: 'static/wav/clap.wav'
    'hat_closed': url: 'static/wav/hat_closed.wav'
    'hat_open': url: 'static/wav/hat_open.wav'
    'ride': url: 'static/wav/ride.wav'

    'bd_909dwsd': url: 'static/wav/deep_house/bd_kick/bd_909dwsd.wav'
    'bd_chicago': url: 'static/wav/deep_house/bd_kick/bd_chicago.wav'
    'bd_dandans': url: 'static/wav/deep_house/bd_kick/bd_dandans.wav'
    'bd_deephouser': url: 'static/wav/deep_house/bd_kick/bd_deephouser.wav'
    'bd_diesel': url: 'static/wav/deep_house/bd_kick/bd_diesel.wav'
    'bd_dropped': url: 'static/wav/deep_house/bd_kick/bd_dropped.wav'
    'bd_flir': url: 'static/wav/deep_house/bd_kick/bd_flir.wav'
    'bd_gas': url: 'static/wav/deep_house/bd_kick/bd_gas.wav'
    'bd_ghost': url: 'static/wav/deep_house/bd_kick/bd_ghost.wav'
    'bd_hybrid': url: 'static/wav/deep_house/bd_kick/bd_hybrid.wav'
    'bd_isampleoldskool': url: 'static/wav/deep_house/bd_kick/bd_isampleoldskool.wav'
    'bd_liked': url: 'static/wav/deep_house/bd_kick/bd_liked.wav'
    'bd_mainroom': url: 'static/wav/deep_house/bd_kick/bd_mainroom.wav'
    'bd_mirror': url: 'static/wav/deep_house/bd_kick/bd_mirror.wav'
    'bd_nash': url: 'static/wav/deep_house/bd_kick/bd_nash.wav'
    'bd_newyear': url: 'static/wav/deep_house/bd_kick/bd_newyear.wav'
    'bd_organicisin': url: 'static/wav/deep_house/bd_kick/bd_organicisin.wav'
    'bd_outdoor': url: 'static/wav/deep_house/bd_kick/bd_outdoor.wav'
    'bd_shoein': url: 'static/wav/deep_house/bd_kick/bd_shoein.wav'
    'bd_sodeep': url: 'static/wav/deep_house/bd_kick/bd_sodeep.wav'
    'bd_sonikboom': url: 'static/wav/deep_house/bd_kick/bd_sonikboom.wav'
    'bd_streek': url: 'static/wav/deep_house/bd_kick/bd_streek.wav'
    'bd_stripped': url: 'static/wav/deep_house/bd_kick/bd_stripped.wav'
    'bd_sub808': url: 'static/wav/deep_house/bd_kick/bd_sub808.wav'
    'bd_tech': url: 'static/wav/deep_house/bd_kick/bd_tech.wav'
    'bd_tripper': url: 'static/wav/deep_house/bd_kick/bd_tripper.wav'
    'bd_uma': url: 'static/wav/deep_house/bd_kick/bd_uma.wav'
    'bd_untitled': url: 'static/wav/deep_house/bd_kick/bd_untitled.wav'
    'bd_vintager': url: 'static/wav/deep_house/bd_kick/bd_vintager.wav'
    'bd_vinylinstereo': url: 'static/wav/deep_house/bd_kick/bd_vinylinstereo.wav'

    'snr_analogging': url: 'static/wav/deep_house/snare/snr_analogging.wav'
    'snr_answer8bit': url: 'static/wav/deep_house/snare/snr_answer8bit.wav'
    'snr_bland': url: 'static/wav/deep_house/snare/snr_bland.wav'
    'snr_drm909kit': url: 'static/wav/deep_house/snare/snr_drm909kit.wav'
    'snr_dwreal': url: 'static/wav/deep_house/snare/snr_dwreal.wav'
    'snr_housey': url: 'static/wav/deep_house/snare/snr_housey.wav'
    'snr_mpc': url: 'static/wav/deep_house/snare/snr_mpc.wav'
    'snr_myclassicsnare': url: 'static/wav/deep_house/snare/snr_myclassicsnare.wav'
    'snr_owned': url: 'static/wav/deep_house/snare/snr_owned.wav'
    'snr_royalty': url: 'static/wav/deep_house/snare/snr_royalty.wav'
    'snr_rusnarious': url: 'static/wav/deep_house/snare/snr_rusnarious.wav'
    'snr_truevintage': url: 'static/wav/deep_house/snare/snr_truevintage.wav'

    'clp_analogue': url: 'static/wav/deep_house/clap/clp_analogue.wav'
    'clp_applause': url: 'static/wav/deep_house/clap/clp_applause.wav'
    'clp_basics': url: 'static/wav/deep_house/clap/clp_basics.wav'
    'clp_can': url: 'static/wav/deep_house/clap/clp_can.wav'
    'clp_clap10000': url: 'static/wav/deep_house/clap/clp_clap10000.wav'
    'clp_classic': url: 'static/wav/deep_house/clap/clp_classic.wav'
    'clp_clipper': url: 'static/wav/deep_house/clap/clp_clipper.wav'
    'clp_delma': url: 'static/wav/deep_house/clap/clp_delma.wav'
    'clp_donuts': url: 'static/wav/deep_house/clap/clp_donuts.wav'
    'clp_drastik': url: 'static/wav/deep_house/clap/clp_drastik.wav'
    'clp_eternity': url: 'static/wav/deep_house/clap/clp_eternity.wav'
    'clp_happiness': url: 'static/wav/deep_house/clap/clp_happiness.wav'
    'clp_kiddo': url: 'static/wav/deep_house/clap/clp_kiddo.wav'
    'clp_knowledge': url: 'static/wav/deep_house/clap/clp_knowledge.wav'
    'clp_kournikova': url: 'static/wav/deep_house/clap/clp_kournikova.wav'
    'clp_raw': url: 'static/wav/deep_house/clap/clp_raw.wav'
    'clp_scorch': url: 'static/wav/deep_house/clap/clp_scorch.wav'
    'clp_socute': url: 'static/wav/deep_house/clap/clp_socute.wav'
    'clp_sustained': url: 'static/wav/deep_house/clap/clp_sustained.wav'
    'clp_tayo': url: 'static/wav/deep_house/clap/clp_tayo.wav'
    'clp_tense': url: 'static/wav/deep_house/clap/clp_tense.wav'
    'clp_thinlayer': url: 'static/wav/deep_house/clap/clp_thinlayer.wav'
    'clp_verona': url: 'static/wav/deep_house/clap/clp_verona.wav'

    'hat_626': url: 'static/wav/deep_house/hats/hat_626.wav'
    'hat_ace': url: 'static/wav/deep_house/hats/hat_ace.wav'
    'hat_addverb': url: 'static/wav/deep_house/hats/hat_addverb.wav'
    'hat_analog': url: 'static/wav/deep_house/hats/hat_analog.wav'
    'hat_bebias': url: 'static/wav/deep_house/hats/hat_bebias.wav'
    'hat_bestfriend': url: 'static/wav/deep_house/hats/hat_bestfriend.wav'
    'hat_bigdeal': url: 'static/wav/deep_house/hats/hat_bigdeal.wav'
    'hat_blackmamba': url: 'static/wav/deep_house/hats/hat_blackmamba.wav'
    'hat_chart': url: 'static/wav/deep_house/hats/hat_chart.wav'
    'hat_charter': url: 'static/wav/deep_house/hats/hat_charter.wav'
    'hat_chipitaka': url: 'static/wav/deep_house/hats/hat_chipitaka.wav'
    'hat_classical': url: 'static/wav/deep_house/hats/hat_classical.wav'
    'hat_classichousehat': url: 'static/wav/deep_house/hats/hat_classichousehat.wav'
    'hat_closer': url: 'static/wav/deep_house/hats/hat_closer.wav'
    'hat_collective': url: 'static/wav/deep_house/hats/hat_collective.wav'
    'hat_crackers': url: 'static/wav/deep_house/hats/hat_crackers.wav'
    'hat_critters': url: 'static/wav/deep_house/hats/hat_critters.wav'
    'hat_cuppa': url: 'static/wav/deep_house/hats/hat_cuppa.wav'
    'hat_darkstar': url: 'static/wav/deep_house/hats/hat_darkstar.wav'
    'hat_deephouseopen': url: 'static/wav/deep_house/hats/hat_deephouseopen.wav'
    'hat_drawn': url: 'static/wav/deep_house/hats/hat_drawn.wav'
    'hat_freekn': url: 'static/wav/deep_house/hats/hat_freekn.wav'
    'hat_gater': url: 'static/wav/deep_house/hats/hat_gater.wav'
    'hat_glitchbitch': url: 'static/wav/deep_house/hats/hat_glitchbitch.wav'
    'hat_hatgasm': url: 'static/wav/deep_house/hats/hat_hatgasm.wav'
    'hat_hattool': url: 'static/wav/deep_house/hats/hat_hattool.wav'
    'hat_jelly': url: 'static/wav/deep_house/hats/hat_jelly.wav'
    'hat_kate': url: 'static/wav/deep_house/hats/hat_kate.wav'
    'hat_lights': url: 'static/wav/deep_house/hats/hat_lights.wav'
    'hat_lilcloser': url: 'static/wav/deep_house/hats/hat_lilcloser.wav'
    'hat_mydustyhouse': url: 'static/wav/deep_house/hats/hat_mydustyhouse.wav'
    'hat_myfavouriteopen': url: 'static/wav/deep_house/hats/hat_myfavouriteopen.wav'
    'hat_negative6': url: 'static/wav/deep_house/hats/hat_negative6.wav'
    'hat_nice909open': url: 'static/wav/deep_house/hats/hat_nice909open.wav'
    'hat_niner0niner': url: 'static/wav/deep_house/hats/hat_niner0niner.wav'
    'hat_omgopen': url: 'static/wav/deep_house/hats/hat_omgopen.wav'
    'hat_openiner': url: 'static/wav/deep_house/hats/hat_openiner.wav'
    'hat_original': url: 'static/wav/deep_house/hats/hat_original.wav'
    'hat_quentin': url: 'static/wav/deep_house/hats/hat_quentin.wav'
    'hat_rawsample': url: 'static/wav/deep_house/hats/hat_rawsample.wav'
    'hat_retired': url: 'static/wav/deep_house/hats/hat_retired.wav'
    'hat_sampleking': url: 'static/wav/deep_house/hats/hat_sampleking.wav'
    'hat_samplekingdom': url: 'static/wav/deep_house/hats/hat_samplekingdom.wav'
    'hat_sharp': url: 'static/wav/deep_house/hats/hat_sharp.wav'
    'hat_soff': url: 'static/wav/deep_house/hats/hat_soff.wav'
    'hat_spreadertrick': url: 'static/wav/deep_house/hats/hat_spreadertrick.wav'
    'hat_stereosonic': url: 'static/wav/deep_house/hats/hat_stereosonic.wav'
    'hat_tameit': url: 'static/wav/deep_house/hats/hat_tameit.wav'
    'hat_vintagespread': url: 'static/wav/deep_house/hats/hat_vintagespread.wav'
    'hat_void': url: 'static/wav/deep_house/hats/hat_void.wav'

    'shaker_bot': url: 'static/wav/deep_house/shaker_tambourine/shaker_bot.wav'
    'shaker_broom': url: 'static/wav/deep_house/shaker_tambourine/shaker_broom.wav'
    'shaker_command': url: 'static/wav/deep_house/shaker_tambourine/shaker_command.wav'
    'shaker_halfshake': url: 'static/wav/deep_house/shaker_tambourine/shaker_halfshake.wav'
    'shaker_pause': url: 'static/wav/deep_house/shaker_tambourine/shaker_pause.wav'
    'shaker_quicky': url: 'static/wav/deep_house/shaker_tambourine/shaker_quicky.wav'
    'shaker_really': url: 'static/wav/deep_house/shaker_tambourine/shaker_really.wav'
    'tam_christmassy': url: 'static/wav/deep_house/shaker_tambourine/tam_christmassy.wav'
    'tam_extras': url: 'static/wav/deep_house/shaker_tambourine/tam_extras.wav'
    'tam_hohoho': url: 'static/wav/deep_house/shaker_tambourine/tam_hohoho.wav'
    'tam_lifein2d': url: 'static/wav/deep_house/shaker_tambourine/tam_lifein2d.wav'
    'tam_mrhat': url: 'static/wav/deep_house/shaker_tambourine/tam_mrhat.wav'

    'tom_909fatty': url: 'static/wav/deep_house/toms/tom_909fatty.wav'
    'tom_909onvinyl': url: 'static/wav/deep_house/toms/tom_909onvinyl.wav'
    'tom_cleansweep': url: 'static/wav/deep_house/toms/tom_cleansweep.wav'
    'tom_dept': url: 'static/wav/deep_house/toms/tom_dept.wav'
    'tom_discodisco': url: 'static/wav/deep_house/toms/tom_discodisco.wav'
    'tom_eclipse': url: 'static/wav/deep_house/toms/tom_eclipse.wav'
    'tom_enriched': url: 'static/wav/deep_house/toms/tom_enriched.wav'
    'tom_enrico': url: 'static/wav/deep_house/toms/tom_enrico.wav'
    'tom_greatwhite': url: 'static/wav/deep_house/toms/tom_greatwhite.wav'
    'tom_iloveroland': url: 'static/wav/deep_house/toms/tom_iloveroland.wav'
    'tom_madisonave': url: 'static/wav/deep_house/toms/tom_madisonave.wav'
    'tom_ofalltoms': url: 'static/wav/deep_house/toms/tom_ofalltoms.wav'
    'tom_summerdayze': url: 'static/wav/deep_house/toms/tom_summerdayze.wav'
    'tom_taste': url: 'static/wav/deep_house/toms/tom_taste.wav'
    'tom_vsneve': url: 'static/wav/deep_house/toms/tom_vsneve.wav'

    'prc_808rimmer': url: 'static/wav/deep_house/percussion/prc_808rimmer.wav'
    'prc_bigdrum': url: 'static/wav/deep_house/percussion/prc_bigdrum.wav'
    'prc_bongodrm': url: 'static/wav/deep_house/percussion/prc_bongodrm.wav'
    'prc_bongorock': url: 'static/wav/deep_house/percussion/prc_bongorock.wav'
    'prc_boxed': url: 'static/wav/deep_house/percussion/prc_boxed.wav'
    'prc_change': url: 'static/wav/deep_house/percussion/prc_change.wav'
    'prc_clav': url: 'static/wav/deep_house/percussion/prc_clav.wav'
    'prc_congaz': url: 'static/wav/deep_house/percussion/prc_congaz.wav'
    'prc_dnthavacowman': url: 'static/wav/deep_house/percussion/prc_dnthavacowman.wav'
    'prc_drop': url: 'static/wav/deep_house/percussion/prc_drop.wav'
    'prc_emtythepot': url: 'static/wav/deep_house/percussion/prc_emtythepot.wav'
    'prc_flickingabucket': url: 'static/wav/deep_house/percussion/prc_flickingabucket.wav'
    'prc_foryoursampler': url: 'static/wav/deep_house/percussion/prc_foryoursampler.wav'
    'prc_harmony': url: 'static/wav/deep_house/percussion/prc_harmony.wav'
    'prc_hit': url: 'static/wav/deep_house/percussion/prc_hit.wav'
    'prc_home': url: 'static/wav/deep_house/percussion/prc_home.wav'
    'prc_itgoespop': url: 'static/wav/deep_house/percussion/prc_itgoespop.wav'
    'prc_jungledrummer': url: 'static/wav/deep_house/percussion/prc_jungledrummer.wav'
    'prc_knockknock': url: 'static/wav/deep_house/percussion/prc_knockknock.wav'
    'prc_reworked': url: 'static/wav/deep_house/percussion/prc_reworked.wav'
    'prc_rolled': url: 'static/wav/deep_house/percussion/prc_rolled.wav'
    'prc_syntheticlav': url: 'static/wav/deep_house/percussion/prc_syntheticlav.wav'
    'prc_trainstation': url: 'static/wav/deep_house/percussion/prc_trainstation.wav'
    'prc_u5510n': url: 'static/wav/deep_house/percussion/prc_u5510n.wav'
    'prc_vinylshot': url: 'static/wav/deep_house/percussion/prc_vinylshot.wav'
    'prc_virustiatmos': url: 'static/wav/deep_house/percussion/prc_virustiatmos.wav'
    'prc_youpanit': url: 'static/wav/deep_house/percussion/prc_youpanit.wav'

    'cym_crashtest': url: 'static/wav/deep_house/ride_cymbal/cym_crashtest.wav'
    'cym_gatecrashed': url: 'static/wav/deep_house/ride_cymbal/cym_gatecrashed.wav'
    'ride_8bitdirty': url: 'static/wav/deep_house/ride_cymbal/ride_8bitdirty.wav'
    'ride_cymbal1': url: 'static/wav/deep_house/ride_cymbal/ride_cymbal1.wav'
    'ride_full': url: 'static/wav/deep_house/ride_cymbal/ride_full.wav'
    'ride_jules': url: 'static/wav/deep_house/ride_cymbal/ride_jules.wav'
    'ride_mpc60': url: 'static/wav/deep_house/ride_cymbal/ride_mpc60.wav'
