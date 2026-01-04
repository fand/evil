import { useState, useEffect, useCallback, useRef } from 'react';
import { controller } from '../../controller';
import { useAppStore } from '../../hooks/useStore';
import { store } from '../../store';

/**
 * Navigation buttons for instrument/mixer switching.
 * These buttons control the CSS transforms for sliding between views.
 */
export function NavigationButtons() {
  const [instrumentsCount, setInstrumentsCount] = useState(1);

  // Subscribe to store state
  const currentInstrument = useAppStore((s) => s.ui.currentInstrument);
  const viewMode = useAppStore((s) => s.ui.viewMode);
  const isMixer = viewMode === 'MIXER';

  // DOM refs for direct manipulation (matching jQuery behavior)
  const instrumentsRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLElement | null>(null);

  // Initialize DOM refs
  useEffect(() => {
    instrumentsRef.current = document.getElementById('instruments');
    wrapperRef.current = document.getElementById('wrapper');
  }, []);

  const moveRight = useCallback(() => {
    if (isMixer) return;

    const newIdx = currentInstrument + 1;
    controller.moveRight(newIdx);
    setInstrumentsCount(controller.instrumentsCount);

    if (instrumentsRef.current) {
      instrumentsRef.current.style.webkitTransform = `translate3d(${-1110 * newIdx}px, 0px, 0px)`;
    }
  }, [isMixer, currentInstrument]);

  const moveLeft = useCallback(() => {
    if (isMixer) return;

    setInstrumentsCount(controller.instrumentsCount);

    if (currentInstrument !== 0) {
      const newIdx = currentInstrument - 1;

      if (instrumentsRef.current) {
        instrumentsRef.current.style.webkitTransform = `translate3d(${-1110 * newIdx}px, 0px, 0px)`;
      }
      controller.moveLeft(newIdx);
    }
  }, [isMixer, currentInstrument]);

  const moveTop = useCallback(() => {
    store.getState().setViewMode('MIXER');
    if (wrapperRef.current) {
      wrapperRef.current.style.webkitTransform = 'translate3d(0px, 700px, 0px)';
    }
  }, []);

  const moveBottom = useCallback(() => {
    store.getState().setViewMode('SYNTH');
    if (wrapperRef.current) {
      wrapperRef.current.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
    }
  }, []);

  // Determine button visibility and labels
  const showLeftBtn = !isMixer && currentInstrument > 0;
  const showRightBtn = !isMixer;
  const showTopBtn = !isMixer;
  const showBottomBtn = isMixer;
  const rightLabel = currentInstrument >= instrumentsCount - 1 ? 'new' : 'next';

  return (
    <>
      <i
        id="btn-left"
        className="btn fa fa-angle-left"
        data-line1="prev"
        data-line2="synth"
        style={{ display: showLeftBtn ? undefined : 'none' }}
        onMouseDown={moveLeft}
      />
      <i
        id="btn-right"
        className="btn fa fa-angle-right"
        data-line1={rightLabel}
        data-line2="synth"
        style={{ display: showRightBtn ? undefined : 'none' }}
        onMouseDown={moveRight}
      />
      <i
        id="btn-top"
        className="btn fa fa-angle-up"
        data-line1="mixer"
        style={{ display: showTopBtn ? undefined : 'none' }}
        onMouseDown={moveTop}
      />
      <i
        id="btn-bottom"
        className="btn fa fa-angle-down"
        data-line1="synths"
        style={{ display: showBottomBtn ? undefined : 'none' }}
        onMouseDown={moveBottom}
      />
    </>
  );
}
