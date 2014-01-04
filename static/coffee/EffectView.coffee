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
