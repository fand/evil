class @SamplerCoreView
    constructor: (@model, @id, @dom) ->
        @sample = @dom.find('.Sampler_sample')
        @canvas_waveform_dom = @dom.find('.waveform')
        @canvas_waveform = @canvas_waveform_dom[0]
        @ctx_waveform = @canvas_waveform.getContext('2d')

        @sample_num = 0

        @initEvent()

    initEvent: ->
        @sample.on("change", () =>
            @setSampleParam()
            @updateCanvas(@sample_num)
        )
        @setParam()

    updateCanvas: (@sample_num) ->
        canvas  = @canvas_waveform
        ctx = @ctx_waveform

        w = canvas.width = 300
        h = canvas.height = 180
        ctx.clearRect(0, 0, w, h)

        hts = @model.getSampleParam(@sample_num)
        _data = @model.getSampleData(@sample_num)

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


    setParam: ->
        # @setNodesParam()
        # @setGains()

    setSampleParam: ->
        i = @sample_num
        for i in [0...10]
            @model.setSampleParam(
                i,
                parseFloat(@sample.find('.head').val())  / 100.0,
                parseFloat(@sample.find('.tail').val())  / 100.0,
                parseFloat(@sample.find('.speed').val()) / 100.0
            )

    setGains: ->
        for i in [0... @gain_inputs.length]
            @model.setNodeGain(i, parseInt(@gain_inputs.eq(i).val()))



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

        @fold = @dom.find('.btn-fold-core')
        @core = @dom.find('.sampler-core')
        @is_panel_opened = true

        @keyboard = new SamplerKeyboardView(this)

        # Flags / Params
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @page = 0
        @page_total = 1

        @last_time = 0
        @last_page = 0

        @is_clicked = false
        @hover_pos = x:-1, y:-1
        @click_pos = x:-1, y:-1

        @initEvent()

    initCanvas: ->
        @canvas_hover.width  = @canvas_on.width  = @canvas_off.width  = 832
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 262
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        for i in [0...@cells_y]
            for j in [0...@cells_x]
                @ctx_off.drawImage(@cell,
                    0, 0, 26, 26,           # src (x, y, w, h)
                    j * 26, i * 26, 26, 26  # dst (x, y, w, h)
                )
        @readPattern(@pattern_obj)

    getPos: (e) ->
        @rect = @canvas_off.getBoundingClientRect()
        _x = Math.floor((e.clientX - @rect.left) / 26)
        _y = Math.floor((e.clientY - @rect.top) / 26)
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
                    52, 0, 26, 26,
                    pos.x * 26, pos.y * 26, 26, 26
                )
                @hover_pos = pos

            if @is_clicked and @click_pos != pos
                if @is_adding
                    @addNote(pos)
                else if @pattern[pos.x_abs] == pos.note
                    @removeNote(pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)

            if @pattern[pos.x_abs] == pos.note
                @removeNote(pos)
            else
                @is_adding = true
                @addNote(pos)

        ).on('mouseup', (e) =>
            @is_clicked = false
            @is_adding = false
        ).on('mouseout', (e) =>
            @ctx_hover.clearRect(
                @hover_pos.x * 26, @hover_pos.y * 26, 26, 26
            )
            @hover_pos = x: -1, y: -1
            @is_clicked = false
            @is_adding = false
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

        @fold.on('mousedown', () =>
            if @is_panel_opened
                @core.css('height', '0px')
                @table_wrapper.css('height', '262px')
                @fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
                @is_panel_opened = false
            else
                @core.css('height', '280px')
                @table_wrapper.css('height', '262px')
                @fold.css(top: '0px', padding: '5px 5px 5px 5px').removeClass('fa-angle-up').addClass('fa-angle-down')
                @is_panel_opened = true
        )


    addNote: (pos) ->
        @pattern[pos.x_abs] = pos.note
        @model.addNote(pos.x_abs, pos.note)
        @ctx_on.clearRect(pos.x * 26, 0, 26, 1000)
        @ctx_on.drawImage(@cell,
            26, 0, 26, 26,
            pos.x * 26, pos.y * 26, 26, 26
        )

    removeNote: (pos) ->
        @pattern[pos.x_abs] = 0
        @ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26)
        @model.removeNote(pos.x_abs)

    playAt: (@time) ->
        return if @is_nosync

        if @time % @cells_x == 0
            @drawPattern(@time)
        for i in [0...@cells_y]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % @cells_x) * 26, i * 26, 26, 26
            )
            @ctx_off.drawImage(@cell,
                78, 0, 26, 26,
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
        @ctx_on.clearRect(0, 0, 832, 262)

        for i in [0...@cells_x]
            y = @cells_y - @pattern[@page * @cells_x + i]
            @ctx_on.drawImage(
                @cell,
                26, 0, 26, 26,
                i * 26, y * 26, 26, 26
            )
        @setMarker()

    plusPattern: ->
        return if @page_total == 8
        @pattern = @pattern.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
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
                0, 0, 26, 26,
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
                    0, 0, 26, 26,
                    (@time % @cells_x) * 26, i * 26, 26, 26
                )



class @SamplerKeyboardView
    constructor: (@sequencer) ->
        # Keyboard
        @dom = @sequencer.dom.find('.keyboard')
        @canvas = @dom[0]
        @ctx = @canvas.getContext('2d')

        @w = 48
        @h = 26
        @num = 10
        @color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']
        @is_clicked = false
        @hover_pos = x: -1, y: -1
        @click_pos = x: -1, y: -1

        @initCanvas()
        @initEvent()

    initCanvas: ->
        @canvas.width = @w
        @canvas.height = @h * @num
        @rect = @canvas.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        @ctx.fillStyle = @color[0]
        for i in [0...@num]
            @drawNormal(i)
            @drawText(i)

    getPos: (e) ->
        @rect = @canvas.getBoundingClientRect()
        Math.floor((e.clientY - @rect.top) / @h)

    initEvent: ->
        @dom.on('mousemove', (e) =>
            pos = @getPos(e)

            if pos != @hover_pos
                @drawNormal(@hover_pos)
                @drawHover(pos)
                @hover_pos = pos

            if @is_clicked and @click_pos != pos
                @clearActive(@click_pos)
                @drawActive(pos)
                @sequencer.model.noteOff()
                @sequencer.model.noteOn(@num - pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            @drawActive(pos)
            @sequencer.model.noteOn(@num - pos)
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
        @ctx.fillStyle = @color[0]
        @ctx.fillRect(0, (i+1) * @h - 3, @w, 2)
        @ctx.fillStyle = @color[3]
        @ctx.fillText((@num - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    drawHover: (i) ->
        @ctx.fillStyle = @color[1]
        @ctx.fillRect(0, (i+1) * @h - 3, @w, 2)
        @ctx.fillText((@num - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    drawActive: (i) ->
        @clearNormal(i)
        @ctx.fillStyle = @color[2]
        @ctx.fillRect(0, i * @h, @w, @h)
        @ctx.fillStyle = @color[4]
        @ctx.fillText((@num - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)

    clearNormal: (i) ->
        @ctx.clearRect(0, i * @h, @w, @h)

    clearActive: (i) ->
        @clearNormal(i)
        @drawNormal(i)
        @drawText(i)

    drawText: (i) ->
        @ctx.fillStyle = @color[3]
        @ctx.fillText((@num - i - 1) % 7 + 1 + 'th', 10, (i+1) * @h - 10)
