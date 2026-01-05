import { createRoot } from 'react-dom/client';
import { Player } from './Player';
import { Keyboard } from './Keyboard';
import { Song } from './Song';
import { App } from './components/App';
import './styles/global.css';

declare global {
  interface Window {
    keyboard: Keyboard;
    song_loaded?: { json: string };
  }
}

(function main() {
  // Hide splash screen after load
  setTimeout(() => {
    const top = document.getElementById('top')!;
    const logo = document.getElementById('evil-logo')!;

    logo.style.transform = 'translateY(-100px)';
    logo.style.opacity = '0';

    setTimeout(() => {
      top.style.opacity = '0';
      setTimeout(() => {
        top.style.zIndex = '-1';
      }, 500);
    }, 300);
  }, 1500);

  const ctx = new AudioContext();
  const player = new Player(ctx);
  const keyboard = new Keyboard(player);
  window.keyboard = keyboard;

  // Read song
  if (window.song_loaded) {
    const song: Song = JSON.parse(window.song_loaded.json);
    player.loadSong(song);
  }
  // If no song is loaded, Player constructor already set up default state

  // Mount React app
  const appRoot = document.getElementById('app');
  if (appRoot) {
    createRoot(appRoot).render(<App />);
  }
})();
