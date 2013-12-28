class @SamplerCoreView
    constructor: (@model, @id, @dom) ->
        @sample = @dom.find('.Sampler_sample')
        @canvas_waveform_dom = @dom.find('.waveform')
        @canvas_waveform = @canvas_waveform_dom[0]
        @ctx_waveform = @canvas_waveform.getContext('2d')
        @canvas_EQ_dom = @dom.find('.canvasEQ')
        @canvas_EQ = @canvas_EQ_dom[0]
        @ctx_EQ = @canvas_EQ.getContext('2d')
        @eq = @dom.find('.Sampler_EQ')

        @output = @dom.find('.Sampler_output')
        @panner = @output.find('.pan-slider')
        @gain = @output.find('.gain-slider')

        @sample_now = 0

        @initEvent()

        # Do not @updateWaveformCanvas in constructor
        # (wave is not loaded to model!!)
        @updateEQCanvas()


    initEvent: ->
        @sample.on("change", () =>
            @setSampleParam()
            @updateWaveformCanvas(@sample_now)
        )
        @eq.on('change', () =>
            @setSampleEQParam()
            @updateEQCanvas()
        )
        @output.on('change', () =>
            @setSampleOutputParam()
        )
        @setParam()

    bindSample: (@sample_now) ->
        @updateWaveformParam(@sample_now)
        @updateEQCanvas()

    updateWaveformCanvas: (@sample_now) ->
        canvas  = @canvas_waveform
        ctx = @ctx_waveform

        w = canvas.width = 300
        h = canvas.height = 180
        ctx.clearRect(0, 0, w, h)

        hts = @model.getSampleParam(@sample_now)
        _data = @model.getSampleData(@sample_now)

        if _data?
            wave = _data.getChannelData(0)

            # Draw waveform
            ctx.translate(0, 90)
            ctx.beginPath()

            d = wave.length / w
            for x in [0...w]
                ctx.lineTo(x, wave[Math.floor(x * d)] * h * 0.45)

            ctx.closePath()
            ctx.strokeStyle = 'rgb(255, 0, 220)'
            ctx.stroke()
            ctx.translate(0, -90)

        # Draw params
        left  = hts[0] * w
        right = hts[1] * w
        if left < right
            ctx.fillStyle = 'rgba(255, 0, 160, 0.2)'
            ctx.fillRect(left, 0, right-left, h)

    updateEQCanvas: () ->
        canvas  = @canvas_EQ
        ctx = @ctx_EQ

        w = canvas.width = 270
        h = canvas.height = 100

        # range is [-100, 100]
        eq = @model.getSampleEQParam(@sample_now)

        # Draw waveform
        ctx.clearRect(0, 0, w, h)
        ctx.translate(0, h / 2)
        ctx.beginPath()
        ctx.moveTo(0,       -(eq[0]/100.0) * (h / 2))
        ctx.lineTo(w/3,     -(eq[1]/100.0) * (h / 2))
        ctx.lineTo(w/3 * 2, -(eq[1]/100.0) * (h / 2))
        ctx.lineTo(w,       -(eq[2]/100.0) * (h / 2))
        ctx.strokeStyle = 'rgb(255, 0, 220)'
        ctx.stroke()
        ctx.closePath()
        ctx.translate(0, -h / 2)


    setParam: ->
        # @setNodesParam()
        # @setGains()

    setSampleParam: ->
        @model.setSampleParam(
            @sample_now,
            parseFloat(@sample.find('.head').val())  / 100.0,
            parseFloat(@sample.find('.tail').val())  / 100.0,
            parseFloat(@sample.find('.speed').val()) / 100.0
        )

    setSampleEQParam: ->
        @model.setSampleEQParam(
            @sample_now,
            parseFloat(@eq.find('.EQ_lo').val())  - 100.0,
            parseFloat(@eq.find('.EQ_mid').val()) - 100.0,
            parseFloat(@eq.find('.EQ_hi').val())  - 100.0
        )

    setSampleOutputParam: ->
        @model.setSampleOutputParam(
            @sample_now,
            @pan2pos(1.0 - (parseFloat(@panner.val())/100.0)),
            parseFloat(@gain.val()) / 100.0
        )

    readSampleParam: (p) ->
        @sample.find('.head' ).val(p[0] * 100.0)
        @sample.find('.tail' ).val(p[1] * 100.0)
        @sample.find('.speed').val(p[2] * 100.0)

    readSampleEQParam: (p) ->
        @eq.find('.EQ_lo' ).val(p[0] + 100.0)
        @eq.find('.EQ_mid').val(p[1] + 100.0)
        @eq.find('.EQ_hi' ).val(p[2] + 100.0)

    readSampleOutputParam: (p) ->
        [pan, g] = p
        @panner.val((1.0 - Math.acos(pan[0])/Math.PI) * 100.0)
        @gain.val(g * 100.0)

    setGains: ->
        for i in [0... @gain_inputs.length]
            @model.setNodeGain(i, parseInt(@gain_inputs.eq(i).val()))

    pan2pos: (v) ->
        theta = v * Math.PI
        [Math.cos(theta), 0, -Math.sin(theta)]



class @SamplerView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_sampler').clone()
        @dom.attr('id', 'sampler' + id)
        $("#instruments").append(@dom)

        @synth_name = @dom.find('.synth-name')
        @synth_name.val(@model.name)
        @pattern_name = @dom.find('.pattern-name')
        @pattern_name.val(@model.pattern_name)

        # header DOM
        @synth_type = @dom.find('.synth-type')

        @header = @dom.find('.header')
        @markers = @dom.find('.markers')
        @pos_markers = @dom.find('.marker')  # list of list of markers
        @marker_prev = @dom.find('.marker-prev')
        @marker_next = @dom.find('.marker-next')
        @plus  = @dom.find('.pattern-plus')
        @minus = @dom.find('.pattern-minus')
        @nosync = @dom.find('.pattern-nosync')
        @is_nosync = false
        @setMarker()

        # table DOM
        @table_wrapper    = @dom.find('.sequencer-table')
        @canvas_hover_dom = @dom.find('.table-hover')
        @canvas_on_dom    = @dom.find('.table-on')
        @canvas_off_dom   = @dom.find('.table-off')

        @canvas_hover = @canvas_hover_dom[0]
        @canvas_on    = @canvas_on_dom[0]
        @canvas_off   = @canvas_off_dom[0]

        @ctx_hover = @canvas_hover.getContext('2d')
        @ctx_on    = @canvas_on.getContext('2d')
        @ctx_off   = @canvas_off.getContext('2d')

        @cell = new Image()
        @cell.src = 'static/img/sequencer_cell.png'
        @cell.onload = () => @initCanvas()

        @cells_x = 32
        @cells_y = 10

        @core = @dom.find('.sampler-core')

        @keyboard = new SamplerKeyboardView(this)

        # Flags / Params
        @pattern = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
        @pattern_obj = name: @pattern_name.val(), pattern: @pattern
        @page = 0
        @page_total = 1

        @last_time = 0
        @last_page = 0

        @is_clicked = false
        @hover_pos = x:-1, y:-1
        @click_pos = x:-1, y:-1

        @initEvent()
        @initCanvas()

    initCanvas: ->
        @canvas_hover.width  = @canvas_on.width  = @canvas_off.width  = 832
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 260
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        for i in [0...@cells_y]
            for j in [0...@cells_x]
                @ctx_off.drawImage(@cell,
                    0, 26, 26, 26,           # src (x, y, w, h)
                    j * 26, i * 26, 26, 26  # dst (x, y, w, h)
                )
        @readPattern(@pattern_obj)

    getPos: (e) ->
        @rect = @canvas_off.getBoundingClientRect()
        _x = Math.floor((e.clientX - @rect.left) / 26)
        _y = Math.floor((e.clientY - @rect.top) / 26)
        _y = Math.min(9, _y)  # assert (note != 0)
        x: _x
        y: _y
        x_abs: @page * @cells_x + _x
        y_abs: _y
        note: @cells_y - _y

    initEvent: ->
        # Sequencer
        @canvas_hover_dom.on('mousemove', (e) =>
            pos = @getPos(e)
            if pos != @hover_pos
                @ctx_hover.clearRect(
                    @hover_pos.x * 26, @hover_pos.y * 26, 26, 26
                )
                @ctx_hover.drawImage(@cell,
                    52, 26, 26, 26,
                    pos.x * 26, pos.y * 26, 26, 26
                )
                @hover_pos = pos

            if @is_clicked and @click_pos != pos
                if @is_adding
                    @addNote(pos, 1.0)
                else
                    @removeNote(pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)

            remove = false
            for note in @pattern[pos.x_abs]
                if note[0] == pos.note
                    remove = true

            if remove
                @removeNote(pos)
            else
                @is_adding = true
                @addNote(pos, 1.0)

        ).on('mouseup', (e) =>
            @is_clicked = false
            @is_adding  = false
            @is_removing  = false
        ).on('mouseout', (e) =>
            @ctx_hover.clearRect(
                @hover_pos.x * 26, @hover_pos.y * 26, 26, 26
            )
            @hover_pos = x: -1, y: -1
            @is_clicked  = false
            @is_adding   = false
            @is_removing = false
        )

        # Headers
        @synth_type.on('change', () => @model.session.changeSynth(@id, @synth_type.val()))
        @synth_name.on('focus',
            ( => window.is_input_mode = true)
        ).on('blur',
            ( => window.is_input_mode = false)
        ).on('change',
            ( => @model.setSynthName(@synth_name.val()))
        )
        @pattern_name.on('focus',
            ( => window.is_input_mode = true)
        ).on('blur',
            ( => window.is_input_mode = false)
        ).on('change',
            ( => @model.setPatternName(@pattern_name.val()))
        )

        @marker_prev.on('click', ( => @model.player.backward(true)))
        @marker_next.on('click', ( => @model.player.forward()))

        @nosync.on('click', ( => @toggleNoSync()))
        @plus.on('click', ( => @plusPattern()))
        @minus.on('click', ( =>
            if @pattern.length > @cells_x
                @minusPattern()
        ))


    addNote: (pos, gain) ->
        if @pattern[pos.x_abs] == 0
            @pattern[pos.x_abs] = []
        if not Array.isArray(@pattern[pos.x_abs])
            @pattern[pos.x_abs] = [[@pattern[pos.x_abs], 1.0]]

        for i in [0...@pattern[pos.x_abs].length]
            if @pattern[pos.x_abs][i][0] == pos.note
                @pattern[pos.x_abs].splice(i, 1)
        @pattern[pos.x_abs].push([pos.note, gain])

        @model.addNote(pos.x_abs, pos.note, gain)
        @ctx_on.drawImage(@cell,
            26, 26, 26, 26,
            pos.x * 26, pos.y * 26, 26, 26
        )

    removeNote: (pos) ->
        for i in [0...@pattern[pos.x_abs].length]
            if @pattern[pos.x_abs][i][0] == pos.note
                @pattern[pos.x_abs].splice(i, 1)

        @ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26)
        @model.removeNote(pos)

    playAt: (@time) ->
        return if @is_nosync

        if @time % @cells_x == 0
            @drawPattern(@time)
        for i in [0...@cells_y]
            @ctx_off.drawImage(@cell,
                0, 26, 26, 26,
                (@last_time % @cells_x) * 26, i * 26, 26, 26
            )
            @ctx_off.drawImage(@cell,
                78, 26, 26, 26,
                (time % @cells_x) * 26, i * 26, 26, 26
            )
        @last_time = time

    readPattern: (@pattern_obj) ->
        @pattern = @pattern_obj.pattern
        @page = 0
        @page_total = @pattern.length / @cells_x
        @drawPattern(0)
        @setMarker()
        @setPatternName(@pattern_obj.name)

    drawPattern: (time) ->
        @time = time if time?
        @page = Math.floor(@time / @cells_x)
        @ctx_on.clearRect(0, 0, 832, 260)

        for i in [0...@cells_x]
            for j in @pattern[@page * @cells_x + i]
                y = @cells_y - j[0]
                @ctx_on.drawImage(
                    @cell,
                    26, 26, 26, 26,
                    i * 26, y * 26, 26, 26
                )
        @setMarker()

    plusPattern: ->
        return if @page_total == 8
        @pattern = @pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]])
        @page_total++
        @model.plusPattern()
        @drawPattern()
        @minus.removeClass('btn-false').addClass('btn-true')
        if @page_total == 8
            @plus.removeClass('btn-true').addClass('btn-false')

    minusPattern: ->
        return if @page_total == 1
        @pattern = @pattern.slice(0, @pattern.length - @cells_x)
        @page_total--
        @model.minusPattern()
        @drawPattern()
        @plus.removeClass('btn-false').addClass('btn-true')
        if @page_total == 1
            @minus.removeClass('btn-true').addClass('btn-false')

    setMarker: ->
        @pos_markers.filter((i) => i  < @page_total).addClass('marker-active')
        @pos_markers.filter((i) => @page_total <= i).removeClass('marker-active')
        @pos_markers.removeClass('marker-now').eq(@page).addClass('marker-now')
        @markers.find('.marker-pos').text(@page + 1)
        @markers.find('.marker-total').text(@page_total)
        @pos_markers.filter((i) => i  < @page_total).each((i) =>
            @pos_markers.eq(i).on('mousedown', () =>
                if @page < i
                    while @page != i
                        @model.player.forward()
                if @page > i
                    while @page != i
                        @model.player.backward(true)  # force
            )
        )

    play: ->
    stop: ->
        for i in [0...@cells_y]
            @ctx_off.drawImage(@cell,
                0, 26, 26, 26,
                (@last_time % @cells_x) * 26, i * 26, 26, 26
            )

    activate: (i) ->
        @is_active = true
        @initCanvas()

    inactivate: -> @is_active = false

    setSynthName:   (name) -> @synth_name.val(name)
    setPatternName: (name) -> @pattern_name.val(name)

    toggleNoSync: ->
        if @is_nosync
            @is_nosync = false
            @nosync.removeClass('btn-true').addClass('btn-false')
            @drawPattern(@time)
        else
            @is_nosync = true
            @nosync.removeClass('btn-false').addClass('btn-true')
            for i in [0...@cells_y]
                @ctx_off.drawImage(@cell,
                    0, 26, 26, 26,
                    (@time % @cells_x) * 26, i * 26, 26, 26
                )

    selectSample: (@sample_now) ->
        @keyboard.selectSample(@sample_now)
        @model.selectSample(@sample_now)



class @SamplerKeyboardView
    constructor: (@sequencer) ->
        # Keyboard
        @on_dom  = @sequencer.dom.find('.keyboard-off')
        @off_dom = @sequencer.dom.find('.keyboard-on')
        @canvas_on  = @on_dom[0]
        @canvas_off = @off_dom[0]
        @ctx_on  = @canvas_on.getContext('2d')
        @ctx_off = @canvas_off.getContext('2d')

        @w = 64
        @h = 26
        @cells_y = 10
        @color = ['rgba(230, 230, 230, 1.0)', 'rgba(  250, 50, 230, 0.7)', 'rgba(255, 100, 230, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']
        @is_clicked = false
        @hover_pos = x: -1, y: -1
        @click_pos = x: -1, y: -1

        @initCanvas()
        @initEvent()

    initCanvas: ->
        @canvas_on.width  = @canvas_off.width  = @w
        @canvas_on.height = @canvas_off.height = @h * @cells_y
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        @ctx_off.fillStyle = @color[0]
        for i in [0...@cells_y]
            @drawNormal(i)
            @drawText(i)

    getPos: (e) ->
        @rect = @canvas_off.getBoundingClientRect()
        Math.floor((e.clientY - @rect.top) / @h)

    initEvent: ->
        @off_dom.on('mousemove', (e) =>
            pos = @getPos(e)

            if pos != @hover_pos
                @drawNormal(@hover_pos)
                @drawHover(pos)
                @hover_pos = pos

            if @is_clicked and @click_pos != pos
                @clearActive(@click_pos)
                @drawActive(pos)
                @sequencer.model.noteOff()
                @sequencer.model.noteOn(@cells_y - pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            note = @cells_y - pos
            @sequencer.selectSample(note - 1)
            @drawActive(pos)
            @sequencer.model.noteOn(note)
            @click_pos = pos
        ).on('mouseup', (e) =>
            @is_clicked = false
            @clearActive(@click_pos)
            @sequencer.model.noteOff()
            @click_pos = x: -1, y: -1
        ).on('mouseout', (e) =>
            @clearActive(@hover_pos)
            @sequencer.model.noteOff()
            @hover_pos = x: -1, y: -1
            @click_pos = x: -1, y: -1
        )

    drawNormal: (i) ->
        @clearNormal(i)
        @ctx_off.fillStyle = @color[0]
        @ctx_off.fillRect(0, (i+1) * @h - 3, @w, 2)
        @ctx_off.fillStyle = @color[3]
        @ctx_off.fillText((@cells_y - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    drawHover: (i) ->
        @ctx_off.fillStyle = @color[1]
        @ctx_off.fillRect(0, (i+1) * @h - 3, @w, 2)
        @ctx_off.fillText((@cells_y - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    drawActive: (i) ->
        @clearNormal(i)
        @ctx_off.fillStyle = @color[2]
        @ctx_off.fillRect(0, i * @h, @w, @h)
        @ctx_off.fillStyle = @color[4]
        @ctx_off.fillText((@cells_y - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    clearNormal: (i) ->
        @ctx_off.clearRect(0, i * @h, @w, @h)

    clearActive: (i) ->
        @clearNormal(i)
        @drawNormal(i)
        @drawText(i)

    drawText: (i) ->
        @ctx_off.fillStyle = @color[3]
        @ctx_off.fillText((@cells_y - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    selectSample: (sample_now) ->
        @ctx_on.clearRect(0, (@cells_y - @sample_last - 1) * @h, @w, @h)
        @ctx_on.fillStyle = 'rgba(255, 200, 230, 0.3)'
        @ctx_on.fillRect(0, (@cells_y - sample_now - 1) * @h, @w, @h)
        @sample_last = sample_now
