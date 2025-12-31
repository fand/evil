import { createRoot, type Root } from 'react-dom/client';
import { App } from '../components/App';

let root: Root | null = null;

/**
 * Mount the React application.
 * Currently mounts an empty App - will be populated as views are migrated.
 *
 * Strategy: React components will be mounted into existing DOM elements
 * as jQuery views are replaced (e.g., #control for PlayerControls).
 */
export function mountReactApp() {
  // For now, create a temporary container for the App
  // This will be replaced with actual component mounts during Phase 2+
  const container = document.createElement('div');
  container.id = 'react-root';
  container.style.display = 'none'; // Hidden until we have real components
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(<App />);
}

/**
 * Unmount the React application (for cleanup/testing).
 */
export function unmountReactApp() {
  if (root) {
    root.unmount();
    root = null;
  }
  const container = document.getElementById('react-root');
  if (container) {
    container.remove();
  }
}
