'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var SongSchema = new Schema({
  _id: {
    type: String,
    default: () => crypto.randomUUID(),
  },
  title: { type: String, default: 'Untitled' },
  creator: { type: String, default: 'Anonymous' },
  user_id: ObjectId,
  json: { type: String, required: true },
});

SongSchema.path('json').validate(function (json) {
  // return (this.json !== json);
  return true;
}, 'json cant be saved without any updates');

SongSchema.methods = {};

module.exports = mongoose.model('Song', SongSchema);
