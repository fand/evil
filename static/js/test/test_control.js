(function () {
  this.t.subtest('Main Control', function () {
    this.assertEq(
      $('#control > [name=bpm]').val(),
      window.player.bpm + '',
      'bpm'
    );
    this.assertEq(
      $('#control > [name=key]').val(),
      window.player.key + '',
      'key'
    );
    return this.assertEq(
      $('#control > [name=mode]').val(),
      window.player.scale + '',
      'scale'
    );
  });

  this.t.subtest('Main Control Change', function () {
    var c;
    c = {
      bpm: 200,
      key: 'D',
      scale: 'Major',
    };
    $('#control > [name=bpm]').val(c.bpm).change();
    $('#control > [name=key]').val(c.key).change();
    $('#control > [name=mode]').val(c.scale).change();
    this.assertEq(window.player.bpm, c.bpm, 'bpm');
    this.assertEq(window.player.key, c.key, 'key');
    return this.assertEq(window.player.scale, c.scale, 'scale');
  });
}).call(this);
