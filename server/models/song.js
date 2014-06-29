'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    ShortId = require('mongoose-shortid');


var SongSchema = new Schema({
  _id: {
    type: ShortId,
    len: 7,
    base: 64,
    retries: 4
  },
  title:    { type: String, default: 'Untitled' },
  creator: { type: String, default: 'Anonymous' },
  user_id: ObjectId,
  json: { type: String, required: true }
});

SongSchema
  .path('json')
  .validate(function(json) {
    // return (this.json !== json);
    return true;
  }, 'json cant be saved without any updates');

SongSchema.methods = {};

module.exports = mongoose.model('Song', SongSchema);
