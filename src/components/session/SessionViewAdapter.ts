/**
 * SessionViewAdapter - Minimal adapter to replace SessionView for React.
 * Handles non-rendering methods (dialogs, state) while React handles rendering.
 */
import $ from 'jquery';
import { store } from '../../store';
import type { Session } from '../../Session';
import type { Song } from '../../Song';

export class SessionViewAdapter {
  private _session: Session;
  private select_pos: { x: number; y: number; type: string } = { x: 0, y: 0, type: 'master' };
  private dialog: JQuery;
  private dialog_wrapper: JQuery;
  private dialog_close: JQuery;

  get song(): Song {
    return this._session.song;
  }

  constructor(model: Session) {
    this._session = model;

    // Dialog elements
    this.dialog = $('#dialog');
    this.dialog_wrapper = $('#dialog-wrapper');
    this.dialog_close = this.dialog.find('.dialog-close');

    // Setup dialog events
    this.dialog.on('mousedown', (e) => {
      if (
        !this.dialog_wrapper.is(e.target) &&
        this.dialog_wrapper.has(e.target).length === 0
      ) {
        this.closeDialog();
      }
    });
    this.dialog_close.on('mousedown', () => this.closeDialog());
  }

  // ========================================
  // No-op methods - React handles rendering via store
  // ========================================

  loadSong(_currentCells: (number | undefined)[]) {
    // React components subscribe to store.song for updates
    this._session.syncSongToStore();
  }

  drawScene(_pos: number, _cells: (number | undefined)[]) {
    // React subscribes to playback.scenePos and playback.currentCells
  }

  drawTrackName(idx: number, name: string, _type?: string) {
    // Sync to store so React can pick it up
    if (this.song.tracks[idx]) {
      this.song.tracks[idx].name = name;
      this._session.syncSongToStore();
    }
  }

  drawPatternName(_x: number, _y: number, _p: { name: string }) {
    // React re-renders from store.song
    this._session.syncSongToStore();
  }

  clearAllActive() {
    // React subscribes to playback.currentCells
  }

  addInstrument() {
    // Sync to store so React can pick it up
    this._session.syncSongToStore();
  }

  resize() {
    // React handles canvas sizing
  }

  // ========================================
  // Selection state
  // ========================================

  getSelectPos() {
    if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
      return this.select_pos;
    }
  }

  setSelectPos(pos: { x: number; y: number; type: string }) {
    this.select_pos = pos;
  }

  // ========================================
  // Dialog methods - Keep functionality
  // ========================================

  showSuccess(_url: string, songTitle: string, userName: string) {
    let text: string;
    let title: string;

    if (songTitle != null) {
      if (userName != null) {
        text = '"' + songTitle + '" by ' + userName;
      } else {
        text = '"' + songTitle + '"';
      }
      title = text + ' :: evil';
    } else {
      text = '"evil" by gmork';
      title = 'evil';
    }
    const url = 'http://evil.gmork.in/' + _url;

    history.pushState('', title, _url);
    document.title = title;

    this.dialog.css({ opacity: '1', 'z-index': '10000' });
    this.dialog.find('#dialog-socials').show();
    this.dialog.find('#dialog-success').show();
    this.dialog.find('#dialog-error').hide();
    this.dialog.find('.dialog-message-sub').text(url);

    const twUrl =
      'http://twitter.com/intent/tweet?url=' +
      encodeURI(url + '&text=' + text + '&hashtags=evil');
    const fbUrl = 'http://www.facebook.com/sharer.php?&u=' + url;

    this.dialog
      .find('.dialog-twitter')
      .attr('href', twUrl)
      .off('click')
      .on('click', () => this.closeDialog());
    this.dialog
      .find('.dialog-facebook')
      .attr('href', fbUrl)
      .off('click')
      .on('click', () => this.closeDialog());
  }

  showError() {
    this.dialog.css({ opacity: '1', 'z-index': '10000' });
    this.dialog.find('#dialog-socials').hide();
    this.dialog.find('#dialog-success').hide();
    this.dialog.find('#dialog-error').show();
  }

  closeDialog() {
    this.dialog.css({ opacity: '1', 'z-index': '-10000' });
  }
}
