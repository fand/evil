import { createPortal } from 'react-dom';
import { TransportButtons } from './TransportButtons';
import { SceneParams } from './SceneParams';
import { NavigationButtons } from './NavigationButtons';
import { useResizeHandler } from './useResizeHandler';

export { TransportButtons } from './TransportButtons';
export { SceneParams } from './SceneParams';
export { NavigationButtons } from './NavigationButtons';

/**
 * PlayerControls using React Portals to render into existing DOM locations.
 * This allows gradual migration while maintaining the existing HTML structure.
 */
export function PlayerControls() {
  // Handle window resize for button positioning
  useResizeHandler();

  // Get portal containers
  const controlContainer = document.getElementById('control');
  const footerContainer = document.querySelector('footer');

  // If containers don't exist yet, render nothing
  if (!controlContainer || !footerContainer) {
    return null;
  }

  return (
    <>
      {/* SceneParams replaces the contents of #control */}
      {createPortal(<SceneParamsContent />, controlContainer)}

      {/* TransportButtons are rendered after #control in footer */}
      {createPortal(<TransportButtons />, footerContainer)}

      {/* NavigationButtons are rendered at body level */}
      {createPortal(<NavigationButtons />, document.body)}
    </>
  );
}

/**
 * Just the content of SceneParams (without the wrapper div)
 * since we're portaling into #control which is the wrapper
 */
function SceneParamsContent() {
  return <SceneParams />;
}
