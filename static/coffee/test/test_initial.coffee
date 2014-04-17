@t.subtest 'Initial View: Synth at 0', ->
    @assertEq($('#btn-left').css('display'), 'none', 'btn-left hide')
    @assertMatch($('#btn-left').attr('data-line1'), /prev/, 'btn-right text')
    @assertEq($('#btn-right').css('display'), 'block', 'btn-right display')
    @assertMatch($('#btn-right').attr('data-line1'), /new/, 'btn-right text =~ "new"')
