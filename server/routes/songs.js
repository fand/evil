'use strict';

var mongoose = require('mongoose');
var Song = mongoose.model('Song');


var get = function (req, res, next) {
  var song_id = req.params.song_id;
  Song.findById(song_id, function (err, song) {
    if (err) return next(err);
    if (!song) return res.send(404);
    res.json({ song: song });
  });
};

var create = function (req, res, next) {
  var song = new Song();
  song.title    = req.body.title;
  song.creator = req.body.creator;
  song.json     = req.body.json;

  song.save(function(err) {
    if (err) return res.json(400, err);
    res.send(song.id);
  });
};

var update = function(req, res, next) {
  var song_id = req.params.song_id;

  Song.findById(song_id, function (err, song) {
    if (err) return next(err);
    if (!song) return res.send(404);

    song.title    = req.body.title;
    song.creator = req.body.creator;
    song.json     = req.body.json;

    song.validate(function (err) {
      if (err) return next(err);
      song.save(function () {
        if (err) return res.send(400);
        res.send(200);
      });
    });
  });
};

var list = function(req, res, next) {
  res.json(req.user || null);
};


module.exports = {
  get: get,
  create: create,
  update: update,
  list: list
};
