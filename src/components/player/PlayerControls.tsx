import { useEffect } from 'react';
import { TransportButtons } from './TransportButtons';
import { SceneParams } from './SceneParams';
import { NavigationButtons } from './NavigationButtons';

/**
 * Main player controls container.
 * Replaces the jQuery PlayerView class.
 */
export function PlayerControls() {
  // Handle window resize for button positioning
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const spaceW = (w - 910) / 2;
      const spaceH = (h - 600) / 2;

      const btnLeft = document.getElementById('btn-left');
      const btnRight = document.getElementById('btn-right');
      const btnTop = document.getElementById('btn-top');
      const btnBottom = document.getElementById('btn-bottom');
      const footer = document.querySelector('footer') as HTMLElement | null;

      if (btnLeft) {
        btnLeft.style.width = `${spaceW}px`;
        btnLeft.style.padding = `250px 25px`;
      }
      if (btnRight) {
        btnRight.style.width = `${spaceW}px`;
        btnRight.style.padding = `250px 35px`;
      }
      if (btnTop) {
        btnTop.style.height = `${spaceH}px`;
      }
      if (btnBottom) {
        btnBottom.style.bottom = `${spaceH}px`;
        btnBottom.style.height = '100px';
      }
      if (footer) {
        footer.style.height = `${spaceH}px`;
      }
    };

    // Initial resize
    resize();

    // Listen for window resize
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
      <SceneParams />
      <TransportButtons />
      <NavigationButtons />
    </>
  );
}
