import React, { useEffect, useState } from 'react';
import { useAppStore } from './store';
import Player from '../ts/Player';
import Song from '../ts/Song';
import Keyboard from '../ts/Keyboard';
import { PlayerControls } from './components/PlayerControls';

/**
 * Main App component that wraps the entire application.
 * Gradually converting jQuery views to React components.
 */
export function App() {
  const player = useAppStore((state) => state.player);
  const setPlayer = useAppStore((state) => state.setPlayer);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize AudioContext and Player on mount
    const ctx = new AudioContext();
    // Pass false to skip creating PlayerView (we're using React PlayerControls instead)
    const playerInstance = new Player(ctx, false);
    const keyboard = new Keyboard(playerInstance);
    (window as any).keyboard = keyboard;

    setPlayer(playerInstance);

    // Load song data if available (injected from server)
    const songData = (window as any).song_loaded;
    if (songData) {
      playerInstance.readSong(JSON.parse(songData.json));
    } else {
      playerInstance.readSong(Song.DEFAULT);
    }

    setIsInitialized(true);
  }, [setPlayer]);

  if (!player || !isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Footer with React PlayerControls */}
      <footer>
        <PlayerControls />

        <div id="song-info">
          <div>
            <label>title: </label>
            <input type="text" id="song-title" />
          </div>
          <div>
            <label>by: </label>
            <input type="text" id="song-creator" />
          </div>
        </div>
      </footer>
    </>
  );
}
