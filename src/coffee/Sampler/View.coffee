$ = require 'jquery'
SamplerKeyboardView = require './KeyboardView.coffee'


class SamplerView
    constructor: (@model, @id) ->

        @dom = $('#tmpl_sampler').clone()
        @dom.attr('id', 'sampler' + @id)
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
        @setPattern(@pattern_obj)

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
        @synth_type.on('change', () => @model.changeSynth(@synth_type.val()))
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
                (@time % @cells_x) * 26, i * 26, 26, 26
            )
        @last_time = @time

    setPattern: (@pattern_obj) ->
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
                if i < @page
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


# Export!
module.exports = SamplerView
