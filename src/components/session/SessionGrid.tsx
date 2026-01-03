import { useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import { TracksCanvas } from './TracksCanvas';
import { MasterCanvas } from './MasterCanvas';
import { SongInfo } from './SongInfo';
import { TracksMixer, MasterMixer } from '../mixer/MixerPanel';
import { OFFSET_Y, type CellPos } from './types';

/**
 * SessionGrid - Main session view container.
 * Manages the tracks and master grids with synchronized scrolling.
 */
export function SessionGrid() {
  const song = useAppStore((state) => state.song);

  console.log('SessionGrid render:', { tracksCount: song.tracks.length, songLength: song.length });

  const tracksWrapperRef = useRef<HTMLDivElement>(null);
  const masterWrapperRef = useRef<HTMLDivElement>(null);
  const [mixerScrollLeft, setMixerScrollLeft] = useState(0);
  const [selectedPos, setSelectedPos] = useState<CellPos | null>({ x: 0, y: 0, type: 'master' });

  // Handle mixer gain changes - sync to audio engine
  const handleGainsChange = useCallback((trackGains: number[], masterGain: number) => {
    controller.setMixerGains?.(trackGains, masterGain);
  }, []);

  // Handle mixer pan changes - sync to audio engine
  const handlePansChange = useCallback((trackPans: number[], masterPan: number) => {
    controller.setMixerPans?.(trackPans, masterPan);
  }, []);

  // Handle master gain changes
  const handleMasterGainChange = useCallback((masterGain: number) => {
    const trackGains = controller.getTrackGains?.() || [];
    controller.setMixerGains?.(trackGains, masterGain);
  }, []);

  const handleMasterScroll = useCallback((scrollTop: number) => {
    if (tracksWrapperRef.current) {
      tracksWrapperRef.current.scrollTop = scrollTop;
    }
  }, []);

  // Handle mixer-tracks scroll for horizontal positioning
  const handleMixerScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setMixerScrollLeft((e.target as HTMLDivElement).scrollLeft);
  }, []);

  // Handle cell selection
  const handleCellSelect = useCallback((pos: CellPos) => {
    setSelectedPos(pos);
    controller.showSidebar({ x: pos.x, y: pos.y, type: pos.type || 'tracks' });
  }, []);

  // Handle song info changes
  const handleTitleChange = useCallback(() => {
    // Update song title - would need to add action to store
  }, []);

  const handleCreatorChange = useCallback(() => {
    // Update song creator - would need to add action to store
  }, []);

  return (
    <>
      <div id="mixer-tracks" onScroll={handleMixerScroll}>
        <TracksCanvas
          song={song}
          wrapperRef={tracksWrapperRef}
          mixerScrollLeft={mixerScrollLeft}
          offsetTranslate={OFFSET_Y}
          onCellSelect={handleCellSelect}
          selectedPos={selectedPos}
        />
        <div id="effects-tracks" className="clearfix" />
        <TracksMixer
          onGainsChange={handleGainsChange}
          onPansChange={handlePansChange}
        />
      </div>

      <div id="mixer-master">
        <MasterCanvas
          song={song}
          wrapperRef={masterWrapperRef}
          offsetTranslate={OFFSET_Y}
          onCellSelect={handleCellSelect}
          selectedPos={selectedPos}
          onSyncScroll={handleMasterScroll}
        />
        <MasterMixer
          onGainChange={handleMasterGainChange}
        />
      </div>

      <SongInfo
        song={song}
        onTitleChange={handleTitleChange}
        onCreatorChange={handleCreatorChange}
      />
    </>
  );
}
