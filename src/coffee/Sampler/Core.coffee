SamplerNode = require './Node'
SamplerCoreView = require './CoreView'
SAMPLES = require './Constant'


class SamplerCore
    constructor: (@parent, @ctx, @id) ->
        @node = @ctx.createGain()
        @node.gain.value = 1.0
        @gain = 1.0
        @is_mute = false

        @samples = (new SamplerNode(@ctx, i, this) for i in [0...10])

        for i in [0...10]
            @samples[i].connect(@node)

        @view = new SamplerCoreView(this, @id, @parent.view.dom.find('.sampler-core'))

    noteOn: (notes) ->
        return if @is_mute
        time = @ctx.currentTime
        if Array.isArray(notes)
            # return if notes.length == 0
            @samples[n[0] - 1].noteOn(n[1], time) for n in notes
        # else
        #     @samples[notes - 1].noteOn(1, time)

    noteOff: ->
        t0 = @ctx.currentTime

    connect: (dst) ->
        @node.connect(dst)

    setSample: (i, name) -> @samples[i].setSample(name)

    setSampleTimeParam: (i, head, tail, speed) ->
        @samples[i].setTimeParam(head, tail, speed)

    setSampleEQParam: (i, lo, mid, hi) ->
        @samples[i].setEQParam([lo, mid, hi])

    setSampleOutputParam: (i, pan, gain) ->
        @samples[i].setOutputParam(pan, gain)

    setGain: (@gain) ->
        @node.gain.value = @gain

    getSampleTimeParam: (i) ->
        @samples[i].getTimeParam()

    getSampleData: (i) ->
        @samples[i].getData()

    getSampleEQParam: (i) ->
        @samples[i].getEQParam()

    getSampleOutputParam: (i) ->
        @samples[i].getOutputParam()

    sampleLoaded: (id) ->
        @view.updateWaveformCanvas(id)

    bindSample: (sample_now) ->
        @view.bindSample(sample_now, @samples[sample_now].getParam())
        @view.setSampleTimeParam(@getSampleTimeParam(sample_now))
        @view.setSampleEQParam(@getSampleEQParam(sample_now))
        @view.setSampleOutputParam(@getSampleOutputParam(sample_now))

    getParam: ->
        type: 'SAMPLER'
        samples: (s.getParam() for s in @samples)

    setParam: (p) ->
        if p.samples?
            for i in [0...p.samples.length]
                @samples[i].setParam(p.samples[i])
        @bindSample(0)


    mute:   -> @is_mute = true
    demute: -> @is_mute = false


# Export!
module.exports = SamplerCore
