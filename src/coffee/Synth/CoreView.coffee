$ = require 'jquery'

class SynthCoreView
    constructor: (@model, @id, @dom) ->

        @vcos = $(@dom.find('.RS_VCO'))

        @EG_inputs     = @dom.find('.RS_EG input')
        @FEG_inputs    = @dom.find('.RS_FEG input')
        @filter_inputs = @dom.find(".RS_filter input")
        @gain_inputs   = @dom.find('.RS_mixer input')

        @canvasEG   = @dom.find(".RS_EG .canvasEG").get()[0]
        @canvasFEG  = @dom.find(".RS_FEG .canvasFEG").get()[0]
        @contextEG  = @canvasEG.getContext('2d')
        @contextFEG = @canvasFEG.getContext('2d')

        @initEvent()

    initEvent: ->
        @vcos.on("change",          () => @fetchVCOParam())
        @gain_inputs.on("change",   () => @fetchGains())
        @filter_inputs.on("change", () => @fetchFilterParam())
        @EG_inputs.on("change",     () => @fetchEGParam())
        @FEG_inputs.on("change",    () => @fetchFEGParam())
        @fetchParam()

    updateCanvas: (name) ->
        canvas  = null
        context = null
        adsr    = null
        if name == "EG"
            canvas  = @canvasEG
            context = @contextEG
            adsr    = @model.eg.getADSR()
        else
            canvas  = @canvasFEG
            context = @contextFEG
            adsr    = @model.feg.getADSR()

        w = canvas.width = 180
        h = canvas.height = 50
        w4 = w/4
        context.clearRect(0,0,w,h)
        context.beginPath()
        context.moveTo(w4 * (1.0 - adsr[0]), h)
        context.lineTo(w / 4,0)                                  # attack
        context.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2]))  # decay
        context.lineTo(w4 * 3, h * (1.0 - adsr[2]))              # sustain
        context.lineTo(w4 * (adsr[3] + 3), h)                    # release
        context.strokeStyle = 'rgb(0, 220, 255)'
        context.stroke()

    fetchParam: ->
        @fetchVCOParam()
        @fetchEGParam()
        @fetchFEGParam()
        @fetchFilterParam()
        @fetchGains()

    fetchVCOParam: ->
        harmony = @vcos.eq(0).find('.harmony').val()
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            @model.setVCOParam(
                i,
                vco.find('.shape').val(),
                parseInt(vco.find('.octave').val()),
                parseInt(vco.find('.interval').val()),
                parseInt(vco.find('.fine').val()),
                harmony
            )

    setVCOParam: (p) ->
        for i in [0...@vcos.length]
            vco = @vcos.eq(i)
            vco.find('.shape').val(p[i].shape)
            vco.find('.octave').val(p[i].octave)
            vco.find('.interval').val(p[i].interval)
            vco.find('.fine').val(p[i].fine)

    fetchEGParam: ->
        @model.setEGParam(
            parseFloat(@EG_inputs.eq(0).val()),
            parseFloat(@EG_inputs.eq(1).val()),
            parseFloat(@EG_inputs.eq(2).val()),
            parseFloat(@EG_inputs.eq(3).val())
        )
        @updateCanvas("EG");

    setEGParam: (p) ->
        @EG_inputs.eq(0).val(p.adsr[0] * 50000)
        @EG_inputs.eq(1).val(p.adsr[1] * 50000)
        @EG_inputs.eq(2).val(p.adsr[2] * 100)
        @EG_inputs.eq(3).val(p.adsr[3] * 50000)

    fetchFEGParam: ->
        @model.setFEGParam(
            parseFloat(@FEG_inputs.eq(0).val()),
            parseFloat(@FEG_inputs.eq(1).val()),
            parseFloat(@FEG_inputs.eq(2).val()),
            parseFloat(@FEG_inputs.eq(3).val())
        );
        @updateCanvas("FEG");

    setFEGParam: (p) ->
        for i in [0...p.length]
            @FEG_inputs.eq(i).val(p.adsr[i])

    fetchFilterParam: ->
        @model.setFilterParam(
            parseFloat(@filter_inputs.eq(0).val()),
            parseFloat(@filter_inputs.eq(1).val())
        )

    setFilterParam: (p) ->
        @filter_inputs.eq(0).val(p[0])
        @filter_inputs.eq(1).val(p[1])

    fetchGains: ->
        for i in [0... @gain_inputs.length]
            @model.setVCOGain(i, parseInt(@gain_inputs.eq(i).val()))

    setParam: (p) ->
        if p.vcos?
            @setVCOParam(p.vcos)
        if p.gains?
            for i in [0...p.gains.length]
                @gain_inputs.eq(i).val(p.gains[i] / 0.3 * 100)
        @setEGParam(p.eg) if p.eg?
        @setFEGParam(p.feg) if p.feg?
        @setFilterParam(p.filter) if p.filter?


# Export!
module.exports = SynthCoreView
