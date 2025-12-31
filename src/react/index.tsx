import { createRoot, type Root } from 'react-dom/client';
import { SceneParams } from '../components/player/SceneParams';
import { TransportButtons } from '../components/player/TransportButtons';
import { NavigationButtons } from '../components/player/NavigationButtons';
import { useResizeHandler } from '../components/player/useResizeHandler';
import { SessionGrid } from '../components/session';

// Store roots for cleanup
const roots: Root[] = [];

/**
 * Wrapper component that includes resize handler
 */
function NavigationButtonsWithResize() {
  useResizeHandler();
  return <NavigationButtons />;
}

/**
 * Mount the React application.
 * Mounts React components into specific DOM locations,
 * replacing the jQuery PlayerView functionality.
 */
export function mountReactApp() {
  // Mount SceneParams into #control
  const controlContainer = document.getElementById('control');
  if (controlContainer) {
    // Clear existing content
    controlContainer.innerHTML = '';
    const root = createRoot(controlContainer);
    root.render(<SceneParams />);
    roots.push(root);
  }

  // Create container for TransportButtons in footer
  const footer = document.querySelector('footer');
  if (footer) {
    // Remove existing transport buttons from HTML
    const existingButtons = footer.querySelectorAll(
      '#control-play, #control-forward, #control-backward, #control-loop'
    );
    existingButtons.forEach((btn) => btn.remove());

    // Create container for React transport buttons
    const transportContainer = document.createElement('div');
    transportContainer.id = 'react-transport';
    transportContainer.style.display = 'contents'; // Don't affect layout
    footer.appendChild(transportContainer);

    const root = createRoot(transportContainer);
    root.render(<TransportButtons />);
    roots.push(root);
  }

  // Create container for NavigationButtons at body level
  // Remove existing navigation buttons from HTML
  const existingNavButtons = document.querySelectorAll(
    '#btn-left, #btn-right, #btn-top, #btn-bottom'
  );
  existingNavButtons.forEach((btn) => btn.remove());

  const navContainer = document.createElement('div');
  navContainer.id = 'react-navigation';
  navContainer.style.display = 'contents'; // Don't affect layout
  document.body.appendChild(navContainer);

  const navRoot = createRoot(navContainer);
  navRoot.render(<NavigationButtonsWithResize />);
  roots.push(navRoot);

  // Mount SessionGrid into #mixer-body (replaces SessionView)
  const mixerBody = document.getElementById('mixer-body');
  if (mixerBody) {
    // Remove original session elements - React will recreate them
    const mixerTracks = document.getElementById('mixer-tracks');
    const mixerMaster = document.getElementById('mixer-master');
    if (mixerTracks) mixerTracks.remove();
    if (mixerMaster) mixerMaster.remove();

    // Create container with display:contents so it doesn't affect layout
    const sessionContainer = document.createElement('div');
    sessionContainer.id = 'react-session';
    sessionContainer.style.cssText = 'display: contents;';
    mixerBody.appendChild(sessionContainer);

    const sessionRoot = createRoot(sessionContainer);
    sessionRoot.render(<SessionGrid />);
    roots.push(sessionRoot);
  }
}

/**
 * Unmount all React roots (for cleanup/testing).
 */
export function unmountReactApp() {
  roots.forEach((root) => root.unmount());
  roots.length = 0;

  // Remove containers
  document.getElementById('react-transport')?.remove();
  document.getElementById('react-navigation')?.remove();
}
