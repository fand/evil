import { useState, useCallback, useEffect } from 'react';
import type { Fuzz, FuzzParams } from '../../FX/Fuzz';
import { sidebarStyles as styles } from '../sidebar/Sidebar';

interface FuzzViewProps {
  model: Fuzz;
  onRemove: () => void;
}

export function FuzzView({ model, onRemove }: FuzzViewProps) {
  const [params, setParams] = useState<FuzzParams>(() => ({
    type: model.type as FuzzParams['type'],
    gain: model.gain,
    input: model.in.gain.value,
    output: model.out.gain.value,
  }));

  useEffect(() => {
    setParams({
      type: model.type as FuzzParams['type'],
      gain: model.gain,
      input: model.in.gain.value,
      output: model.out.gain.value,
    });
  }, [model]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 100.0;
      model.setParam({ input: value });
      setParams((p) => ({ ...p, input: value }));
    },
    [model]
  );

  const handleOutputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 100.0;
      model.setParam({ output: value });
      setParams((p) => ({ ...p, output: value }));
    },
    [model]
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as FuzzParams['type'];
      model.setParam({ type: value });
      setParams((p) => ({ ...p, type: value }));
    },
    [model]
  );

  const handleGainChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 100.0;
      model.setParam({ gain: value });
      setParams((p) => ({ ...p, gain: value }));
    },
    [model]
  );

  return (
    <fieldset className={styles.module}>
      <legend>Fuzz</legend>
      <i className={`fa fa-minus ${styles.effectMinus}`} onClick={onRemove} />

      <div className={styles.clearfix}>
        <label>input</label>
        <input
          name="input"
          type="range"
          min="0"
          max="100"
          value={params.input * 100}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.clearfix}>
        <label>type</label>
        <select name="type" value={params.type} onChange={handleTypeChange}>
          <option>Sigmoid</option>
          <option>Octavia</option>
        </select>
      </div>

      <div className={styles.clearfix}>
        <label>gain</label>
        <input
          name="gain"
          type="range"
          min="8"
          max="99"
          value={params.gain * 100}
          onChange={handleGainChange}
        />
      </div>

      <div className={styles.clearfix}>
        <label>output</label>
        <input
          name="output"
          type="range"
          min="0"
          max="100"
          value={params.output * 100}
          onChange={handleOutputChange}
        />
      </div>
    </fieldset>
  );
}
