FXView = require './FXView'
$ = require 'jquery'

class FuzzView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_fuzz').clone()
        @dom.removeAttr('id')
        super(@model, @dom)

        @type   = @dom.find('[name=type]')
        @gain   = @dom.find('[name=gain]')
        @input  = @dom.find('[name=input]')
        @output = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        super()
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
            @model.setParam(gain: parseFloat(@gain.val())/ 100.0)
        )

    setParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @type.val(p.type) if p.type?
        @gain.val(p.gain * 100) if p.gain?


module.exports = FuzzView
