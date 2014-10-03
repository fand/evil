FXView = require './FXView'
$ = require 'jquery'

class ReverbView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_reverb').clone()
        @dom.removeAttr('id')

        super(@model, @dom)

        @name   = @dom.find('[name=name]')
        @wet  = @dom.find('[name=wet]')

        @initEvent()

    initEvent: ->
        super()
        @name.on('change', () =>
            @name_synth.val(@name.val())
            @model.setIR(@name.val())
        )
        @wet.on('change', () =>
            @model.setParam(wet: parseFloat(@wet.val()) / 100.0)
        )

    setParam: (p) ->
        @name.val(p.name) if p.name?
        @wet.val(p.wet * 100) if p.wet?


module.exports = ReverbView
