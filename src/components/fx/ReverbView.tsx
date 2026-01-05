import { useState, useCallback, useEffect } from 'react';
import type { Reverb, ReverbParams } from '../../FX/Reverb';
import { sidebarStyles as styles } from '../sidebar/Sidebar';

const IR_OPTIONS = [
  'BIG_SNARE',
  'Sweep_Reverb',
  'Reverb_Factory',
  'Dense_Room',
  '8_SEC_REVERB',
  'GUITAR_ROOM',
  'HUNTER_DELAY',
  'JERRY_RACE_CAR',
  'ResoVibroEee',
  'ROOM_OF_DOOM',
  'RHYTHM_&_REVERB',
  'BIG_SWEEP_207',
  'BRIGHT_ROOM_209',
  'CANYON_211',
  'DARK_ROOM_213',
  'DISCRETE-VERB_215',
  "EXPLODING_'VERB",
  'GATED_REVERB_223',
  'LOCKER_ROOM',
  'RANDOM_GATE_240',
  'REVERSE_GATE_241',
  'RICH_PLATE_243',
  'SHIMMERISH_246',
];

interface ReverbViewProps {
  model: Reverb;
  onRemove: () => void;
}

export function ReverbView({ model, onRemove }: ReverbViewProps) {
  const [params, setParams] = useState<ReverbParams>(() => ({
    name: model.name,
    wet: model.wet.gain.value,
  }));

  useEffect(() => {
    setParams({
      name: model.name,
      wet: model.wet.gain.value,
    });
  }, [model]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      model.setIR(value);
      setParams((p) => ({ ...p, name: value }));
    },
    [model]
  );

  const handleWetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 100.0;
      model.setParam({ wet: value });
      setParams((p) => ({ ...p, wet: value }));
    },
    [model]
  );

  return (
    <fieldset className={styles.module}>
      <legend>Reverb</legend>
      <i className={`fa fa-minus ${styles.effectMinus}`} onClick={onRemove} />

      <div className={styles.clearfix}>
        <label>type</label>
        <select name="name" value={params.name} onChange={handleNameChange}>
          {IR_OPTIONS.map((ir) => (
            <option key={ir}>{ir}</option>
          ))}
        </select>
      </div>

      <div className={styles.clearfix}>
        <label>wet</label>
        <input
          name="wet"
          type="range"
          min="0"
          max="100"
          value={params.wet * 100}
          onChange={handleWetChange}
        />
      </div>
    </fieldset>
  );
}
