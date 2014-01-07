class @FXView
    constructor: (@model) ->

class @ReverbView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_reverb').clone()
        @dom.removeAttr('id')

        @name   = @dom.find('[name=name]')
        @input  = @dom.find('[name=input]')
        @output = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        @name.on('change', () =>
            @model.setIR(@name.val())
        )
        @input.on('change', () =>
            @model.setParam(input: parseFloat(@input.val()) / 100.0)
        )
        @output.on('change', () =>
            @model.setParam(output: parseFloat(@output.val()) / 100.0)
        )

class @DelayView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_delay').clone()
        @dom.removeAttr('id')

        @delay  = @dom.find('[name=delay]')
        @feedback = @dom.find('[name=feedback]')
        @lofi   = @dom.find('[name=lofi]')
        @input  = @dom.find('[name=input]')
        @output = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        @input.on('change', () =>
            @model.setParam(input: parseFloat(@input.val()) / 100.0)
        )
        @output.on('change', () =>
            @model.setParam(output: parseFloat(@output.val()) / 100.0)
        )
        @delay.on('change', () =>
            @model.setParam(delay: parseFloat(@delay.val()) / 1000.0)
        )
        @feedback.on('change', () =>
            @model.setParam(feedback: parseFloat(@feedback.val()) / 100.0)
        )
        @lofi.on('change', () =>
            @model.setParam(lofi: parseFloat(@lofi.val()) / 100.0)
        )



class @CompressorView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_compressor').clone()
        @dom.removeAttr('id')

        @attack    = @dom.find('[name=attack]')
        @release   = @dom.find('[name=release]')
        @threshold = @dom.find('[name=threshold]')
        @ratio     = @dom.find('[name=ratio]')
        @knee      = @dom.find('[name=knee]')
        @input     = @dom.find('[name=input]')
        @output    = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        @input.on('change', () =>
            @model.setParam(input: parseFloat(@input.val()) / 100.0)
        )
        @output.on('change', () =>
            @model.setParam(output: parseFloat(@output.val()) / 100.0)
        )
        @attack.on('change', () =>
            @model.setParam(attack: parseFloat(@attack.val()) / 1000.0)
        )
        @release.on('change', () =>
            @model.setParam(release: parseFloat(@release.val()) / 1000.0)
        )
        @threshold.on('change', () =>
            @model.setParam(threshold: (parseFloat(@threshold.val()) / -10.0))   # [0, 100]
        )
        @ratio.on('change', () =>
            @model.setParam(ratio: parseInt(@ratio.val()))
        )
        @knee.on('change', () =>
            @model.setParam(knee: parseFloat(@knee.val()) / 1000.0)
        )


class @FuzzView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_fuzz').clone()
        @dom.removeAttr('id')

        @type   = @dom.find('[name=type]')
        @gain   = @dom.find('[name=gain]')
        @input  = @dom.find('[name=input]')
        @output = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        @input.on('change', () =>
            @model.setParam(input: parseFloat(@input.val()) / 100.0)
        )
        @output.on('change', () =>
            @model.setParam(output: parseFloat(@output.val()) / 100.0)
        )
        @type.on('change', () =>
            @model.setParam(type: @type.val())
        )
        @gain.on('change', () =>
            @model.setParam(gain: parseFloat(@gain.val()) / 1000.0)
        )
