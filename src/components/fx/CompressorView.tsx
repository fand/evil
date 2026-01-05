import { useState, useCallback, useEffect } from 'react';
import type { Compressor, CompressorParams } from '../../FX/Compressor';

interface CompressorViewProps {
  model: Compressor;
  onRemove: () => void;
}

export function CompressorView({ model, onRemove }: CompressorViewProps) {
  const [params, setParams] = useState<CompressorParams>(() => ({
    input: model.in.gain.value,
    output: model.out.gain.value,
    attack: model.comp.attack.value,
    release: model.comp.release.value,
    threshold: model.comp.threshold.value,
    ratio: model.comp.ratio.value,
    knee: model.comp.knee.value,
  }));

  useEffect(() => {
    setParams({
      input: model.in.gain.value,
      output: model.out.gain.value,
      attack: model.comp.attack.value,
      release: model.comp.release.value,
      threshold: model.comp.threshold.value,
      ratio: model.comp.ratio.value,
      knee: model.comp.knee.value,
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

  const handleAttackChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 1000.0;
      model.setParam({ attack: value });
      setParams((p) => ({ ...p, attack: value }));
    },
    [model]
  );

  const handleReleaseChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 1000.0;
      model.setParam({ release: value });
      setParams((p) => ({ ...p, release: value }));
    },
    [model]
  );

  const handleThresholdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / -10.0;
      model.setParam({ threshold: value });
      setParams((p) => ({ ...p, threshold: value }));
    },
    [model]
  );

  const handleRatioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      model.setParam({ ratio: value });
      setParams((p) => ({ ...p, ratio: value }));
    },
    [model]
  );

  const handleKneeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) / 1000.0;
      model.setParam({ knee: value });
      setParams((p) => ({ ...p, knee: value }));
    },
    [model]
  );

  return (
    <fieldset className="sidebar-effect sidebar-module">
      <legend>Comp</legend>
      <i className="fa fa-minus sidebar-effect-minus" onClick={onRemove} />

      <div className="clearfix">
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

      <div className="clearfix">
        <label>attack</label>
        <input
          name="attack"
          type="range"
          min="0"
          max="1000"
          value={params.attack * 1000}
          onChange={handleAttackChange}
        />
      </div>

      <div className="clearfix">
        <label>release</label>
        <input
          name="release"
          type="range"
          min="1"
          max="1000"
          value={params.release * 1000}
          onChange={handleReleaseChange}
        />
      </div>

      <div className="clearfix">
        <label>threshold</label>
        <input
          name="threshold"
          type="range"
          min="0"
          max="1000"
          value={params.threshold * -10}
          onChange={handleThresholdChange}
        />
      </div>

      <div className="clearfix">
        <label>ratio</label>
        <input
          name="ratio"
          type="range"
          min="1"
          max="20"
          value={params.ratio}
          onChange={handleRatioChange}
        />
      </div>

      <div className="clearfix">
        <label>knee</label>
        <input
          name="knee"
          type="range"
          min="0"
          max="40000"
          value={params.knee * 1000}
          onChange={handleKneeChange}
        />
      </div>

      <div className="clearfix">
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
