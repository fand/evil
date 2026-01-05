import { useState, useCallback } from 'react';
import { controller } from '../../controller';
import { useAppStore } from '../../hooks/useStore';
import { store } from '../../store';

/**
 * Navigation buttons for instrument/mixer switching.
 * View transitions are handled by App.tsx via store subscription.
 */
export function NavigationButtons() {
  const [instrumentsCount, setInstrumentsCount] = useState(1);

  // Subscribe to store state
  const currentInstrument = useAppStore((s) => s.ui.currentInstrument);
  const viewMode = useAppStore((s) => s.ui.viewMode);
  const isMixer = viewMode === 'MIXER';

  const moveRight = useCallback(() => {
    if (isMixer) return;
    const newIdx = currentInstrument + 1;
    controller.moveRight(newIdx);
    setInstrumentsCount(controller.instrumentsCount);
  }, [isMixer, currentInstrument]);

  const moveLeft = useCallback(() => {
    if (isMixer) return;
    setInstrumentsCount(controller.instrumentsCount);
    if (currentInstrument !== 0) {
      controller.moveLeft(currentInstrument - 1);
    }
  }, [isMixer, currentInstrument]);

  const moveTop = useCallback(() => {
    store.getState().setViewMode('MIXER');
  }, []);

  const moveBottom = useCallback(() => {
    store.getState().setViewMode('SYNTH');
  }, []);

  // Determine button visibility and labels
  const showLeftBtn = !isMixer && currentInstrument > 0;
  const showRightBtn = !isMixer;
  const showTopBtn = !isMixer;
  const showBottomBtn = isMixer;
  const rightLabel = currentInstrument >= instrumentsCount - 1 ? 'new' : 'next';

  console.log({
    showLeftBtn,
    showBottomBtn,
  });

  return (
    <>
      <i
        id="btn-left"
        className="btn fa fa-angle-left"
        data-line1="prev"
        data-line2="synth"
        style={{ display: showLeftBtn ? undefined : 'none' }}
        onClick={moveLeft}
      />
      <i
        id="btn-right"
        className="btn fa fa-angle-right"
        data-line1={rightLabel}
        data-line2="synth"
        style={{ display: showRightBtn ? undefined : 'none' }}
        onClick={moveRight}
      />
      <i
        id="btn-top"
        className="btn fa fa-angle-up"
        data-line1="mixer"
        style={{ display: showTopBtn ? undefined : 'none' }}
        onClick={moveTop}
      />
      <i
        id="btn-bottom"
        className="btn fa fa-angle-down"
        data-line1="synths"
        style={{ display: showBottomBtn ? undefined : 'none' }}
        onClick={moveBottom}
      />
    </>
  );
}
