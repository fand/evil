import { useState, useCallback, useEffect } from 'react';
import type { Double, DoubleParams } from '../../FX/Double';
import { sidebarStyles as styles } from '../sidebar/Sidebar';

interface DoubleViewProps {
  model: Double;
  onRemove: () => void;
}

export function DoubleView({ model, onRemove }: DoubleViewProps) {
  const [params, setParams] = useState<DoubleParams>(() => ({
    delay: model.delay.delayTime.value,
    width: model.pos,
  }));

  useEffect(() => {
    setParams({
      delay: model.delay.delayTime.value,
      width: model.pos,
    });
  }, [model]);

  const handleDelayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 1000.0;
      model.setParam({ delay: value });
      setParams((p) => ({ ...p, delay: value }));
    },
    [model]
  );

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 200.0 + 0.5;
      model.setParam({ width: value });
      setParams((p) => ({ ...p, width: value }));
    },
    [model]
  );

  return (
    <fieldset className={styles.module}>
      <legend>Double</legend>
      <i className={`fa fa-minus ${styles.effectMinus}`} onClick={onRemove} />

      <div className={styles.clearfix}>
        <label>delay</label>
        <input
          name="delay"
          type="range"
          min="10"
          max="100"
          value={params.delay * 1000}
          onChange={handleDelayChange}
        />
      </div>

      <div className={styles.clearfix}>
        <label>width</label>
        <input
          name="width"
          type="range"
          min="0"
          max="100"
          value={(params.width - 0.5) * 200}
          onChange={handleWidthChange}
        />
      </div>
    </fieldset>
  );
}
