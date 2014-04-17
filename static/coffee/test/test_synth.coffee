@t.subtest 'Synth JSON', ->
    song = window.player.session.song
    s = window.player.synth[0]

    # Save original param.
    param_original = s.getParam()

    s0 =
        name: "s0"
        type: "REZ"
        pattern_name: "p1"
        scale_name: "minor"
        gains: [0, 1, 2]
        filter: [3, 4]
        eg: adsr: [11, 22, 33, 44], range: [1, 5]
        feg: adsr: [55, 66, 77, 88], range: [10, 50]
        vcos: [ (fine: 1, interval: 2, octave: 3, shape: 'SINE'),
                (fine: 4, interval: 5, octave: 6, shape: 'SAW'),
                (fine: 7, interval: 8, octave: 9, shape: 'RECT') ]
        harmony: 'harmony'

    s.setSynthName(s0.name)
    # s.setPatternName(s0.pattern_name)  # pattern_name is not synth param
    s.setScale(s0.scale_name)
    s.core.setParam(s0)

    s1 = s.getParam()
    @assertEq(s0.name, s1.name, 'synth name')
    @assertEq(s0.scale_name, s1.scale_name, 'scale')
    @assertArrayEq(s0.gains, s1.gains, 'mixer gains')
    @assertArrayEq(s0.filter, s1.filter, 'filter')
    @assertArrayEq(s0.eg.adsr, s1.eg.adsr, 'eg adsr')
    @assertArrayEq(s0.feg.adsr, s1.feg.adsr, 'feg adsr')   # range check is not needed
    @assertEq(s0.shape, s1.shape, 'harmony')

    for i in [0...s0.vcos.length]
        v0 = s0.vcos[i]
        v1 = s1.vcos[i]
        @assertEq(v0.fine, v1.fine, 'fine')
        @assertEq(v0.interval, v1.interval, 'interval')
        @assertEq(v0.octave, v1.octave, 'octave')
        @assertEq(v0.shape, v1.shape, 'shape')
    # Reset params
    s.setParam(param_original)

@t.subtest 'Change synth type', ->
    s = window.player.synth[0]
    $('.synth-type').eq(0).val('SAMPLER').change()
    @assertEq(window.player.synth[0].type, 'SAMPLER', 'changed to SAMPLER')
    @assertEq(window.player.synth.length, 1, 'only 1 synth')
    $('.synth-type').eq(0).val('REZ').change()
    @assertEq(window.player.synth[0].type, 'REZ', 'changed to REZ')

@t.subtest 'Synth Sequencer', ->
    s = window.player.synth[0]
    canvas = $('#synth0 > .sequencer .table-hover')
    p0 = s.getPattern().pattern

    for i in [0...3]
        @mousedown(canvas, 26 * i + 10, 10)
        @mouseup(canvas)

    p0[0] = 20
    p0[1] = 20
    p0[2] = 20
    @assertArrayEq(p0, s.getPattern().pattern, 'click')

    @mousedrag(canvas, [
        (x: 26 * 8  + 10, y: 10),
        (x: 26 * 14 + 10, y: 10)
    ])
    p0 = [20, 20, 20, 0, 0, 0, 0, 0,
          -20, 'sustain', 'sustain', 'sustain', 'sustain', 'sustain', 'end', 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0]
    @assertArrayEq(p0, s.getPattern().pattern, 'drag')

    @mousedrag(canvas, [
        (x: 26 * 10 + 10, y: 26 * 1 + 10),
        (x: 26 * 11 + 10, y: 26 * 1 + 10),
        (x: 26 * 12 + 10, y: 26 * 1 + 10)
    ])
    p0 = [20, 20, 20, 0, 0, 0, 0, 0,
          -20, 'end', -19, 'sustain', 'end', 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0]
    @assertArrayEq(p0, s.getPattern().pattern, 'drag and divide sustain')


    @mousedrag(canvas, [
        (x: 26 * 9  + 10, y: 26 * 2 + 10),
        (x: 26 * 10 + 10, y: 26 * 2 + 10)
    ])
    p0 = [20, 20, 20, 0, 0, 0, 0, 0,
          20, -18, 'end', -19, 'end', 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0]
    @assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain')


    @mousedrag(canvas, [
        (x: 26 * 8  + 10, y: 10),
        (x: 26 * 14 + 10, y: 10)
    ])
    @mousedrag(canvas, [
        (x: 26 * 10 + 10, y: 26 * 1 + 10),
        (x: 26 * 11 + 10, y: 26 * 1 + 10),
        (x: 26 * 12 + 10, y: 26 * 1 + 10)
    ])
    @mousedrag(canvas, [
        (x: 26 * 9  + 10, y: 26 * 2 + 10),
        (x: 26 * 10 + 10, y: 26 * 2 + 10),
        (x: 26 * 11 + 10, y: 26 * 2 + 10)
    ])
    p0 = [20, 20, 20, 0, 0, 0, 0, 0,
          20, -18, 'sustain', 'end', 19, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0]
    @assertArrayEq(p0, s.getPattern().pattern, 'drag and join sustain')

    @mousedrag(canvas, [
        (x: 26 * 14 + 10, y: 10),
        (x: 26 *  8 + 10, y: 10)
    ])
    @mousedrag(canvas, [
        (x: 26 * 12 + 10, y: 26 * 1 + 10),
        (x: 26 * 11 + 10, y: 26 * 1 + 10),
        (x: 26 * 10 + 10, y: 26 * 1 + 10)
    ])
    @mousedrag(canvas, [
        (x: 26 * 11 + 10, y: 26 * 2 + 10),
        (x: 26 * 10 + 10, y: 26 * 2 + 10),
        (x: 26 *  9 + 10, y: 26 * 2 + 10)
    ])
    p0 = [20, 20, 20, 0, 0, 0, 0, 0,
          20, -18, 'sustain', 'end', 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0]
    @assertArrayEq(p0, s.getPattern().pattern, 'drag RL')
