class @SynthView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_synth').clone()
        @dom.attr('id', 'synth' + id)
        $("#instruments").append(@dom)

        @pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        @page = 0
        @page_total = 1

        @last_time = 0
        @last_page = 0

        @pos_markers = @dom.find('.marker')  # list of list of markers
        @plus  = @dom.find('.pattern-plus')
        @minus = @dom.find('.pattern-minus')
        @setMarker()

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

        @is_clicked = false
        @hover_pos = x:0, y:0
        @click_pos = x:0, y:0

        @initEvent()

    initCanvas: ->
        @canvas_hover.width  = @canvas_on.width  = @canvas_off.width  = 832
        @canvas_hover.height = @canvas_on.height = @canvas_off.height = 260
        @rect = @canvas_off.getBoundingClientRect()
        @offset = x: @rect.left, y: @rect.top
        for i in [0...10]
            for j in [0...32]
                @ctx_off.drawImage(@cell,
                    0, 0, 26, 26,           # src (x, y, w, h)
                    j * 26, i * 26, 26, 26  # dst (x, y, w, h)
                )
        @readPattern(@pattern)

    getPos: (e) ->
        @rect = @canvas_off.getBoundingClientRect()
        _x = Math.floor((e.clientX - @rect.left) / 26)
        _y = Math.floor((e.clientY - @rect.top) / 26)
        x: _x
        y: _y
        x_abs: @page * 32 + _x
        y_abs: _y

    initEvent: ->
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
                else
                    @removeNote(pos)
                @click_pos = pos

        ).on('mousedown', (e) =>
            @is_clicked = true
            pos = @getPos(e)
            if @pattern[pos.x_abs] == 10 - pos.y
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
        )

        @plus.on('click', ( => @plusPattern()))
        @minus.on('click', ( =>
            if @pattern.length > 32
                @minusPattern()
        ))

    addNote: (pos) ->
        note = 10 - pos.y
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
        if @time % 32 == 0
            @drawPattern(@time)
        for i in [0...10]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
            )
            @ctx_off.drawImage(@cell,
                78, 0, 26, 26,
                (time % 32) * 26, i * 26, 26, 26
            )
        @last_time = time

    readPattern: (@pattern) ->
        @page = 0
        @page_total = @pattern.length / 32
        @drawPattern(0)
        @setMarker()

    drawPattern: (time) ->
        @time = time if time?
        @page = Math.floor(@time / 32)
        @ctx_on.clearRect(0, 0, 832, 260)
        for i in [0...32]
            y = 10 - @pattern[@page * 32 + i]
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

    minusPattern: ->
        return if @page_total == 1
        @pattern = @pattern.slice(0, @pattern.length - 32)
        @page_total--
        @model.minusPattern()
        @drawPattern()

    setMarker: ->
        @pos_markers.filter((i) => i  < @page_total).show()
        @pos_markers.filter((i) => @page_total <= i).hide()
        @pos_markers.removeClass('marker-now').eq(@page).addClass('marker-now')

    play: ->
    stop: ->
        for i in [0...10]
            @ctx_off.drawImage(@cell,
                0, 0, 26, 26,
                (@last_time % 32) * 26, i * 26, 26, 26
            )


    activate: (i) ->
        @is_active = true
        @initCanvas()

    inactivate: -> @is_active = false
