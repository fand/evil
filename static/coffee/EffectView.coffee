class @FXView
    constructor: (@model, @dom_side, @dom_synth) ->
        @minus_side = @dom_side.find('.sidebar-effect-minus')
        @minus_synth = @dom_side.find('.sidebar-effect-minus')

    initEvent: ->
        @minus_side.on('click', ()=>
            @model.remove()
            $(@dom_side).remove()
            $(@dom_synth).remove()
        )
        @minus_synth.on('click', ()=>
            @model.remove()
            $(@dom_side).remove()
            $(@dom_synth).remove()
        )


class @ReverbView extends @FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_reverb').clone()
        @dom_synth = $('#tmpl_fx_synth_reverb').clone()
        @dom.removeAttr('id')

        super(@model, @dom, @dom_synth)

        @name   = @dom.find('[name=name]')
        @input  = @dom.find('[name=input]')
        @output = @dom.find('[name=output]')

        @name_synth   = @dom_synth.find('[name=name]')
        @input_synth  = @dom_synth.find('[name=input]')
        @output_synth = @dom_synth.find('[name=output]')

        @initEvent()

    initEvent: ->
        super()
        @name.on('change', () =>
            @name_synth.val(@name.val())
            @model.setIR(@name.val())
        )
        @input.on('change', () =>
            @input_synth.val(@input.val())
            @model.setParam(input: parseFloat(@input.val()) / 100.0)
        )
        @output.on('change', () =>
            @output_synth.val(@output.val())
            @model.setParam(output: parseFloat(@output.val()) / 100.0)
        )

        @name_synth.on('change', () =>
            @name.val(@name_synth.val())
            @model.setIR(@name_synth.val())
        )
        @input_synth.on('change', () =>
            @input.val(@input_synth.val())
            @model.setParam(input: parseFloat(@input_synth.val()) / 100.0)
        )
        @output_synth.on('change', () =>
            @output.val(@output_synth.val())
            @model.setParam(output: parseFloat(@output_synth.val()) / 100.0)
        )

    readParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @name.val(p.name) if p.name?

        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @name.val(p.name) if p.name?



class @DelayView extends @FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_delay').clone()
        @dom.removeAttr('id')

        super(@model, @dom)

        @delay  = @dom.find('[name=delay]')
        @feedback = @dom.find('[name=feedback]')
        @lofi   = @dom.find('[name=lofi]')
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
        @delay.on('change', () =>
            @model.setParam(delay: parseFloat(@delay.val()) / 1000.0)
        )
        @feedback.on('change', () =>
            @model.setParam(feedback: parseFloat(@feedback.val()) / 100.0)
        )
        @lofi.on('change', () =>
            @model.setParam(lofi: parseFloat(@lofi.val())* 5.0 / 100.0)
        )

    readParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @delay.val(p.delay * 1000) if p.delays?
        @feedback.val(p.feedback * 100) if p.feedback?
        @lofi.val(p.lofi * 20) if p.lofi?



class @CompressorView extends @FXView
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

    readParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @attack.val(p.attack * 1000) if p.attacks?
        @release.val(p.release * 1000) if p.release?
        @threshold.val(p.threshold * -10) if p.threshold?
        @ratio.val(p.ratio) if p.ratio?
        @knee.val(p.knee * 1000) if p.knee?



class @FuzzView extends @FXView
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

    readParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @type.val(p.type) if p.type?
        @gain.val(p.gain * 100) if p.gain?



class @DoubleView extends @FXView
    constructor: (@model) ->
        @dom = $('#tmpl_fx_double').clone()
        @dom.removeAttr('id')
        super(@model, @dom)

        @delay  = @dom.find('[name=delay]')
        @width  = @dom.find('[name=width]')
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
        @delay.on('change', () =>
            @model.setParam(delay: parseFloat(@delay.val()) / 1000.0)
        )
        @width.on('change', () =>
            @model.setParam(width: parseFloat(@width.val()) / 200.0 + 0.5)  # [0.5, 1.0]
        )

    readParam: (p) ->
        @input.val(p.input * 100) if p.input?
        @output.val(p.output * 100) if p.output?
        @delay.val(p.delay * 1000) if p.delay?
        @width.val((p.width - 0.5) * 200) if p.width?
