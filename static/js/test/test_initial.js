(function () {
  this.t.subtest('Initial View: Synth at 0', function () {
    this.assertEq($('#btn-left').css('display'), 'none', 'btn-left hide');
    this.assertMatch(
      $('#btn-left').attr('data-line1'),
      /prev/,
      'btn-right text'
    );
    this.assertEq($('#btn-right').css('display'), 'block', 'btn-right display');
    return this.assertMatch(
      $('#btn-right').attr('data-line1'),
      /new/,
      'btn-right text =~ "new"'
    );
  });
}).call(this);
