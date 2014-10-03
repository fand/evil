class KeyboardView
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


# Export!
module.exports = KeyboardView
