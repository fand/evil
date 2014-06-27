class @Tester
    constructor: ->
        @subtests = {}

    subtest: (s, t) ->
        @subtests[s] = t

    runAll: ->
        for s, t of @subtests
            console.group(s)
            t.call(this)
            console.groupEnd()

    # Assertion methods
    assert: (v, s) ->
        if v
            console.log('%c OK ... ' + s, 'color: #0d0;')
        else
            console.log('%c FAILED! ... ' + s, 'color: #f44;')

    assertEq: (v1, v2, s) ->
        if v1 == v2
            console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
            console.log('v1: ' + v1 + ', v2:' + v2)
        else
            console.group('%c FAILED! ... ' + s, 'color: #f44;')
            console.log('v1: ' + v1 + ', v2: ' + v2)
        console.groupEnd()

    assertNotEq: (v1, v2, s) ->
        if v1 != v2
            console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
            console.log('v1: ' + v1 + ', v2:' + v2)
        else
            console.group('%c FAILED! ... ' + s, 'color: #f44;')
            console.log('v1: ' + v1 + ', v2: ' + v2)
        console.groupEnd()

    assertMatch: (v1, v2, s) ->
        if v1.match(v2)
            console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
            console.log('v1: ' + v1 + ', v2:' + v2)
        else
            console.group('%c FAILED! ... ' + s, 'color: #f44;')
            console.log('v1: ' + v1 + ', v2: ' + v2)
        console.groupEnd()

    assertNotMatch: (v1, v2, s) ->
        if not v1.match(v2)
            console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
            console.log('v1: ' + v1 + ', v2:' + v2)
        else
            console.group('%c FAILED! ... ' + s, 'color: #f44;')
            console.log('v1: ' + v1 + ', v2: ' + v2)
        console.groupEnd()

    assertArrayEq: (v1, v2, s) ->
        res = true
        res = false if v1.length != v2.length
        for i in [0...v1.length]
            res = false if v1[i] != +v2[i] and v1[i] != v2[i] + '' and v1[i] - +v2[i] > 0.00001  # almost equal

        if res
            console.groupCollapsed('%c OK ... ' + s, 'color: #4f4;')
            console.log('v1: ' + v1)
            console.log('v2: ' + v2)
        else
            console.group('%c FAILED! ... ' + s, 'color: #f44;')
            console.log('v1: ' + v1)
            console.log('v2: ' + v2)
        console.groupEnd()

    assertArrayNotEq: (v1, v2, s) ->
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

    # Mouse simulators
    mousedown: (target, x, y) ->
        offset = target.offset()
        e = new $.Event('mousedown')
        e.clientX = x + offset.left
        e.clientY = y + offset.top
        target.trigger(e)

    mouseup: (target) ->
        target.trigger('mouseup')

    mousedrag: (target, pos) ->
        offset = target.offset()
        e = new $.Event('mousedown')
        e.clientX = pos[0].x + offset.left
        e.clientY = pos[0].y + offset.top
        target.trigger(e)
        for p in pos
            e = new $.Event('mousemove')
            e.clientX = p.x + offset.left
            e.clientY = p.y + offset.top
            target.trigger(e)
        target.trigger('mouseup')


@t = new @Tester()
@subtest = (s, t) -> @t.subtest(s, t)
