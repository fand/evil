test = ->
    p = window.player
    k = window.keyboard

    subtest 'Main Control', ->
        assertEq($('#control > [name=bpm]').val(), p.bpm + '', 'bpm')
        assertEq($('#control > [name=key]').val(), p.key + '', 'key')
        assertEq($('#control > [name=mode]').val(), p.scale + '', 'scale')

    subtest 'Initial View: Synth at 0', ->
        assertEq($('#btn-left').css('display'), 'none', 'btn-left hide')
        assertMatch($('#btn-left').attr('data-line1'), /prev/, 'btn-right text')
        assertEq($('#btn-right').css('display'), 'block', 'btn-right display')
        assertMatch($('#btn-right').attr('data-line1'), /new/, 'btn-right text =~ "new"')

    subtest 'Synth JSON', ->
        song = p.session.song
        s = p.synth[0]

        s0 =
            name: "s0"
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
        s.core.readParam(s0)

        s1 = s.getParam()

        assertEq(s0.name, s1.name, 'synth name')
        assertEq(s0.scale_name, s1.scale_name, 'scale')
        assertArrayEq(s0.gains, s1.gains, 'mixer gains')
        assertArrayEq(s0.filter, s1.filter, 'filter')
        assertArrayEq(s0.eg.adsr, s1.eg.adsr, 'eg adsr')
        assertArrayEq(s0.feg.adsr, s1.feg.adsr, 'feg adsr')   # range check is not needed
        assertEq(s0.shape, s1.shape, 'harmony')

        for i in [0...s0.vcos.length]
            v0 = s0.vcos[i]
            v1 = s1.vcos[i]
            assertEq(v0.fine, v1.fine, 'fine')
            assertEq(v0.interval, v1.interval, 'interval')
            assertEq(v0.octave, v1.octave, 'octave')
            assertEq(v0.shape, v1.shape, 'shape')

    subtest 'Main Control Change', ->
        c =
            bpm: 200
            key: 'D'
            scale: 'Major'
        $('#control > [name=bpm]').val(c.bpm).change()
        $('#control > [name=key]').val(c.key).change()
        $('#control > [name=mode]').val(c.scale).change()
        assertEq(p.bpm, c.bpm, 'bpm')
        assertEq(p.key, c.key, 'key')
        assertEq(p.scale, c.scale, 'scale')

    subtest 'Synth Sequencer', ->
        s = p.synth[0]
        p0 = [0, 0, 0, -10,'sustain', 'sustain', 'sustain', 'sustain',
              'sustain', 'end', 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0]
        s.pattern = p0

        canvas = $('#synth0 > .sequencer .table-hover')
        offset = canvas.offset()

        events = []
        for i in [0...3]
            e = new $.Event("mousedown")
            e.clientX = 26 * i + 10 + offset.left
            e.clientY = 10 + offset.top
            canvas.trigger(e)
            canvas.trigger('mouseup')

        p1 = s.getPattern()
        p0[0] = 20
        p0[1] = 20
        p0[2] = 20
        assertArrayEq(p0, p1.pattern, 'click')


        e = new $.Event("mousedown")
        e.clientX = 26 * 5 + 10 + offset.left
        e.clientY = 10 + offset.top
        canvas.trigger(e)

        e = new $.Event("mousemove")
        e.clientX = 26 * 6 + 10 + offset.left
        e.clientY = 10 + offset.top
        canvas.trigger(e)

        e = new $.Event("mouseup")
        e.clientX = 26 * 6 + 10 + offset.left
        e.clientY = 10 + offset.top
        canvas.trigger(e)

        p0 = [0, 0, 0, -10, 'end', -20, 'end', 0,
              0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0]





subtest = (s, t) ->
    console.group(s)
    t()
    console.groupEnd()

assert = (v, s) ->
    if v
        console.log('%c OK ... ' + s, 'color: #0d0;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')

assertEq = (v1, v2, s) ->
    if v1 == v2
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1 + ', v2:' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)
    console.groupEnd()

assertNotEq = (v1, v2, s) ->
    if v1 != v2
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1 + ', v2:' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)
    console.groupEnd()

assertMatch = (v1, v2, s) ->
    if v1.match(v2)
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1 + ', v2:' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)
    console.groupEnd()

assertNotMatch = (v1, v2, s) ->
    if not v1.match(v2)
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1 + ', v2:' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)
    console.groupEnd()

assertArrayEq = (v1, v2, s) ->
    res = true
    res = false if v1.length != v2.length
    for i in [0...v1.length]
        res = false if v1[i] != +v2[i] and v1[i] != v2[i] + ''

    if res
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1)
        console.log('v2: ' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1)
        console.log('v2: ' + v2)
    console.groupEnd()

assertArrayNotEq = (v1, v2, s) ->
    res = true
    res = false if v1.length != v2.length
    for i in [0...v1.length]
        res = false if v1[i] != +v2[i] and v1[i] != v2[i] + ''

    if not res
        console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
        console.log('v1: ' + v1 + ', v2:' + v2)
    else
        console.group('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)
     console.groupEnd()


$( ->
    setTimeout((-> test()), 1000)
)
