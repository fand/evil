import { useCallback } from 'react';
import { useAppStore, useShallow } from '../../hooks/useStore';
import { controller } from '../../controller';
import { type NoteKey } from '../../Constant';

// Key names in display order
const KEY_NAMES: NoteKey[] = ['A', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E'];

// Scale names
const SCALE_NAMES = [
  'Major',
  'minor',
  'Pentatonic',
  'Harm-minor',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'CHROMATIC',
] as const;

/**
 * Scene parameter controls: BPM, Key, Scale
 */
export function SceneParams() {
  const { bpm, key, scale } = useAppStore(
    useShallow((state) => ({
      bpm: state.scene.bpm,
      key: state.scene.key,
      scale: state.scene.scale,
    }))
  );

  const handleBpmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    controller.setBPM(parseInt(e.target.value, 10));
  }, []);

  const handleKeyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    controller.setKey(e.target.value);
  }, []);

  const handleScaleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    controller.setScale(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    window.keyboard?.beginInput();
  }, []);

  const handleBlur = useCallback(() => {
    window.keyboard?.endInput();
  }, []);

  return (
    <>
      key:{' '}
      <select
        name="key"
        value={key}
        onChange={handleKeyChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {KEY_NAMES.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      scale:{' '}
      <select
        name="mode"
        value={scale}
        onChange={handleScaleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {SCALE_NAMES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      bpm:{' '}
      <input
        name="bpm"
        type="number"
        min={60}
        max={1000}
        value={bpm}
        onChange={handleBpmChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </>
  );
}
