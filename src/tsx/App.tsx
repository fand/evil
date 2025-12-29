import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { LegacyJQueryComponent } from './components/LegacyJQueryComponent';
import Player from '../ts/Player';
import PlayerView from '../ts/PlayerView';
import MixerView from '../ts/MixerView';
import SessionView from '../ts/SessionView';

/**
 * Main App component that wraps the entire application.
 * Currently mounts jQuery-based views using LegacyJQueryComponent.
 * These will be gradually replaced with native React components.
 */
export function App() {
  const player = useAppStore((state) => state.player);
  const setPlayer = useAppStore((state) => state.setPlayer);

  useEffect(() => {
    // Initialize AudioContext and Player on mount
    const ctx = new AudioContext();
    const playerInstance = new Player(ctx);
    setPlayer(playerInstance);

    // Load song data if available (injected from server)
    const songData = (window as any).song_loaded;
    if (songData) {
      playerInstance.readSong(JSON.parse(songData.json));
    }
  }, [setPlayer]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="evil-app">
      {/* Temporarily mount jQuery views - will be replaced with React components */}
      <LegacyJQueryComponent ViewClass={PlayerView} model={player} />
      <LegacyJQueryComponent ViewClass={SessionView} model={player.session} />
      <LegacyJQueryComponent ViewClass={MixerView} model={player.mixer} />
    </div>
  );
}
