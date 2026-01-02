import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { store, type Store } from '../store';

/**
 * React hook for subscribing to the app store.
 * Uses the existing vanilla Zustand store.
 *
 * @example
 * // Single value
 * const isPlaying = useAppStore((state) => state.playback.isPlaying)
 *
 * // Multiple values with shallow comparison
 * const { bpm, key, scale } = useAppStore(
 *   useShallow((state) => ({
 *     bpm: state.scene.bpm,
 *     key: state.scene.key,
 *     scale: state.scene.scale,
 *   }))
 * )
 */
export function useAppStore<T>(selector: (state: Store) => T): T {
  return useStore(store, selector);
}

export { useShallow };
