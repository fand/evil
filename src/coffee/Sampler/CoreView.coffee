$ = require 'jquery'


class SamplerCoreView
    constructor: (@model, @id, @dom) ->
        @sample = @dom.find('.Sampler_sample')
        @canvas_waveform_dom = @dom.find('.waveform')
        @canvas_waveform = @canvas_waveform_dom[0]
        @ctx_waveform = @canvas_waveform.getContext('2d')
        @canvas_EQ_dom = @dom.find('.canvasEQ')
        @canvas_EQ = @canvas_EQ_dom[0]
        @ctx_EQ = @canvas_EQ.getContext('2d')
        @eq = @dom.find('.Sampler_EQ')

        @output = @dom.find('.Sampler_output')
        @panner = @output.find('.pan-slider')
        @gain = @output.find('.gain-slider')

        @sample_now = 0

        @w_wave = 300
        @h_wave = 180
        @head_wave = 0
        @tail_wave = @w_wave
        @clicked_wave = 0
        @target = head: @head_wave, tail: @tail_wave, both: [@tail_wave, @head_wave]

        @sample_name = @sample.find('.sample-name')
        @sample_list = $('#tmpl-sample-list').clone()
        @sample_list.removeAttr('id')
        @sample.find('.file-select').append(@sample_list)
        @sample_list_wrapper = $('<div class="sample-list-wrapper"></div>')
        @sample.find('.file-select').append(@sample_list_wrapper)

        @initEvent()

        # Do not @updateWaveformCanvas in constructor
        # (wave is not loaded to model!!)
        @updateEQCanvas()


    getWaveformPos: (e) ->
        return e.clientX - @canvas_waveform.getBoundingClientRect().left

    initEvent: ->
        @sample.find('input').on("change", () =>
            @fetchSampleTimeParam()
            @updateWaveformCanvas(@sample_now)
        )
        @canvas_waveform_dom.on('mousedown', (e) =>
            pos = @getWaveformPos(e)
            @clicked_wave = pos
            if Math.abs(pos - @head_wave) < 3
                @target_wave = 'head'
            else if Math.abs(pos - @tail_wave) < 3
                @target_wave = 'tail'
            else if @head_wave < pos and pos < @tail_wave
                @target_wave = 'both'
            else
                @target_wave = undefined
        ).on('mousemove', (e) =>
            if @target_wave?
                pos = @getWaveformPos(e)
                d = pos - @clicked_wave

                if @target_wave == 'head'
                    d = Math.max(d, -@head_wave)
                    @head_wave += d
                else if @target_wave == 'tail'
                    d = Math.min(d, @w_wave - @tail_wave)
                    @tail_wave += d
                else
                    d = Math.max(Math.min(d, @w_wave - @tail_wave), -@head_wave)
                    @head_wave += d
                    @tail_wave += d

                @fetchSampleTimeParam()
                @updateWaveformCanvas(@sample_now)

                @clicked_wave = pos

        ).on('mouseup mouseout', () =>
            @target_wave = undefined
            @updateWaveformCanvas(@sample_now)
        )

        @sample_name.on('click', () =>
            @showSampleList()
        )
        self = this
        @sample_list.find('div').on('click', () ->
            self.setSample($(this).html())
            self.hideSampleList()
        )
        @sample_list_wrapper.on('click', () =>
            @hideSampleList()
        )

        @eq.on('change', () =>
            @fetchSampleEQParam()
            @updateEQCanvas()
        )
        @output.on('change', () =>
            @fetchSampleOutputParam()
        )

    bindSample: (@sample_now, param) ->
        @sample_name.find('span').text(param.wave)
        @updateWaveformCanvas(@sample_now)
        @updateEQCanvas()

    showSampleList: () ->
        position = @sample_name.position()
        @sample_list.show().css(
            top:  position.top + 20 + 'px'
            left: position.left + 'px'
        )
        @sample_list_wrapper.show()


    hideSampleList: () ->
        @sample_list.hide()
        @sample_list_wrapper.hide()


    updateWaveformCanvas: (@sample_now) ->
        canvas  = @canvas_waveform
        ctx = @ctx_waveform

        w = canvas.width = @w_wave
        h = canvas.height = @h_wave - 10
        ctx.clearRect(0, 0, w, h)

        ctx.translate(0, 10)

        hts = @model.getSampleTimeParam(@sample_now)
        _data = @model.getSampleData(@sample_now)

        if _data?
            wave = _data.getChannelData(0)

            # Draw waveform
            ctx.translate(0, h/2)
            ctx.beginPath()

            d = wave.length / w
            for x in [0...w]
                ctx.lineTo(x, wave[Math.floor(x * d)] * h * 0.45)

            ctx.closePath()
            ctx.strokeStyle = 'rgb(255, 0, 220)'
            ctx.stroke()
            ctx.translate(0, -h/2)

        # Draw params
        left  = hts[0] * w
        right = hts[1] * w
        if left < right
            if @target_wave?
                ctx.fillStyle = 'rgba(255, 0, 160, 0.1)'
            else
                ctx.fillStyle = 'rgba(255, 0, 160, 0.2)'
            ctx.fillRect(left, 0, right-left, h)

        ctx.beginPath()
        ctx.arc(left,  -5, 5, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(right, -5, 5, 0, 2 * Math.PI, false)
        ctx.stroke()
        ctx.closePath()

    updateEQCanvas: () ->
        canvas  = @canvas_EQ
        ctx = @ctx_EQ

        w = canvas.width = 270
        h = canvas.height = 100

        # range is [-100, 100]
        eq = @model.getSampleEQParam(@sample_now)

        # Draw waveform
        ctx.clearRect(0, 0, w, h)
        ctx.translate(0, h / 2)
        ctx.beginPath()
        ctx.moveTo(0,       -(eq[0]/100.0) * (h / 2))
        ctx.lineTo(w/3,     -(eq[1]/100.0) * (h / 2))
        ctx.lineTo(w/3 * 2, -(eq[1]/100.0) * (h / 2))
        ctx.lineTo(w,       -(eq[2]/100.0) * (h / 2))
        ctx.strokeStyle = 'rgb(255, 0, 220)'
        ctx.stroke()
        ctx.closePath()
        ctx.translate(0, -h / 2)

    setSample: (name) ->
        @model.setSample(@sample_now, name)
        @sample_name.find('span').text(name)

    fetchSampleTimeParam: ->
        @model.setSampleTimeParam(
            @sample_now,
            @head_wave  / 300.0,
            @tail_wave  / 300.0,
            Math.pow(10, parseFloat(@sample.find('.speed').val()) / 100.0 - 1.0)
        )

    fetchSampleEQParam: ->
        @model.setSampleEQParam(
            @sample_now,
            parseFloat(@eq.find('.EQ_lo').val())  - 100.0,
            parseFloat(@eq.find('.EQ_mid').val()) - 100.0,
            parseFloat(@eq.find('.EQ_hi').val())  - 100.0
        )

    fetchSampleOutputParam: ->
        @model.setSampleOutputParam(
            @sample_now,
            (1.0 - (parseFloat(@panner.val())/200.0)),
            parseFloat(@gain.val()) / 100.0
        )

    setSampleTimeParam: (p) ->
        @head_wave = p[0] * 300.0
        @tail_wave = p[1] * 300.0
        ratio = Math.log(p[2]) / Math.LN10 + 1.0
        @sample.find('.speed').val(ratio * 100)

    setSampleEQParam: (p) ->
        @eq.find('.EQ_lo' ).val(p[0] + 100.0)
        @eq.find('.EQ_mid').val(p[1] + 100.0)
        @eq.find('.EQ_hi' ).val(p[2] + 100.0)

    setSampleOutputParam: (p) ->
        [pan, g] = p
        @panner.val((1.0 - pan) * 200.0)
        @gain.val(g * 100.0)

    fetchGains: ->
        for i in [0... @gain_inputs.length]
            @model.setNodeGain(i, parseInt(@gain_inputs.eq(i).val()))


module.exports = SamplerCoreView
