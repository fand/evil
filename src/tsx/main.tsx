import $ from 'jquery';
import MutekiTimer from '../ts/MutekiTimer';
import Player from '../ts/Player';
import Keyboard from '../ts/Keyboard';
import Song from '../ts/Song';

// Constants
const SAMPLE_RATE = 48000;
const T = new MutekiTimer();

const showSorryMessage = function () {
  $('#top-sorry').show();
  return $('#top-logo-wrapper').addClass('logo-sorry');
};

const initEvil = function () {
  // Hide loading screen
  setTimeout(() => {
    $('#top')
      .css({ opacity: '0' })
      .delay(500)
      .css('z-index', '-1');
    return $('#top-logo').css({
      '-webkit-transform': 'translate3d(0px, -100px, 0px)',
      opacity: '0',
    });
  }, 1500);

  // Initialize Web Audio Context
  const ctx = new AudioContext();
  const player = new Player(ctx);
  const keyboard = new Keyboard(player);
  (window as any).keyboard = keyboard;

  // Set footer height
  const footer_size = $(window).height() / 2 - 300;
  $('footer').css('height', footer_size + 'px');

  // Load song data
  if ((window as any).song_loaded != null) {
    return player.readSong(JSON.parse((window as any).song_loaded.json));
  } else {
    return player.readSong(Song.DEFAULT);
  }
};

// Main entry point
(function () {
  console.log('Welcome to evil! (React migration in progress...)');

  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/chrome/g)) {
    return initEvil();
  } else {
    return showSorryMessage();
  }
})();
