'use strict';

var Song = require('../models/song');

var test = function (req, res) {
  res.render('index', { debug: true, test: true });
};

var ie = function (req, res) {
  res.render('ie', { ie: true });
};

var mobile = function (req, res) {
  res.render('mobile', { mobile: true });
};

// Show default evil.
var index = function (req, res) {
  var is_dev = !!process.env.NODE_ENV.match(/dev/);
  return res.render('index', { debug: is_dev });
};

// Show a song.
var song = async function (req, res) {
  if (req.is_ie) {
    return res.render('ie', { ie: true });
  }
  if (req.is_mobile) {
    return res.render('mobile', { mobile: true });
  }

  var is_dev = !!process.env.NODE_ENV.match(/dev/);

  // Get the song data.
  var song_id = req.params.song_id;

  try {
    var song = await Song.findById(song_id);
    if (!song) {
      return res.redirect('/');
    }
    return res.render('index', { song: song, debug: is_dev });
  } catch (err) {
    console.error(JSON.stringify(err));
    return res.redirect('/');
  }
};

module.exports = {
  test: test,
  ie: ie,
  mobile: mobile,
  index: index,
  song: song,
};
