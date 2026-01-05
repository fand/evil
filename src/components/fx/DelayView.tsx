import { useState, useCallback, useEffect } from 'react';
import type { Delay, DelayParams } from '../../FX/Delay';

interface DelayViewProps {
  model: Delay;
  onRemove: () => void;
}

export function DelayView({ model, onRemove }: DelayViewProps) {
  const [params, setParams] = useState<DelayParams>(() => ({
    delay: model.delay.delayTime.value,
    feedback: model.feedback.gain.value,
    lofi: model.lofi.Q.value,
    wet: model.wet.gain.value,
  }));

  useEffect(() => {
    setParams({
      delay: model.delay.delayTime.value,
      feedback: model.feedback.gain.value,
      lofi: model.lofi.Q.value,
      wet: model.wet.gain.value,
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

  const handleFeedbackChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 100.0;
      model.setParam({ feedback: value });
      setParams((p) => ({ ...p, feedback: value }));
    },
    [model]
  );

  const handleLofiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = (parseFloat(e.target.value) * 5.0) / 100.0;
      model.setParam({ lofi: value });
      setParams((p) => ({ ...p, lofi: value }));
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
    <fieldset className="sidebar-effect sidebar-module">
      <legend>Delay</legend>
      <i className="fa fa-minus sidebar-effect-minus" onClick={onRemove} />

      <div className="clearfix">
        <label>delay</label>
        <input
          name="delay"
          type="range"
          min="50"
          max="1000"
          value={params.delay * 1000}
          onChange={handleDelayChange}
        />
      </div>

      <div className="clearfix">
        <label>feedback</label>
        <input
          name="feedback"
          type="range"
          min="0"
          max="100"
          value={params.feedback * 100}
          onChange={handleFeedbackChange}
        />
      </div>

      <div className="clearfix">
        <label>lofi</label>
        <input
          name="lofi"
          type="range"
          min="0"
          max="100"
          value={params.lofi * 20}
          onChange={handleLofiChange}
        />
      </div>

      <div className="clearfix">
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
