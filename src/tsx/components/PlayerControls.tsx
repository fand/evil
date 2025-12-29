import React, { useState, useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { KEY_LIST } from '../../ts/Constant';
import type { NoteKey, NoteScale } from '../../ts/Constant';

/**
 * PlayerControls component - manages transport controls and musical parameters
 * Replaces the footer control section of the original PlayerView
 */
export function PlayerControls() {
  const player = usePlayer();

  const [bpm, setBpm] = useState(120);
  const [noteKey, setNoteKey] = useState<NoteKey>('A');
  const [scale, setScale] = useState<NoteScale>('Major');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(true);

  useEffect(() => {
    if (!player) return;

    // Initialize state from player
    setBpm(player.bpm);
    setNoteKey(player.key);
    setScale(player.scale);
  }, [player]);

  if (!player) return null;

  const handleBpmChange = (value: number) => {
    setBpm(value);
    player.setBPM(value);
  };

  const handleKeyChange = (value: NoteKey) => {
    setNoteKey(value);
    player.setKey(value);
  };

  const handleScaleChange = (value: NoteScale) => {
    setScale(value);
    player.setScale(value);
  };

  const handlePlayPause = () => {
    if (player.isPlaying()) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    player.stop();
    setIsPlaying(false);
  };

  const handleForward = () => {
    player.forward();
  };

  const handleBackward = () => {
    player.backward();
  };

  const handleToggleLoop = () => {
    const newLoopState = player.toggleLoop();
    setIsLoopOn(newLoopState);
  };

  const handleInputFocus = () => {
    if (window.keyboard) {
      window.keyboard.beginInput();
    }
  };

  const handleInputBlur = () => {
    if (window.keyboard) {
      window.keyboard.endInput();
    }
  };

  return (
    <>
      {/* Control parameters */}
      <div id="control">
        key:{' '}
        <select
          name="key"
          value={noteKey}
          onChange={(e) => handleKeyChange(e.target.value as NoteKey)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          <option>A</option>
          <option>D</option>
          <option>G</option>
          <option>C</option>
          <option>F</option>
          <option>Bb</option>
          <option>Eb</option>
          <option>Ab</option>
          <option>Db</option>
          <option>Gb</option>
          <option>B</option>
          <option>E</option>
        </select>
        scale:{' '}
        <select
          name="mode"
          value={scale}
          onChange={(e) => handleScaleChange(e.target.value as NoteScale)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          <option>Major</option>
          <option>minor</option>
          <option>Pentatonic</option>
          <option>Harm-minor</option>
          <option>Dorian</option>
          <option>Phrygian</option>
          <option>Lydian</option>
          <option>Mixolydian</option>
          <option>CHROMATIC</option>
        </select>
        bpm:{' '}
        <input
          name="bpm"
          min="60"
          max="1000"
          value={bpm}
          type="number"
          onChange={(e) => handleBpmChange(Number(e.target.value))}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {/* Transport controls */}
      <i
        id="control-play"
        className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}
        onMouseDown={handlePlayPause}
      />
      <i
        id="control-forward"
        className="fa fa-forward"
        onMouseDown={handleForward}
      />
      <i
        id="control-backward"
        className="fa fa-backward"
        onMouseDown={handleBackward}
      />
      <i
        id="control-loop"
        className={`fa fa-repeat ${isLoopOn ? 'control-on' : 'control-off'}`}
        onMouseDown={handleToggleLoop}
      />
    </>
  );
}
