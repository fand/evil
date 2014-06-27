'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var SongSchema = new Schema({
  title:    { type: String, default: 'Untitled' },
  composer: { type: String, default: 'Anonymous' },
  user_id: ObjectId,
  json: { type: String, required: true }
});

SongSchema
  .path('json')
  .validate(function(json) {
    return (this.json !== json);
  }, 'json cant be saved without any updates');

SongSchema.methods = {};

module.exports = mongoose.model('Song', SongSchema);
