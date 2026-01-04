/**
 * Root React component.
 * Unified layout containing all UI components.
 */
import { useEffect, useRef } from 'react';
import { SceneParams } from './player/SceneParams';
import { TransportButtons } from './player/TransportButtons';
import { NavigationButtons } from './player/NavigationButtons';
import { useResizeHandler } from './player/useResizeHandler';
import { SessionGrid } from './session';
import { InstrumentsContainer } from './instruments';
import { SaveDialog } from './session/SaveDialog';
import { SidebarContainer } from './sidebar/SidebarContainer';

export function App() {
  useResizeHandler();
  const footerRef = useRef<HTMLElement>(null);

  // Set footer height based on window size
  useEffect(() => {
    if (footerRef.current) {
      const footerSize = window.innerHeight / 2 - 300;
      footerRef.current.style.height = footerSize + 'px';
    }
  }, []);

  return (
    <>
      {/* Main wrapper */}
      <div id="wrapper">
        <div id="env"></div>

        {/* Instruments */}
        <div id="instruments" className="clearfix">
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
      <footer ref={footerRef}>
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
