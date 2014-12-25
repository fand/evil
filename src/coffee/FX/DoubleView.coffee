FXView = require './FXView'
DoubleView = require './DoubleView'
$ = require 'jquery'

class DoubleView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_double').clone()
        @dom.removeAttr('id')
        super(@model, @dom)

        @delay  = @dom.find('[name=delay]')
        @width  = @dom.find('[name=width]')

        @initEvent()

    initEvent: ->
        super()
        @delay.on('change', () =>
            @model.setParam(delay: parseFloat(@delay.val()) / 1000.0)
        )
        @width.on('change', () =>
            @model.setParam(width: parseFloat(@width.val()) / 200.0 + 0.5)  # [0.5, 1.0]
        )

    setParam: (p) ->
        @delay.val(p.delay * 1000) if p.delay?
        @width.val((p.width - 0.5) * 200) if p.width?


module.exports = DoubleView
