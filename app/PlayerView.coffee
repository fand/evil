class @PlayerView
    constructor: (@model) ->
        @dom = $("#control")

        @bpm   = @dom.find("[name=bpm]")
        @key   = @dom.find("[name=key]")
        @scale = @dom.find("[name=mode]")

        @footer = $('footer')

        @play  = $('#control-play')
        @stop  = $('#control-stop')
        @forward = $('#control-forward')
        @backward = $('#control-backward')
        @loop = $('#control-loop')

        @wrapper = $('#wrapper')
        @instruments = $('#instruments')
        @mixer = $('#mixer')
        @is_mixer = false  # seeing mixer?

        @btn_left   = $('#btn-left')
        @btn_right  = $('#btn-right')
        @btn_top    = $('#btn-top')
        @btn_bottom = $('#btn-bottom')
        @synth_now = 0
        @synth_total = 1

        @initEvent()
        @resize()

    initEvent: ->
        @dom.on("change", () =>
            @model.setBPM(parseInt(@bpm.val()))
            @model.setKey(@key.val())
            @model.setScale(@scale.val())
        )

        @bpm.on('focus', ( => window.keyboard.beginInput())).on('blur', ( => window.keyboard.endInput()))
        @key.on('focus', ( => window.keyboard.beginInput())).on('blur', ( => window.keyboard.endInput()))
        @scale.on('focus', ( => window.keyboard.beginInput())).on('blur', ( => window.keyboard.endInput()))

        @play.on('mousedown', () => @viewPlay())
        @stop.on('mousedown', () => @viewStop(@model))
        @forward.on('mousedown', () => @model.forward())
        @backward.on('mousedown', () => @model.backward())
        @loop.on('mousedown', () =>
            if @model.toggleLoop()
                @loop.removeClass('control-off').addClass('control-on')
            else
                @loop.removeClass('control-on').addClass('control-off')

        )

        @btn_left.on('mousedown',  () => @moveLeft())
        @btn_right.on('mousedown', () => @moveRight())
        @btn_top.on('mousedown', () => @moveTop())
        @btn_bottom.on('mousedown', () => @moveBottom())

        $(window).on('resize', () => @resize())

    viewPlay: ->
        if @model.isPlaying()
            @model.pause()
            @play.removeClass("fa-pause").addClass("fa-play")
        else
            @model.play()
            @play.removeClass("fa-play").addClass("fa-pause")

    viewStop: (receiver) ->
        receiver.stop() if receiver?
        @play.removeClass("fa-pause").addClass("fa-play")

    setBPM: (bpm) -> @bpm.val(bpm)
    setScale: (scale) -> @scale.val(scale)
    setKey: (key) ->
        for k, v of KEY_LIST
            if v = key
                @key.val(k)
                break

    setParam: (bpm, key, scale) ->
        @setBPM(bpm)
        @setKey(key)
        @setScale(scale)

    moveRight: ->
        return if @is_mixer

        @synth_now++
        @model.moveRight(@synth_now)
        @synth_total = @model.synth.length

        @instruments.css('-webkit-transform', 'translate3d(' + (-1110 * @synth_now) + 'px, 0px, 0px)')
        @btn_left.show()
        if @synth_now == (@synth_total - 1)
            @btn_right.attr('data-line1', 'new')

    moveLeft: ->
        return if @is_mixer
        @synth_total = @model.synth.length
        @btn_right.attr('data-line1', 'next')
        if @synth_now != 0
            @synth_now--
            @instruments.css('-webkit-transform', 'translate3d(' + (-1110 * @synth_now) + 'px, 0px, 0px)')
            @model.moveLeft(@synth_now)
        if @synth_now == 0
            @btn_left.hide()

    moveTop: ->
        @is_mixer = true
        @btn_left.hide()
        @btn_right.hide()
        @btn_top.hide()
        @btn_bottom.show()
        @wrapper.css('-webkit-transform', 'translate3d(0px, 700px, 0px)')
        @model.moveTop()

    moveBottom: ->
        @is_mixer = false
        @btn_left.show() if @synth_now != 0
        @btn_right.show()
        @btn_top.show()
        @btn_bottom.hide()
        @wrapper.css('-webkit-transform', 'translate3d(0px, 0px, 0px)')
        @model.moveBottom()

    setSynthNum: (total, now)->
        @synth_total = total
        if now < total - 1
            @btn_right.attr('data-line1', 'next')

    resize: ->
        w = $(window).width()
        h = $(window).height()
        space_w = (w - 910) / 2
        space_h = (h - 600) / 2

        pw = space_w/2 - 50
        ph = space_h/2 - 50

        @btn_left.css(
            width: space_w + 'px'
            padding: '250px ' + 25 + 'px'
        )
        @btn_right.css(
            width: space_w + 'px'
            padding: '250px ' + 35 + 'px'
        )
        @btn_top.css(
            height: space_h + 'px'
        )
        @btn_bottom.css(
            bottom: space_h + 'px'
            height: 100 + 'px'
        )
        @footer.css(
            height: space_h + 'px'
        )


    changeSynth: ->
        if @synth_now == 0
            @btn_left.hide()
        if @synth_now == (@synth_total - 1)
            @btn_right.attr('data-line1', 'new')


    empty: ->
        @instruments.empty()
