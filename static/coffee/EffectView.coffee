class @FXView
    constructor: (@model) ->


class @PumpView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_pump').clone()
        @dom.removeAttr('id')
        @initEvent()

    initEvent: ->
        @dom.on('change', () =>
            @setParam()
        )

    setParam: ->
        @model.setParam(
            gain: parseFloat(@dom.find('[name=gain]').val())
        )



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
