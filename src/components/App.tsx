/**
 * Root React component.
 * Unified layout containing all UI components.
 */
import { useEffect, useRef } from 'react';
import { SceneParams } from './player/SceneParams';
import { TransportButtons } from './player/TransportButtons';
import { NavigationButtons } from './player/NavigationButtons';
import { SessionGrid } from './session';
import { InstrumentsContainer } from './instruments';
import { SaveDialog } from './session/SaveDialog';
import { SidebarContainer } from './sidebar/SidebarContainer';
import { useAppStore } from '../hooks/useStore';

export function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instrumentsRef = useRef<HTMLDivElement>(null);

  // Subscribe to store state for view transitions
  const viewMode = useAppStore((s) => s.ui.viewMode);
  const currentInstrument = useAppStore((s) => s.ui.currentInstrument);

  // Sync wrapper transform with viewMode
  useEffect(() => {
    if (wrapperRef.current) {
      const y = viewMode === 'MIXER' ? 700 : 0;
      wrapperRef.current.style.transform = `translate3d(0px, ${y}px, 0px)`;
    }
  }, [viewMode]);

  // Sync instruments transform with currentInstrument
  useEffect(() => {
    if (instrumentsRef.current) {
      instrumentsRef.current.style.transform = `translate3d(${-1110 * currentInstrument}px, 0px, 0px)`;
    }
  }, [currentInstrument]);

  return (
    <>
      {/* Main wrapper */}
      <div id="wrapper" ref={wrapperRef}>
        <div id="env"></div>

        {/* Instruments */}
        <div id="instruments" className="clearfix" ref={instrumentsRef}>
          <InstrumentsContainer />
        </div>

        {/* Mixer */}
        <div id="mixer">
          <div id="mixer-body">
            <SessionGrid />
          </div>

          <div id="mixer-sidebar">
            <SidebarContainer />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div id="control">
          <SceneParams />
        </div>
        <TransportButtons />
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

      {/* Navigation buttons */}
      <NavigationButtons />

      {/* Dialogs */}
      <SaveDialog />
    </>
  );
}
