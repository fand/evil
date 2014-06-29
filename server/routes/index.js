'use strict';

var Song = require('../models/song');


var test = function(req, res) {
  res.render('index', { debug: true, test: true });
};

var pc = function(req, res) {
  res.render('pc');
};

var mobile = function(req, res) {
  res.render('mobile');
};


// Show default evil.
var index = function(req, res) {
  var is_dev = !!(process.env.NODE_ENV.match(/dev/));
  return res.render('index', { debug: is_dev });
};

// Show a song.
var song = function(req, res) {

  // Get the song data.
  var song_id = req.params.song_id;

  Song.findById(song_id, function (err, song) {
    if (err || !song) {
      console.error(JSON.stringify(err));

      // return res.render('index', { debug: is_dev });
      return res.redirect('/');
    }
    return res.render('index', { song: song, debug: is_dev });
  });
};


module.exports = {
  test: test,
  pc: pc,
  mobile: mobile,
  index: index,
  song: song
};
