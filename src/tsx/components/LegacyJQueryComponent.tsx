import React, { useEffect, useRef } from 'react';

interface LegacyJQueryComponentProps {
  ViewClass: any;
  model: any;
  className?: string;
}

/**
 * Temporary wrapper component to mount jQuery-based views inside React.
 * This allows gradual migration from jQuery to React components.
 */
export function LegacyJQueryComponent({
  ViewClass,
  model,
  className,
}: LegacyJQueryComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mount jQuery view
    viewInstanceRef.current = new ViewClass(model, containerRef.current);

    return () => {
      // Cleanup - call destroy method if available
      if (viewInstanceRef.current?.destroy) {
        viewInstanceRef.current.destroy();
      }
      // Clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [ViewClass, model]);

  return <div ref={containerRef} className={className} />;
}
