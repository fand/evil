class @SynthView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_synth').clone()
        @dom.attr('id', 'synth' + id)
        $("#instruments").append(@dom)

        @synth_name = @dom.find('.synth-name')
        @synth_name.val(@model.name)
        @pattern_name = @dom.find('.pattern-name')
        @pattern_name.val(@model.pattern_name)

        # header DOM
        @synth_type = @dom.find('.synth-type')
        @pencil = @dom.find('.sequencer-pencil')
        @step   = @dom.find('.sequencer-step')
        @is_step = false

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
        @cells_y = 20

        @btn_fold = @dom.find('.btn-fold-core')
        @core = @dom.find('.synth-core')
        @is_panel_opened = true

        @btn_fx = @dom.find('.btn-fx-view')
        @fx = @dom.find('.synth-fx')
        @is_fx_view = false

        @keyboard = new KeyboardView(this)

        # Flags / Params
        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @pattern_obj = name: @model.pattern_name, pattern: @pattern
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
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 520
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
                if @is_sustaining
                    @sustain_l = Math.min(pos.x_abs, @sustain_l)
                    @sustain_r = Math.max(pos.x_abs, @sustain_r)
                    @sustainNote(@sustain_l, @sustain_r, pos)
                else
                    if @is_adding
                        @addNote(pos)
                    else if @pattern[pos.x_abs] == pos.note
                        @removeNote(pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)

            if not @is_step
                # sustaining
                if @pattern[pos.x_abs] == 'sustain' or @pattern[pos.x_abs] == 'end'
                    @addNote(pos)
                    @sustain_l = @sustain_r = pos.x_abs
                    @is_sustaining = true
                # not sustaining
                else
                    @addNote(pos)
                    @sustain_l = @sustain_r = pos.x_abs
                    @is_sustaining = true

            else
                if @pattern[pos.x_abs] == pos.note
                    @removeNote(pos)
                else
                    @is_adding = true
                    @addNote(pos)
        ).on('mouseup', (e) =>
            @is_clicked = false
            if not @is_step
                pos = @getPos(e)
                @is_sustaining = false
            else
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
            ( => window.keyboard.beginInput())
        ).on('blur',
            ( => window.keyboard.endInput())
        ).on('change',
            ( => @model.setSynthName(@synth_name.val()))
        )
        @pattern_name.on('focus',
            ( => window.keyboard.beginInput())
        ).on('blur',
            ( => window.keyboard.endInput())
        ).on('change',
            ( => @model.setPatternName(@pattern_name.val()))
        )
        @pencil.on('click', ( => @pencilMode()))
        @step.on('click', ( => @stepMode()))

        @marker_prev.on('click', ( => @model.player.backward(true)))
        @marker_next.on('click', ( => @model.player.forward()))

        @nosync.on('click', ( => @toggleNoSync()))
        @plus.on('click', ( => @plusPattern()))
        @minus.on('click', ( =>
            if @pattern.length > @cells_x
                @minusPattern()
        ))

        @btn_fold.on('mousedown', () =>
            if @is_panel_opened
                @core.css('height', '0px')
                @table_wrapper.css('height', '524px')
                @btn_fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
                @is_panel_opened = false
            else
                @core.css('height', '280px')
                @table_wrapper.css('height', '262px')
                @btn_fold.css(top: '0px', padding: '5px 5px 5px 5px').removeClass('fa-angle-up').addClass('fa-angle-down')
                @is_panel_opened = true
        )

        @btn_fx.on('mousedown', () =>
            if @is_fx_view
                # @core.css('height', '0px')
                # @table_wrapper.css('height', '524px')
                # @btn_fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
                @is_fx_view = false
            else
                @core.css('height', '280px')
                @table_wrapper.css('height', '262px')
                @btn_fold.css(top: '0px', padding: '5px 5px 5px 5px').removeClass('fa-angle-up').addClass('fa-angle-down')
                @is_panel_opened = true
        )


    addNote: (pos) ->
        if @pattern[pos.x_abs] == 'end' or @pattern[pos.x_abs] == 'sustain'
            i = pos.x_abs - 1
            while @pattern[i] == 'sustain' or @pattern[i] == 'end'
                i--
            @ctx_on.clearRect(((pos.x_abs-1) % @cells_x) * 26, 0, 26, 1000)
            y = @cells_y + @pattern[i]
            if @pattern[pos.x_abs-1] < 0
                @pattern[pos.x_abs-1] = -(@pattern[pos.x_abs-1])
                @ctx_on.drawImage(@cell,
                    0, 0, 26, 26,
                    ((pos.x_abs-1) % @cells_x) * 26, y * 26, 26, 26
                )
            else
                @pattern[pos.x_abs-1] = 'end'
                @ctx_on.drawImage(@cell,
                    156, 0, 26, 26,
                    ((pos.x_abs-1) % @cells_x) * 26, y * 26, 26, 26
                )

        i = pos.x_abs + 1
        while @pattern[i] == 'end' or @pattern[i] == 'sustain'
            @pattern[i] = 0
            i++
        @ctx_on.clearRect(pos.x * 26, 0, (i - pos.x_abs) * 26, 1000)

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


    sustainNote: (l, r, pos) ->
        if l == r
            @addNote(pos)
            return

        for i in [l..r]
            @ctx_on.clearRect((i % @cells_x) * 26, 0, 26, 1000)

        for i in [(l+1)...r]
            @pattern[i] = 'sustain'
            @ctx_on.drawImage(@cell,
                130, 0, 26, 26,
                (i % @cells_x) * 26, pos.y * 26, 26, 26
            )

        if @pattern[l] == 'sustain' or @pattern[l] == 'end'
            i = l - 1
            while @pattern[i] == 'sustain' or @pattern[i] == 'end'
                i--
            @ctx_on.clearRect(((l-1) % @cells_x) * 26, 0, 26, 1000)
            y = @cells_y + @pattern[i]
            if @pattern[l-1] < 0
                @pattern[l-1] = -(@pattern[l-1])
                @ctx_on.drawImage(@cell,
                    0, 0, 26, 26,
                    ((l-1) % @cells_x) * 26, y * 26, 26, 26
                )
            else
                @pattern[l-1] = 'end'
                @ctx_on.drawImage(@cell,
                    156, 0, 26, 26,
                    ((l-1) % @cells_x) * 26, y * 26, 26, 26
                )

        if @pattern[r] < 0
            y = @cells_y + @pattern[r]
            if @pattern[r+1] == 'end'
                @pattern[r+1] = -(@pattern[r])
                @ctx_on.drawImage(@cell,
                    26, 0, 26, 26,
                    ((r+1) % @cells_x) * 26, y * 26, 26, 26
                )
            else
                @pattern[r+1] = @pattern[r]
                @ctx_on.drawImage(@cell,
                    104, 0, 26, 26,
                    ((r+1) % @cells_x) * 26, y * 26, 26, 26
                )

        @pattern[l] = -(pos.note)
        @pattern[r] = 'end'

        @ctx_on.drawImage(@cell,
            104, 0, 26, 26,
            (l % @cells_x) * 26, pos.y * 26, 26, 26
        )
        @ctx_on.drawImage(@cell,
            156, 0, 26, 26,
            (r % @cells_x) * 26, pos.y * 26, 26, 26
        )
        @model.sustainNote(l, r, pos.note)

    endSustain: (time) ->
        if @is_sustaining
            if @pattern[time-1] == 'sustain'
                @pattern[time-1] = 'end'
            else
                @pattern[time-1] *= -1
            @is_sustaining = false

    playAt: (@time) ->
        return if @is_nosync

        if @time % @cells_x == 0
            @endSustain()
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
        @ctx_on.clearRect(0, 0, 832, 520)

        last_y = 0

        for i in [0...@cells_x]
            note = @pattern[@page * @cells_x + i]
            if note == 'sustain'
                @ctx_on.drawImage(
                    @cell,
                    130, 0, 26, 26,
                    i * 26, last_y * 26, 26, 26
                )
            else if note == 'end'
                @ctx_on.drawImage(
                    @cell,
                    156, 0, 26, 26,
                    i * 26, last_y * 26, 26, 26
                )
                last_y = 0
            else if note < 0
                y = @cells_y + note    # @cells_y - (- note)
                @ctx_on.drawImage(
                    @cell,
                    104, 0, 26, 26,
                    i * 26, y * 26, 26, 26
                )
                last_y = y
            else
                y = @cells_y - note
                @ctx_on.drawImage(
                    @cell,
                    26, 0, 26, 26,
                    i * 26, y * 26, 26, 26
                )
                last_y = y
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
                if i < @page
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
    setPatternName: (name) -> @pattern_name.val(name); @pattern_obj.name = name

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

    pencilMode: ->
        @is_step = false
        @pencil.removeClass('btn-false').addClass('btn-true')
        @step.removeClass('btn-true').addClass('btn-false')

    stepMode: ->
        @is_step = true
        @step.removeClass('btn-false').addClass('btn-true')
        @pencil.removeClass('btn-true').addClass('btn-false')

    changeScale: (scale) ->
        @keyboard.changeScale(scale)



class @SynthCoreView
    constructor: (@model, @id, @dom) ->

        @vcos = $(@dom.find('.RS_VCO'))

        @EG_inputs     = @dom.find('.RS_EG input')
        @FEG_inputs    = @dom.find('.RS_FEG input')
        @filter_inputs = @dom.find(".RS_filter input")
        @gain_inputs   = @dom.find('.RS_mixer input')

        @canvasEG   = @dom.find(".RS_EG .canvasEG").get()[0]
        @canvasFEG  = @dom.find(".RS_FEG .canvasFEG").get()[0]
        @contextEG  = @canvasEG.getContext('2d')
        @contextFEG = @canvasFEG.getContext('2d')

        @initEvent()

    initEvent: ->
        @vcos.on("change",          () => @setVCOParam())
        @gain_inputs.on("change",   () => @setGains())
        @filter_inputs.on("change", () => @setFilterParam())
        @EG_inputs.on("change",     () => @setEGParam())
        @FEG_inputs.on("change",    () => @setFEGParam())
        @setParam()

    updateCanvas: (name) ->
        canvas  = null
        context = null
        adsr    = null
        if name == "EG"
            canvas  = @canvasEG
            context = @contextEG
            adsr    = @model.eg.getADSR()
        else
            canvas  = @canvasFEG
            context = @contextFEG
            adsr    = @model.feg.getADSR()

        w = canvas.width = 180
        h = canvas.height = 50
        w4 = w/4
        context.clearRect(0,0,w,h)
        context.beginPath()
        context.moveTo(w4 * (1.0 - adsr[0]), h)
        context.lineTo(w / 4,0)                                  # attack
        context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]))  # decay
        context.lineTo(w4 * 3, h * (1.0 - adsr[2]))              # sustain
        context.lineTo(w4 * (adsr[3] + 3), h)                    # release
        context.strokeStyle = 'rgb(0, 220, 255)'
        context.stroke()

    setParam: ->
        @setVCOParam()
        @setEGParam()
        @setFEGParam()
        @setFilterParam()
        @setGains()

    setVCOParam: ->
        harmony = @vcos.eq(0).find('.harmony').val()
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            @model.setVCOParam(
                i,
                vco.find('.shape').val(),
                parseInt(vco.find('.octave').val()),
                parseInt(vco.find('.interval').val()),
                parseInt(vco.find('.fine').val()),
                harmony
            )

    readVCOParam: (p) ->
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            vco.find('.shape').val(p[i].shape)
            vco.find('.octave').val(p[i].octave)
            vco.find('.interval').val(p[i].interval)
            vco.find('.fine').val(p[i].fine)

    setEGParam: ->
        @model.setEGParam(
            parseFloat(@EG_inputs.eq(0).val()),
            parseFloat(@EG_inputs.eq(1).val()),
            parseFloat(@EG_inputs.eq(2).val()),
            parseFloat(@EG_inputs.eq(3).val())
        )
        @updateCanvas("EG");

    readEGParam: (p) ->
        @EG_inputs.eq(0).val(p.adsr[0] * 50000)
        @EG_inputs.eq(1).val(p.adsr[1] * 50000)
        @EG_inputs.eq(2).val(p.adsr[2] * 100)
        @EG_inputs.eq(3).val(p.adsr[3] * 50000)

    setFEGParam: ->
        @model.setFEGParam(
            parseFloat(@FEG_inputs.eq(0).val()),
            parseFloat(@FEG_inputs.eq(1).val()),
            parseFloat(@FEG_inputs.eq(2).val()),
            parseFloat(@FEG_inputs.eq(3).val())
        );
        @updateCanvas("FEG");

    readFEGParam: (p) ->
        for i in [0...p.length]
            @FEG_inputs.eq(i).val(p.adsr[i])

    setFilterParam: ->
        @model.setFilterParam(
            parseFloat(@filter_inputs.eq(0).val()),
            parseFloat(@filter_inputs.eq(1).val())
        )

    readFilterParam: (p) ->
        @filter_inputs.eq(0).val(p[0])
        @filter_inputs.eq(1).val(p[1])

    setGains: ->
        for i in [0... @gain_inputs.length]
            @model.setVCOGain(i, parseInt(@gain_inputs.eq(i).val()))

    readParam: (p) ->
        if p.vcos?
            @readVCOParam(p.vcos)
        if p.gains?
            for i in [0...p.gains.length]
                @gain_inputs.eq(i).val(p.gains[i] / 0.3 * 100)
        @readEGParam(p.eg) if p.eg?
        @readFEGParam(p.feg) if p.feg?
        @readFilterParam(p.filter) if p.filter?



class @KeyboardView
    constructor: (@sequencer) ->
        # Keyboard
        @dom = @sequencer.dom.find('.keyboard')
        @canvas = @dom[0]
        @ctx = @canvas.getContext('2d')

        @w = 48
        @h = 26
        @num = 20
        @color = ['rgba(230, 230, 230, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']
        @is_clicked = false
        @hover_pos = x: -1, y: -1
        @click_pos = x: -1, y: -1

        @scale = @sequencer.model.scale

        @initCanvas()
        @initEvent()

    initCanvas: ->
        @canvas.width = @w;
        @canvas.height = @h * @num;
        @rect = @canvas.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        @ctx.fillStyle = @color[0]
        for i in [0...@num]
            @drawNormal(i)

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
                @sequencer.model.noteOff(true)
                @sequencer.model.noteOn(@num - pos, true)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            @drawActive(pos)
            @sequencer.model.noteOn(@num - pos, true)
            @click_pos = pos
        ).on('mouseup', (e) =>
            @is_clicked = false
            @clearActive(@click_pos)
            @sequencer.model.noteOff(true)
            @click_pos = x: -1, y: -1
        ).on('mouseout', (e) =>
            @clearActive(@hover_pos)
            @sequencer.model.noteOff(true)
            @hover_pos = x: -1, y: -1
            @click_pos = x: -1, y: -1
        )

    drawNormal: (i) ->
        @clearNormal(i)
        @ctx.fillStyle = @color[0]
        if @isKey(i)
            @ctx.fillRect(0, (i+1) * @h - 5, @w, 2)
        @ctx.fillRect(0, (i+1) * @h - 3, @w, 2)
        @ctx.fillStyle = @color[3]
        @ctx.fillText(@text(i), 10, (i+1) * @h - 10)

    drawHover: (i) ->
        @ctx.fillStyle = @color[1]
        @ctx.fillRect(0, (i+1) * @h - 3, @w, 2)
        if @isKey(i)
            @ctx.fillRect(0, (i+1) * @h - 5, @w, 2)
        @ctx.fillText(@text(i), 10, (i+1) * @h - 10)

    drawActive: (i) ->
        @clearNormal(i)
        @ctx.fillStyle = @color[2]
        @ctx.fillRect(0, i * @h, @w, @h)
        @ctx.fillStyle = @color[4]
        @ctx.fillText(@text(i), 10, (i+1) * @h - 10)

    clearNormal: (i) ->
        @ctx.clearRect(0, i * @h, @w, @h)

    clearActive: (i) ->
        @clearNormal(i)
        @drawNormal(i)

    changeScale: (@scale) ->
        for i in [0...@num]
            @drawNormal(i)

    text: (i) ->
        (@num - i - 1) % @scale.length + 1 + 'th'

    isKey: (i) ->
        (@num - i - 1) % @scale.length == 0
