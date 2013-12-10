SEMITONE = 1.05946309
STREAM_LENGTH = 1024
SAMPLE_RATE = 48000
T = new MutekiTimer()


class @VCO
    constructor: ->
        @freq_key = 55
        @shape = "SINE"
        @octave = 4
        @interval = 0
        @fine = 0
        @note = 0
        @freq = Math.pow(2, @octave) * @freq_key

        # 48000 / freq = 1周期当りのサンプル数
        @period_sample = SAMPLE_RATE / @freq;
        @phase = 0;
        @d_phase = (2.0 * Math.PI) / @period_sample;
        
    setShape: (@shape) ->
    setOctave: (@octave) ->
    setInterval: (@interval) ->
    setFine: (@fine) ->
    setNote: (@note) ->
    setKey: (@freq_key) ->
        
    setFreq: ->
        @freq = (Math.pow(2, @octave) * Math.pow(SEMITONE, @interval + @note) * @freq_key) + @fine
        @period_sample = SAMPLE_RATE / @freq
        @d_phase = (2.0 * Math.PI) / @period_sample
        
    sine: ->
        Math.cos(@phase * @d_phase)
    triangle: ->
        saw2 = @saw() * 2.0;
        switch
            when saw2 < -1.0 then saw2 + 2.0
            when saw2 <  1.0 then saw2 + 2.0
            else saw2 - 2.0
    saw: ->
        p = @phase % @period_sample
        1.99 * (p / @period_sample) - 1.0
    rect: ->
        if @sine() > 0 then -1.0 else 1.0
    noise: -> Math.random()

    nextSample: ->
        @phase++
        switch @shape
            when "SINE"     then @sine()
            when "TRIANGLE" then @triangle()
            when "SAW"      then @saw()
            when "RECT"     then @rect()
            when "NOISE"    then @noise()
            else                 @sine()
        
    nextStream: ->
        (@nextSample() for i in [0...STREAM_LENGTH])



class @EG
    constructor: ->
        @time = 0
        @on = false
        @envelope = 0.0

        @attack = 0
        @decay = 0
        @sustain = 0.0
        @release = 0

    setParam: (@attack, @decay, sustain, @release) ->
        @sustain = sustain / 100.0
    getParam: -> [@attack, @decay, @sustain, @release]
    
    noteOn: ->
        @time = 0
        @on = true
    noteOff: ->
        @time = 0
        @on = false
        @envelope_released = @envelope

    step: -> @time++

    getEnvelope: ->
        if @on 
            if @time < @attack
                @envelope = 1.0 * (@time / @attack)
            else if @time < (@attack + @decay)
                e = ((@time - @attack) / @decay) * (1.0 - @sustain)
                @envelope = 1.0 - e
            else 
               @envelope = @sustain
        else
            if @time < @release
                @envelope = @envelope_released * (@release-@time) / @release
            else
                @envelope = 0.0
        @envelope



class @ResFilter
    constructor: (ctx) ->
        @lpf = ctx.createBiquadFilter()
        @lpf.type = 0  # lowpass == 0
        @freq_min  = 80
        @freq      = 5000
        @resonance = 10
        @Q         = 10
        
    connect:    (dst)  -> @lpf.connect(dst)
    connectFEG: (@feg) ->        
    getNode:           -> @lpf
    getResonance:      -> @Q
    
    setFreq: (freq) ->
        @freq = Math.pow(freq/1000, 2.0) * 25000
        
    setQ: (@q) ->
          @lpf.Q.value = @Q
        
    update: ->
        @lpf.frequency.value = @freq * @feg.getEnvelope() + @freq_min



class @SynthCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createJavaScriptNode(STREAM_LENGTH, 1, 2)
        @is_initialized = false
        @vco  = [new VCO(), new VCO(), new VCO()]
        @gain = [1.0, 1.0, 1.0]
        
        @eg  = new EG()
        @feg = new EG()
        
        @filter = new ResFilter(@ctx)
        @filter.connectFEG(@feg);

        # resonance用ノイズ生成
        @vco_res = new VCO()
        @vco_res.setShape("NOISE")

        @ratio      = 1.0
        @freq_key   = 0
        @is_playing = false
    
        @view = new SynthCoreView(this, id, @parent.view.dom.find('.core'))

    setVCOParam: (i, shape, oct, interval, fine) ->
        @vco[i].setShape(shape)
        @vco[i].setOctave(oct)
        @vco[i].setInterval(interval)
        @vco[i].setFine(fine)
        @vco[i].setFreq()
        
    setEGParam:  (a, d, s, r) -> @eg.setParam(a, d, s, r)
    
    setFEGParam: (a, d, s, r) -> @feg.setParam(a, d, s, r)
    
    setFilterParam: (freq, q) ->
        @filter.setFreq(freq)
        @filter.setQ(q)
        
    setGain: (i, gain) -> @gain[i] = gain / 100.0

    nextStream: ->
        res    = @filter.getResonance()

        s_vco = (j.nextStream() for j in @vco)
        s_res = @vco_res.nextStream()
        
        stream = []
        for i in [0...STREAM_LENGTH]
            @eg.step()
            @feg.step()
            @filter.update()
            
            env = @eg.getEnvelope()
            stream[i] = 0
            for j in [0...@vco.length]
                stream[i] += s_vco[j][i] * @gain[j] *0.3 * env
            if res > 1
                stream[i] += s_res[i] * 0.1 * (res/1000.0)
        stream

    noteOn: ->
        @is_playing = true
        @eg.noteOn()
        @feg.noteOn()
        @initNode() unless @is_initialized

    noteOff: ->
        @is_playing = false
        @eg.noteOff()
        @feg.noteOff()

    initNode: ->
        @is_initialized = true
        @node.onaudioprocess = (event) =>
            data_L = event.outputBuffer.getChannelData(0);
            data_R = event.outputBuffer.getChannelData(1);
            s = @nextStream()
            for i in [0...data_L.length]
                data_L[i] = data_R[i] = s[i]

    setKey: (@freq_key) ->
        v.setKey(@freq_key) for v in @vco
    setScale: (@scale) ->

    isPlaying: -> @is_playing

    connect: (dst) ->
        @node.connect(@filter.getNode())
        @filter.connect(dst)
    setNote: (note) ->
        for v in @vco
            v.setNote(note)
            v.setFreq()



class @SynthCoreView
    constructor: (@model, @id, @dom) ->
             
        @vcos = $(@dom.find('.vco'))
        
        @EG_inputs     = @dom.find('.EG > input')
        @FEG_inputs    = @dom.find('.FEG > input')    
        @filter_inputs = @dom.find(".filter input")
        @gain_inputs   = @dom.find('.gain > input')

        @canvasEG   = @dom.find(".canvasEG").get()[0]
        @canvasFEG  = @dom.find(".canvasFEG").get()[0]
        @contextEG  = @canvasEG.getContext('2d')
        @contextFEG = @canvasFEG.getContext('2d')
        
        @initEvent()

    initEvent: ->
        @vcos.on("change", () => @setVCOParam())
        @gain_inputs.on("change", () => @setGain())
        @filter_inputs.on("change", () => @setFilterParam())
        @EG_inputs.on("change", () => @setEGParam())
        @FEG_inputs.on("change", () => @setFEGParam())
        @setParam()

    updateCanvas: (name) ->
        canvas  = null
        context = null
        adsr    = null
        if name == "EG"
            canvas  = @canvasEG
            context = @contextEG
            adsr    = @model.eg.getParam()
        else
            canvas  = @canvasFEG
            context = @contextFEG
            adsr    = @model.feg.getParam()

        w = canvas.width = 180
        h = canvas.height = 50
        w4 = w/4
        context.clearRect(0,0,w,h)
        context.beginPath();
        context.moveTo(w4 * (1.0- adsr[0]/50000.0), h);
        context.lineTo(w/4,0);                                        # attack
        context.lineTo(w4 + (w4)*(adsr[1]/50000.0), h*(1.0-adsr[2]));  # decay
        context.lineTo(w4 * 3, h*(1.0-adsr[2]));                      # sustain
        context.lineTo(w4 * 3 + (w4)*(adsr[3]/50000.0), h);           # release
        context.strokeStyle = 'rgb(0, 220, 255)'
        context.stroke()

    setParam: ->
        @setVCOParam()
        @setEGParam()
        @setFEGParam()
        @setFilterParam()
        @setGain()

    setVCOParam: ->        
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            @model.setVCOParam(
                i, 
                vco.find('.shape').val(),
                parseInt(vco.find('.octave').val()),
                parseInt(vco.find('.interval').val()),
                parseInt(vco.find('.fine').val())
            )

    setEGParam: ->
        @model.setEGParam(
            parseInt(@EG_inputs.eq(0).val()),
            parseInt(@EG_inputs.eq(1).val()),
            parseInt(@EG_inputs.eq(2).val()),
            parseInt(@EG_inputs.eq(3).val())
        )
        @updateCanvas("EG");

    setFEGParam: ->
        @model.setFEGParam(
            parseInt(@FEG_inputs.eq(0).val()),
            parseInt(@FEG_inputs.eq(1).val()),
            parseInt(@FEG_inputs.eq(2).val()),
            parseInt(@FEG_inputs.eq(3).val())
        );
        @updateCanvas("FEG");

    setFilterParam: ->
        @model.setFilterParam(
            parseInt(@filter_inputs.eq(0).val()),
            parseInt(@filter_inputs.eq(1).val())
        )

    setGain: ->
        for i in [0... @gain_inputs.length]
            @model.setGain(i, parseInt(@gain_inputs.eq(i).val()))



class @Synth
    constructor: (@ctx, @id) ->
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @time = 0
        @scale = []
        
        @view = new SynthView(this)
        @core = new SynthCore(this, @ctx, @id)

    connect: (dst) -> @core.connect(dst)
    
    setDuration: (@duration) -> @view.setDuration(@duration, @time)
    setKey:  (key) -> @core.setKey(key)
    setScale: (@scale) ->
    setNote: (note) -> @core.setNote(note)
    
    noteToSemitone: (ival) ->
        Math.floor((ival-1)/7) * 12 + @scale[(ival-1) % 7]

    noteOn: (note) ->
        @core.setNote(note)
        @core.noteOn()
        
    noteOff: -> @core.noteOff()

    playAt: (@time) ->
        if @pattern[@time] != 0
            @noteOn(@noteToSemitone(@pattern[@time]))
            T.setTimeout(( =>
                @core.noteOff()
                ), @duration - 10)
                
    play: -> @view.play()                
    stop: () ->
        @noteOff()
        @view.stop()

    pause: (time) ->
        @noteOff()
        @view.pause(time)

    readPattern: (@pattern) ->
        @view.readPattern(@pattern)        

    addNote: (time, note) ->
        @pattern[time] = note
        
    removeNote: (time) ->
        @pattern[time] = 0


                                                                                                                                
class @SynthView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_synth').clone()
        @dom.attr('id', 'synth' + id)        
        $("#instruments").append(@dom)
                
        @indicator = @dom.find('.indicator')
        @table = @dom.find('.table').eq(0)
        @rows  = @dom.find('tr').each(-> $(this).find('td'))
        @cells = @dom.find('td')

        @time = 0
        @page_total = 1
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @duration = 0

        @initEvent()

    initEvent: ->
        @dom.find("td").each(() -> $(this).addClass("off"))
    
        @dom.find("tr").on("mouseenter", (event) ->
            @mouse_note = $(this).attr("note")
        )

        self = this
        @dom.find("td").on('mousedown', () ->
            self.mouse_pressed = true
            mouse_time = +($(this).data('x'))
            mouse_note = +($(this).data('y'))

            if $(this).hasClass("on")
                $(this).removeClass()
                self.removeNote($(this).text())
            else
                self.rows.each( ->
                    $(this).find('td').eq(mouse_time).removeClass()
                )
                $(this).addClass("on")
                self.model.addNote(mouse_time, mouse_note)
        ).on('mouseenter', () ->
            if self.mouse_pressed
                mouse_time = +($(this).data('x'))
                mouse_note = +($(this).data('y'))

                self.rows.each( ->
                    $(this).find('td').eq(mouse_time).removeClass()
                )
                $(this).addClass("on")
                self.model.addNote(mouse_time, mouse_note)
        ).on('mouseup', () ->
            self.mouse_pressed = false
        )

        @rows.on('mouseup', ( -> self.mouse_pressed = false))

        @dom.find('th')
            .on('mousedown', ( -> self.model.noteOn(self.model.noteToSemitone($(this).data('y')))))
            .on("mouseup", ( -> self.model.noteOff()))        

    readPattern: (@pattern) ->
        @cells.removeClass()
        for i in [0...@pattern.length]
            y = 10 - @pattern[i]
            @rows.eq(y).find('td').eq(i).addClass('on') if @pattern[i] != 0
        @page_total = @pattern.length / 32
        @resetAnimation()

    setDuration: (duration, @time) ->       
        @duration = duration * 32 / 985
        @resetAnimation()

    play: ->
        @table.css('-webkit-animation-play-state', 'running')
        @indicator.css({ 'display': 'block', '-webkit-animation-play-state': 'running' })

    pause: (@time) ->
        @resetAnimation()

    stop: ->
        @time = 0
        @indicator.css("display", "none")
        @resetAnimation()

    # requirements:
    #   @time, @pattern, @page_total, @duration
    resetAnimation: ->
        @page = Math.floor((@time % @pattern.length) / 32)
        page_left = @page_total - @page - 1
        remain = @duration * (32 - (@time % 32)) /32

        if @time == 0
            @setTableAnimation([
                ['0', @page_total, @page_total * @duration, @page_total, 0, 'infinite']])
            @setIndicatorAnimation([
                ['0', @duration, 32, 0, 'infinite']])
        else
            @setTableAnimation([
                [(@page + 1), @page_total, page_left * @duration, (page_left + 1), remain, '1'],
                ['0', @page_total, @duration * @page_total, @page_total, remain + (page_left * @duration), 'infinite']])
                
            @setIndicatorAnimation([
                [(@time % 32), remain, (32 - (@time % 32)), '0', '1']
                ['0', @duration, 32, remain, 'infinite']])
                    
    setTableAnimation: (args) ->
        l = (('table' + a[0] + '_' + a[1] + ' ' + a[2] + 's steps(' + a[3] + ',end)' + a[4] + 's ' + a[5] + ' paused') for a in args).join(', ')
        @table.css('-webkit-animation', l)

    setIndicatorAnimation: (args) ->
        l = (('indicator' + a[0] + ' ' + a[1] + 's steps(' + a[2] + ',end)' + a[3] + 's ' + a[4] + ' paused') for a in args).join(', ')
        @indicator.css('-webkit-animation', l)
