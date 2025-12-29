'use strict';

var mongoose = require('mongoose');
var Song = mongoose.model('Song');

var get = async function (req, res, next) {
  var song_id = req.params.song_id;
  try {
    var song = await Song.findById(song_id);
    if (!song) return res.status(404).send();
    res.json({ song: song });
  } catch (err) {
    return next(err);
  }
};

var create = async function (req, res, next) {
  var song = new Song();
  song.title = req.body.title;
  song.creator = req.body.creator;
  song.json = req.body.json;

  try {
    await song.save();
    res.send(song.id);
  } catch (err) {
    return res.status(400).json(err);
  }
};

var update = async function (req, res, next) {
  var song_id = req.params.song_id;

  try {
    var song = await Song.findById(song_id);
    if (!song) return res.status(404).send();

    song.title = req.body.title;
    song.creator = req.body.creator;
    song.json = req.body.json;

    await song.validate();
    await song.save();
    res.status(200).send();
  } catch (err) {
    return next(err);
  }
};

var list = function (req, res, next) {
  res.json(req.user || null);
};

module.exports = {
  get: get,
  create: create,
  update: update,
  list: list,
};
