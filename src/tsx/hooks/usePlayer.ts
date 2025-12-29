import { useAppStore } from '../store';

/**
 * Custom hook to access the player instance from the store
 */
export function usePlayer() {
  return useAppStore((state) => state.player);
}
