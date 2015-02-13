'use strict';

var EventEmitter = require('eventemitter3').EventEmitter;
const ViewConstants = require('../constants/View');

// ViewAction receives events directly (without Dispatcher).
// because ViewActions don't need changes to Store.
class ViewAction extends EventEmitter {
  selectTrack (index) {
    this.emit(ViewConstants.SELECT_TRACK, index);
  }

  selectScene (index) {
    this.emit(ViewConstants.SELECT_SCENE, index);
  }

  selectCell (id) {
    this.emit(ViewConstants.SELECT_CELL, id);
  }
}

module.exports = new ViewAction();
