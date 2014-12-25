FXView = require './FXView'
$ = require 'jquery'


class CompressorView extends FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_compressor').clone()
        @dom.removeAttr('id')
        super(@model, @dom)

        @attack    = @dom.find('[name=attack]')
        @release   = @dom.find('[name=release]')
        @threshold = @dom.find('[name=threshold]')
        @ratio     = @dom.find('[name=ratio]')
        @knee      = @dom.find('[name=knee]')
        @input     = @dom.find('[name=input]')
        @output    = @dom.find('[name=output]')

        @initEvent()

    initEvent: ->
        super()
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

    setParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @attack.val(p.attack * 1000) if p.attacks?
        @release.val(p.release * 1000) if p.release?
        @threshold.val(p.threshold * -10) if p.threshold?
        @ratio.val(p.ratio) if p.ratio?
        @knee.val(p.knee * 1000) if p.knee?


module.exports = CompressorView
