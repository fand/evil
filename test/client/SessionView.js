/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var T = React.addons.TestUtils;
var $ = require('jquery');

var SessionView = require('../../src/client/components/SessionView');
var Song = require('../../src/client/models/Song');

var $$ = function (r) {
  return $(React.renderToStaticMarkup(r));
};

describe('SessionView', function () {
  this.timeout(15000);

  var song, selection, isVisible;
  const testSong = new Song({
    title: 'default song',
    tracks: [{
      name: 'Bass',
      device: {
        name: 'Buzzsaw',
      },
      clips: [{
        name   : 'Intro',
        length : 8
      }, {
        name   : 'Verse',
        length : 8
      }]
    }, {
      name: 'Drum',
      device: {
        name: 'Sampler',
      },
      clips: [{
        name   : 'Intro',
        length : 4
      }]
    }],
    scenes: [{
      name  : 'intro',
      bpm   : 140,
      beats : 4,
    }, {
      name  : 'verse',
      bpm   : 140,
      beats : 3,
    }, {
      name  : 'chorus',
      bpm   : 180,
      beats : 4
    }]
  });
  const testSelection = {
    currentTrack: 0,
    currentScene: 0,
    currentCell: 'hoge'
  };

  beforeEach(function () {
    song      = undefined;
    selection = undefined;
    isVisible = undefined;
  });

  it('is visible only if isVisible === true', function () {
    song = testSong;
    selection = testSelection;

    var s1 = <SessionView song={song} isVisible={false} selection={selection}/>;
    assert(! $$(s1).hasClass('visible'), 'invisible ok');

    var s2 = <SessionView song={song} isVisible={true} selection={selection}/>;
    assert($$(s2).hasClass('visible'), 'visible ok');

  });

  it('shows given song correctly', function () {
    song = testSong;
    selection = testSelection;

    var $view = $$(<SessionView song={song} isVisible={true} selection={selection}/>);

    var tracks = $view.find('.SessionTrackView');
    assert(tracks.length === song.tracks.length, '# of tracks ok');

    tracks.each((i, _track) => {
      var track = $(_track);
      console.log(track);
      var trackHeader = track.find('.SessionTrackHeader');
      assert(trackHeader.text().match(song.tracks[i].get('name')), 'track[' + i + '] name ok');

      var cells = track.find('.cell');
      assert(cells.length === song.scenes.length, '# of scenes ok');

      cells.each((j, _cell) => {
        var cell = $(_cell);
        if (song.tracks[i].clips[j] != null) {
          assert(cell.text().match(song.tracks[i].clips[j].name), 'clip [' + i + '][' + j + '] name ok');
        }
        else {
          assert(cell.text() === '', 'empty cell ok');
        }
      })
    });
  });
});
