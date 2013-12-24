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
        @pencil  = @dom.find('.sequencer-pencil')
        @sustain = @dom.find('.sequencer-sustain')

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

        @fold = @dom.find('.btn-fold-core')
        @core = @dom.find('.synth-core')
        @is_panel_opened = true

        @keyboard = new KeyboardView(this)

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
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 520
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top

        for i in [0...20]
            for j in [0...32]
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
        x_abs: @page * 32 + _x
        y_abs: _y

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
                else if @pattern[pos.x_abs] == 20 - pos.y
                    @removeNote(pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            if @pattern[pos.x_abs] == 20 - pos.y
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
        @pencil.on('click', ( => @pencilMode()))
        @sustain.on('click', ( => @sustainMode()))

        @marker_prev.on('click', ( => @model.player.backward(true)))
        @marker_next.on('click', ( => @model.player.forward()))

        @nosync.on('click', ( => @toggleNoSync()))
        @plus.on('click', ( => @plusPattern()))
        @minus.on('click', ( =>
            if @pattern.length > 32
                @minusPattern()
        ))

        @fold.on('mousedown', () =>
            if @is_panel_opened
                @core.css('height', '0px')
                @table_wrapper.css('height', '524px')
                @fold.css(top: '-22px', padding: '0px 5px 0px 0px').removeClass('fa-angle-down').addClass('fa-angle-up')
                @is_panel_opened = false
            else
                @core.css('height', '280px')
                @table_wrapper.css('height', '262px')
                @fold.css(top: '0px', padding: '5px 5px 5px 5px').removeClass('fa-angle-up').addClass('fa-angle-down')
                @is_panel_opened = true
        )


    addNote: (pos) ->
        note = 20 - pos.y
        @pattern[pos.x_abs] = note
        @model.addNote(pos.x_abs, note)
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

        if @time % 32 == 0
            @drawPattern(@time)
        for i in [0...20]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
            )
            @ctx_off.drawImage(@cell,
                78, 0, 26, 26,
                (time % 32) * 26, i * 26, 26, 26
            )
        @last_time = time

    readPattern: (@pattern_obj) ->
        @pattern = @pattern_obj.pattern
        @page = 0
        @page_total = @pattern.length / 32
        @drawPattern(0)
        @setMarker()
        @setPatternName(@pattern_obj.name)

    drawPattern: (time) ->
        @time = time if time?
        @page = Math.floor(@time / 32)
        @ctx_on.clearRect(0, 0, 832, 520)
        for i in [0...32]
            y = 20 - @pattern[@page * 32 + i]
            @ctx_on.drawImage(
                @cell,
                26, 0, 26, 26,
                i * 26, y * 26, 26, 26
            )
        @setMarker()

    pencilMode: -> @is_sustain = false
    pencilMode: -> @is_sustain = false

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
        @pattern = @pattern.slice(0, @pattern.length - 32)
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
        for i in [0...20]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
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
            for i in [0...20]
                @ctx_off.drawImage(@cell,
                    0, 0, 26, 26,
                    (@time % 32) * 26, i * 26, 26, 26
                )



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
