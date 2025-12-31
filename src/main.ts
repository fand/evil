import $ from 'jquery';
import { Player } from './Player';
import { Keyboard } from './Keyboard';
import { Song } from './Song';
import { mountReactApp } from './react';

declare global {
  interface Window {
    keyboard: Keyboard;
    song_loaded?: { json: string };
  }
}

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
  window.keyboard = keyboard;

  const footer_size = window.innerHeight / 2 - 300;
  $('footer').css('height', footer_size + 'px');

  // Read song
  if (window.song_loaded) {
    const song: Song = JSON.parse(window.song_loaded.json);
    player.loadSong(song);
  }
  // If no song is loaded, Player constructor already set up default state

  // Mount React app (currently empty, will be populated as views are migrated)
  mountReactApp();
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
