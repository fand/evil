'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    shortid = require('shortid');


var SongSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
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
