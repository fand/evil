import { EventEmitter } from 'eventemitter3';
import ViewConstants from '../constants/View';

// ViewAction receives events directly (without Dispatcher).
// because ViewActions don't need changes to Store.
class ViewAction extends EventEmitter {
  selectTrack (index) {
    this.emit(ViewConstants.SELECT_TRACK, index);
  }

  selectScene (index) {
    this.emit(ViewConstants.SELECT_SCENE, index);
  }

  selectCell (index, id) {
    this.emit(ViewConstants.SELECT_CELL, index, id);
  }
}

export default new ViewAction();
