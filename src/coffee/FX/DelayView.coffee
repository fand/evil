FXView = require './FXView'
$ = require 'jquery'

class DelayView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_delay').clone()
        @dom.removeAttr('id')

        super(@model, @dom)

        @delay  = @dom.find('[name=delay]')
        @feedback = @dom.find('[name=feedback]')
        @lofi   = @dom.find('[name=lofi]')
        @wet = @dom.find('[name=wet]')

        @initEvent()

    initEvent: ->
        super()
        @wet.on('change', () =>
            @model.setParam(wet: parseFloat(@wet.val()) / 100.0)
        )
        @delay.on('change', () =>
            @model.setParam(delay: parseFloat(@delay.val()) / 1000.0)
        )
        @feedback.on('change', () =>
            @model.setParam(feedback: parseFloat(@feedback.val()) / 100.0)
        )
        @lofi.on('change', () =>
            @model.setParam(lofi: parseFloat(@lofi.val())* 5.0 / 100.0)
        )

    setParam: (p) ->
        @delay.val(p.delay * 1000) if p.delays?
        @feedback.val(p.feedback * 100) if p.feedback?
        @lofi.val(p.lofi * 20) if p.lofi?
        @wet.val(p.wet * 100) if p.wet?


module.exports = DelayView
