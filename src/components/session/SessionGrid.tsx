import { useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import { TracksCanvas } from './TracksCanvas';
import { MasterCanvas } from './MasterCanvas';
import { SongInfo } from './SongInfo';
import { OFFSET_Y, type CellPos } from './types';

/**
 * SessionGrid - Main session view container.
 * Manages the tracks and master grids with synchronized scrolling.
 */
export function SessionGrid() {
  const song = useAppStore((state) => state.song);

  const tracksWrapperRef = useRef<HTMLDivElement>(null);
  const masterWrapperRef = useRef<HTMLDivElement>(null);
  const [mixerScrollLeft, setMixerScrollLeft] = useState(0);
  const [selectedPos, setSelectedPos] = useState<CellPos | null>({ x: 0, y: 0, type: 'master' });

  // Sync scroll between tracks and master
  const handleTracksScroll = useCallback(() => {
    if (tracksWrapperRef.current && masterWrapperRef.current) {
      masterWrapperRef.current.scrollTop = tracksWrapperRef.current.scrollTop;
    }
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
  const handleTitleChange = useCallback((title: string) => {
    // Update song title - would need to add action to store
    // For now, this is a placeholder
  }, []);

  const handleCreatorChange = useCallback((creator: string) => {
    // Update song creator - would need to add action to store
    // For now, this is a placeholder
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
        <div id="console-tracks" className="clearfix" />
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
        <div id="console-master" className="clearfix">
          <div className="console-track">
            <div>MASTER</div>
            <input className="gain-slider" type="range" min="0" max="100" defaultValue="100" />
            <canvas className="vu-meter" />
          </div>
        </div>
      </div>

      <SongInfo
        song={song}
        onTitleChange={handleTitleChange}
        onCreatorChange={handleCreatorChange}
      />
    </>
  );
}
