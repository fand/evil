import $ from 'jquery';
import { Player } from './Player';
import { Keyboard } from './Keyboard';
import { DEFAULT_SONG, Song } from './Song';

const sorry = function () {
  $('#top-sorry').show();
  $('#top-logo-wrapper').addClass('logo-sorry');
};

const initEvil = function () {
  // Don't use MutekiTimer here!!
  // (it causes freeze)
  setTimeout(() => {
    $('#top')
      .css({
        opacity: '0',
      })
      .delay(500)
      .css('z-index', '-1');
    $('#top-logo').css({
      '-webkit-transform': 'translate3d(0px, -100px, 0px)',
      opacity: '0',
    });
  }, 1500);

  const ctx = new AudioContext();
  const player = new Player(ctx);
  const keyboard = new Keyboard(player);
  (window as any).keyboard = keyboard;

  const footer_size = window.innerHeight / 2 - 300;
  $('footer').css('height', footer_size + 'px');

  // Read song
  const song: Song = (() => {
    if ((window as any).song_loaded) {
      return JSON.parse((window as any).song_loaded.json);
    } else {
      return DEFAULT_SONG;
    }
  })();

  player.readSong(song);
};

// ------------------------------------------------------------------------------
// Main

(function () {
  console.log('Welcome to evil!');

  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/chrome/g)) {
    initEvil();
  } else {
    sorry();
  }
})();
