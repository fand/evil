@t.subtest 'Main Control', ->
    @assertEq($('#control > [name=bpm]').val(), window.player.bpm + '', 'bpm')
    @assertEq($('#control > [name=key]').val(), window.player.key + '', 'key')
    @assertEq($('#control > [name=mode]').val(), window.player.scale + '', 'scale')

@t.subtest 'Main Control Change', ->
    c =
        bpm: 200
        key: 'D'
        scale: 'Major'
    $('#control > [name=bpm]').val(c.bpm).change()
    $('#control > [name=key]').val(c.key).change()
    $('#control > [name=mode]').val(c.scale).change()
    @assertEq(window.player.bpm, c.bpm, 'bpm')
    @assertEq(window.player.key, c.key, 'key')
    @assertEq(window.player.scale, c.scale, 'scale')
