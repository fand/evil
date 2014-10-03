Panner = require '../Panner'
SAMPLE = require './Constant'
CONSTANT = require '../Constant'

class SampleNode
    constructor: (@ctx, @id, @parent) ->
        @out = @ctx.createGain()
        @out.gain.value = 1.0
        @name = SAMPLE.DEFAULT[@id]
        @setSample(@name)

        @head = 0.0
        @tail = 1.0
        @speed = 1.0

        # for mono source
        @merger = @ctx.createChannelMerger(2)

        # node to set gain for individual nodes
        @node_buf = @ctx.createGain()
        @node_buf.gain.value = 1.0

        @eq_gains = [0.0, 0.0, 0.0]

        [eq1, eq2, eq3] = [@ctx.createBiquadFilter(), @ctx.createBiquadFilter(), @ctx.createBiquadFilter()]
        [eq1.type, eq2.type, eq3.type] = ['lowshelf', 'peaking', 'highshelf']
        [eq1.Q.value, eq2.Q.value, eq3.Q.value] = [0.6, 0.6, 0.6]
        [eq1.frequency.value, eq2.frequency.value, eq3.frequency.value] = [350, 2000, 4000]
        [eq1.gain.value, eq2.gain.value, eq3.gain.value] = @eq_gains
        @eq_nodes = [eq1, eq2, eq3]

        @panner = new Panner(@ctx)
        @pan_value = 0.5

        @node_buf.connect(eq1)
        eq1.connect(eq2)
        eq2.connect(eq3)
        eq3.connect(@panner.in)
        @panner.connect(@out)


    setSample: (@name) ->
        sample = SAMPLE.DATA[@name]
        return if not sample?
        @sample = sample
        if sample.data?
            @buffer = sample.data
        else
            req = new XMLHttpRequest()
            req.open('GET', sample.url, true)
            req.responseType = "arraybuffer"
            req.onload = () =>
                @ctx.decodeAudioData(
                    req.response,
                    ((@buffer) =>
                        @buffer_duration = (@buffer.length / CONSTANT.SAMPLE_RATE)
                        @parent.sampleLoaded(@id)
                    ),
                    (err) => console.log('ajax error'); console.log(err)
                )
                sample.data = @buffer
            req.send()

    connect: (@dst) -> @out.connect(@dst)

    noteOn: (gain, time) ->
        return if not @buffer?
        @source_old.stop(time) if @source_old?
        source = @ctx.createBufferSource()
        source.buffer = @buffer

        # source.connect(@node_buf)            # for mono source
        source.connect(@merger, 0, 0)     # for stereo source
        source.connect(@merger, 0, 1)
        @merger.connect(@node_buf)

        head_time = time + @buffer_duration * @head
        tail_time = time + @buffer_duration * @tail
        source.playbackRate.value = @speed
        source.start(0)
        @node_buf.gain.value = gain
        @source_old = source

    setTimeParam: (@head, @tail, @speed) ->
    getTimeParam: -> [@head, @tail, @speed]

    setEQParam: (@eq_gains) ->
        [@eq_nodes[0].gain.value, @eq_nodes[1].gain.value, @eq_nodes[2].gain.value] = (g * 0.2 for g in @eq_gains)

    getEQParam: -> @eq_gains

    setOutputParam: (@pan_value, gain) ->
        @panner.setPosition(@pan_value)
        @out.gain.value = gain

    getOutputParam: ->
        [@pan_value, @out.gain.value]

    getData: -> @buffer

    getParam: ->
        wave: @name, time: @getTimeParam(), gains: @eq_gains, output: @getOutputParam()

    setParam: (p) ->
        @setSample(p.wave) if p.wave?
        @setTimeParam(p.time[0], p.time[1], p.time[2]) if p.time?
        @setEQParam(p.gains) if p.gains?
        @setOutputParam(p.output[0], p.output[1]) if p.output?


# Export!
module.exports = SampleNode
