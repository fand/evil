test = ->
    p = window.player

    subtest 'Main Control', ->
        assertEq($('#control > [name=bpm]').val(), p.bpm + '', 'bpm')
        assertEq($('#control > [name=key]').val(), p.key + '', 'key')
        assertEq($('#control > [name=mode]').val(), p.scale + '', 'scale')

    subtest 'Initial View: Synth at 0', ->
        assertEq($('#btn-left').css('display'), 'none', 'btn-left hide')
        assertMatch($('#btn-left').attr('data-line1'), /prev/, 'btn-right text')
        assertEq($('#btn-right').css('display'), 'block', 'btn-right display')
        assertMatch($('#btn-right').attr('data-line1'), /new/, 'btn-right text =~ "new"')

    # subtest 'Main Control', ->
    #     assertEq($('#control > [name=bpm]').val(), '144', 'bpm')
    #     assertEq($('#control > [name=key]').val(), 'A', 'key')
    #     assertEq($('#control > [name=mode]').val(), 'Major', 'scale')



subtest = (s, t) ->
    console.log(s)
    t()

assert = (v, s) ->
    if v
        console.log('%c OK ... ' + s, 'color: #0d0;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')

assertEq = (v1, v2, s) ->
    if v1 == v2
        console.log('%c OK ... ' + s, 'color: #4f4;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)

assertNotEq = (v1, v2, s) ->
    if v1 != v2
        console.log('%c OK ... ' + s, 'color: #4f4;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)

assertMatch = (v1, v2, s) ->
    if v1.match(v2)
        console.log('%c OK ... ' + s, 'color: #4f4;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)

assertNotMatch = (v1, v2, s) ->
    if not v1.match(v2)
        console.log('%c OK ... ' + s, 'color: #4f4;')
    else
        console.log('%c FAILED! ... ' + s, 'color: #f44;')
        console.log('v1: ' + v1 + ', v2: ' + v2)





$( ->
    setTimeout((-> test()), 1000)
)
