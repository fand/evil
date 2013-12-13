class @PlayerView
    constructor: (@model) ->
        @dom = $("#control")

        @bpm   = @dom.find("[name=bpm]")
        @key   = @dom.find("[name=key]")
        @scale = @dom.find("[name=mode]")

        @setBPM()
        @setKey()
        @setScale()

        @footer = $('footer')

        @play  = $('#control-play')
        @stop  = $('#control-stop')
        @forward = $('#control-forward')
        @backward = $('#control-backward')
        @loop = $('#control-loop')

        @instruments = $('#instruments')
        @mixer = $('#mixer')

        @btn_left   = $('#btn-left')
        @btn_right  = $('#btn-right')
        @btn_top    = $('#btn-top')
        @btn_bottom = $('#btn-bottom')
        @synth_now = 0
        @synth_total = 1

        @btn_save = $('#btn-save')

        @initEvent()
        @resize()

    initEvent: ->
        @dom.on("change", () =>
            @setBPM()
            @setKey()
            @setScale()
        )
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

        @btn_save.on('click', () => @model.saveSong())

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


    setBPM:   ->  @model.setBPM(parseInt(@bpm.val()))
    setKey:   ->  @model.setKey(@key.val())
    setScale: ->  @model.setScale(@scale.val())

    readParam: (bpm, key, scale) ->
        @bpm.val(bpm)
        for k, v of SCALE_LIST
            if v = scale
                @scale.val(k)
                break
        for k, v of KEY_LIST
            if v = key
                @key.val(k)
                break

    moveRight: ->
        if @synth_now == (@synth_total - 1)
            @model.addSynth()
            @synth_total++
        @synth_now++
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
        @model.moveRight(@synth_now)
        @btn_left.show()

    moveLeft: ->
        if @synth_now != 0
            @synth_now--
            @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
            @model.moveLeft(@synth_now)
        if @synth_now == 0
            @btn_left.hide()

    moveTop: ->
        @btn_left.hide()
        @btn_right.hide()
        @btn_top.hide()
        @btn_bottom.show()
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 700px, 0px)')
        @mixer.css('-webkit-transform', 'translate3d(0px, 700px, 0px)')

    moveBottom: ->
        @btn_left.show()
        @btn_right.show()
        @btn_top.show()
        @btn_bottom.hide()
        @instruments.css('-webkit-transform', 'translate3d(' + (-1040 * @synth_now) + 'px, 0px, 0px)')
        @mixer.css('-webkit-transform', 'translate3d(0px, 0px, 0px)')


    resize: ->
        w = $(window).width()
        h = $(window).height()
        space_w = (w - 910) / 2
        space_h = (h - 600) / 2

        pw = space_w/2 - 50
        ph = space_h/2 - 50

        @btn_left.css(
            width: space_w + 'px'
            padding: '250px ' + (pw + 5) + 'px'
        )
        @btn_right.css(
            width: space_w + 'px'
            padding: '250px ' + (pw + 15) + 'px'
        )
        @btn_top.css(
            height: space_h + 'px'
        )
        @btn_bottom.css(
            bottom: space_h + 'px'
            height: space_h + 'px'
        )
        @footer.css(
            height: space_h + 'px'
        )
