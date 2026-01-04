import { useCallback, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import type { FX } from '../../FX/FX';

type SidebarMode = 'master' | 'tracks';

interface SidebarState {
  mode: SidebarMode;
  trackIndex: number;
  trackName: string;
}

export function SidebarContainer() {
  const [state, setState] = useState<SidebarState>({
    mode: 'master',
    trackIndex: -1,
    trackName: '',
  });

  // Subscribe to effects version to trigger re-render when effects change
  const effectsVersion = useAppStore((s) => s.effects.version);

  // Get current instrument index from store
  const currentInstrument = useAppStore((s) => s.ui.currentInstrument);

  // Subscribe to sidebar mode changes (could be triggered externally)
  useEffect(() => {
    // When current instrument changes, update sidebar state
    if (currentInstrument >= 0) {
      const instrument = controller.getInstrument(currentInstrument);
      if (instrument) {
        setState({
          mode: 'tracks',
          trackIndex: currentInstrument,
          trackName: instrument.name || `Synth #${currentInstrument}`,
        });
      }
    }
  }, [currentInstrument]);

  // Get effects from controller (will re-read when version changes)
  const masterEffects = controller.getMasterEffects();
  const trackEffects =
    state.mode === 'tracks' && state.trackIndex >= 0
      ? controller.getTrackEffects(state.trackIndex)
      : [];

  const handleTrackNameChange = useCallback(
    (name: string) => {
      if (state.trackIndex >= 0) {
        controller.setSynthName(state.trackIndex, name);
        setState((s) => ({ ...s, trackName: name }));
      }
    },
    [state.trackIndex]
  );

  const handleAddMasterEffect = useCallback((name: string) => {
    controller.addMasterEffect(name);
  }, []);

  const handleAddTracksEffect = useCallback(
    (name: string) => {
      if (state.trackIndex >= 0) {
        controller.addTrackEffect(state.trackIndex, name);
      }
    },
    [state.trackIndex]
  );

  const handleRemoveMasterEffect = useCallback((fx: FX) => {
    controller.removeMasterEffect(fx);
  }, []);

  const handleRemoveTrackEffect = useCallback((fx: FX) => {
    controller.removeTrackEffect(fx);
  }, []);

  // Force re-render when effects version changes
  void effectsVersion;

  return (
    <Sidebar
      mode={state.mode}
      trackIndex={state.trackIndex}
      trackName={state.trackName}
      onTrackNameChange={handleTrackNameChange}
      onAddMasterEffect={handleAddMasterEffect}
      onAddTracksEffect={handleAddTracksEffect}
      masterEffects={masterEffects}
      trackEffects={trackEffects}
      onRemoveMasterEffect={handleRemoveMasterEffect}
      onRemoveTrackEffect={handleRemoveTrackEffect}
    />
  );
}
