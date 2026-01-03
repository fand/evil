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
  const topSorry = document.getElementById('top-sorry');
  if (topSorry) topSorry.style.display = 'block';
  document.getElementById('top-logo-wrapper')?.classList.add('logo-sorry');
};

const initEvil = function () {
  // Don't use MutekiTimer here!!
  // (it causes freeze)
  setTimeout(() => {
    const top = document.getElementById('top');
    const topLogo = document.getElementById('top-logo');
    if (top) {
      top.style.opacity = '0';
      setTimeout(() => {
        top.style.zIndex = '-1';
      }, 500);
    }
    if (topLogo) {
      topLogo.style.webkitTransform = 'translate3d(0px, -100px, 0px)';
      topLogo.style.opacity = '0';
    }
  }, 1500);

  const ctx = new AudioContext();
  const player = new Player(ctx);
  const keyboard = new Keyboard(player);
  window.keyboard = keyboard;

  const footer_size = window.innerHeight / 2 - 300;
  const footer = document.querySelector('footer');
  if (footer) footer.style.height = footer_size + 'px';

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
