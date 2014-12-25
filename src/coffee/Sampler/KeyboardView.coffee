class SamplerKeyboardView
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


module.exports = SamplerKeyboardView
