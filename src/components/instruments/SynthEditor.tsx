import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import type { Synth } from '../../Synth';
import { SequencerCanvas } from './SequencerCanvas';

interface SynthEditorProps {
  model: Synth;
  id: number;
}

export function SynthEditor({ model, id }: SynthEditorProps) {
  // Canvas refs for ADSR
  const canvasEGRef = useRef<HTMLCanvasElement>(null);
  const canvasFEGRef = useRef<HTMLCanvasElement>(null);

  // Sequencer container ref
  const sequencerRef = useRef<HTMLDivElement>(null);
  const sequencerCanvasRef = useRef<SequencerCanvas | null>(null);

  // State
  const [isStep, setIsStep] = useState(false);
  const [isNoSync, setIsNoSync] = useState(false);
  const [isPanelOpened, setIsPanelOpened] = useState(true);

  // Store state
  const currentInstrument = useAppStore((state) => state.ui.currentInstrument);
  const playbackTime = useAppStore((state) => state.playback.time);
  const isActive = currentInstrument === id;

  // Core parameters state
  const [coreParams, setCoreParams] = useState(() => model.core.getParam());

  // Load core parameters when component mounts or becomes active
  useEffect(() => {
    if (isActive) {
      setCoreParams(model.core.getParam());
    }
  }, [isActive, model.core]);

  // Update core parameter
  const updateCoreParam = useCallback((param: Partial<typeof coreParams>) => {
    model.core.setParam(param);
    setCoreParams(model.core.getParam());
  }, [model.core]);

  // Mount SequencerCanvas on component mount
  useEffect(() => {
    if (!sequencerRef.current) return;

    const canvas = new SequencerCanvas(sequencerRef.current, model, id);
    sequencerCanvasRef.current = canvas;

    canvas.init().catch((err) => {
      console.error('Failed to initialize SequencerCanvas:', err);
    });

    return () => {
      canvas.destroy();
      sequencerCanvasRef.current = null;
    };
  }, [model, id]);

  // Update playback position
  useEffect(() => {
    if (sequencerCanvasRef.current) {
      sequencerCanvasRef.current.playAt(playbackTime);
    }
  }, [playbackTime]);

  // Update isStep when it changes
  useEffect(() => {
    if (sequencerCanvasRef.current) {
      sequencerCanvasRef.current.setIsStep(isStep);
    }
  }, [isStep]);

  // Update isNoSync when it changes
  useEffect(() => {
    if (sequencerCanvasRef.current) {
      sequencerCanvasRef.current.setNoSync(isNoSync);
    }
  }, [isNoSync]);

  // Draw ADSR canvas
  const drawADSRCanvas = useCallback((canvasRef: React.RefObject<HTMLCanvasElement | null>, adsr: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = 180);
    const h = (canvas.height = 50);
    const w4 = w / 4;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(w4 * (1.0 - adsr[0]), h);
    ctx.lineTo(w / 4, 0); // attack
    ctx.lineTo(w4 * (adsr[1] + 1), h * (1.0 - adsr[2])); // decay
    ctx.lineTo(w4 * 3, h * (1.0 - adsr[2])); // sustain
    ctx.lineTo(w4 * (adsr[3] + 3), h); // release
    ctx.strokeStyle = 'rgb(0, 220, 255)';
    ctx.stroke();
  }, []);

  // Update ADSR canvases when params change
  useEffect(() => {
    if (coreParams.eg?.adsr) {
      drawADSRCanvas(canvasEGRef, coreParams.eg.adsr);
    }
    if (coreParams.feg?.adsr) {
      drawADSRCanvas(canvasFEGRef, coreParams.feg.adsr);
    }
  }, [coreParams.eg?.adsr, coreParams.feg?.adsr, drawADSRCanvas]);

  // Control handlers
  const handleSynthNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controller.setSynthName(id, e.target.value);
  };

  const handlePatternNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controller.inputPatternName(id, e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controller.changeInstrumentType(id, e.target.value);
  };

  const handlePlusPattern = () => {
    controller.plusPattern(id);
  };

  const handleMinusPattern = () => {
    controller.minusPattern(id);
  };

  const toggleNoSync = () => {
    setIsNoSync(!isNoSync);
  };

  const togglePanelFold = () => {
    setIsPanelOpened(!isPanelOpened);
  };

  return (
    <div
      className={`instrument synth clearfix ${isActive ? 'active' : ''}`}
      id={`synth${id}`}
    >
      <div className="sequencer">
        <div className="header">
          <select className="synth-type" value={model.type} onChange={handleTypeChange}>
            <option value="REZ">REZ</option>
            <option value="SAMPLER">SAMPLER</option>
          </select>

          <div className="names clearfix">
            <input
              type="text"
              className="synth-name"
              value={model.name}
              onChange={handleSynthNameChange}
              onFocus={() => window.keyboard.beginInput()}
              onBlur={() => window.keyboard.endInput()}
            />
            <span>&gt;</span>
            <input
              type="text"
              className="pattern-name"
              value={model.pattern_name}
              onChange={handlePatternNameChange}
              onFocus={() => window.keyboard.beginInput()}
              onBlur={() => window.keyboard.endInput()}
            />
          </div>

          <div className="sequencer-mode clearfix">
            <span>input:</span>
            <i
              className={`fa fa-pencil sequencer-pencil ${!isStep ? 'btn-true' : 'btn-false'}`}
              onClick={() => setIsStep(false)}
            />
            <i
              className={`fa fa-ellipsis-h sequencer-step ${isStep ? 'btn-true' : 'btn-false'}`}
              onClick={() => setIsStep(true)}
            />
          </div>

          <div className="markers clearfix">
            <i className="fa fa-angle-left marker-prev" onClick={() => controller.backward(true)} />
            {[...Array(8)].map((_, i) => (
              <i
                key={i}
                className="fa fa-circle marker"
              />
            ))}
            <i className="fa fa-angle-right marker-next" onClick={() => controller.forward()} />

            <span className="marker-pos">1</span>
            <span className="marker-divide">/</span>
            <span className="marker-total">1</span>
          </div>

          <i
            className={`fa fa-thumb-tack pattern-nosync btn ${isNoSync ? 'btn-true' : 'btn-false'}`}
            onClick={toggleNoSync}
          />
          <i
            className="fa fa-minus pattern-minus btn btn-true"
            onClick={handleMinusPattern}
          />
          <i
            className="fa fa-plus pattern-plus btn btn-true"
            onClick={handlePlusPattern}
          />
        </div>

        <div ref={sequencerRef} className="sequencer-table">
          <canvas className="table table-off" />
          <canvas className="table table-on" />
          <canvas className="table table-hover" />
        </div>
      </div>

      <div className="synth-core" style={{ height: isPanelOpened ? '280px' : '0px' }}>
        <i
          className={`fa ${isPanelOpened ? 'fa-angle-down' : 'fa-angle-up'} btn-fold-core`}
          onClick={togglePanelFold}
        />

        <fieldset className="RS_module RS_vco0 RS_VCO">
          <legend>OSC1</legend>
          <div className="clearfix">
            <label>WAVE</label>
            <select
              className="shape"
              value={coreParams.vcos[0]?.shape || 'RECT'}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[0] = { ...newVcos[0], shape: e.target.value };
                updateCoreParam({ vcos: newVcos });
              }}
            >
              <option>SINE</option>
              <option>TRIANGLE</option>
              <option>SAW</option>
              <option>RECT</option>
              <option>SUPERSAW</option>
              <option>SUPERRECT</option>
            </select>
          </div>
          <div className="clearfix">
            <label>OCT</label>
            <input
              className="octave"
              type="number"
              min="0"
              max="5"
              value={coreParams.vcos[0]?.octave || 0}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[0] = { ...newVcos[0], octave: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <div className="clearfix">
            <label>TUNE</label>
            <input
              className="fine"
              type="number"
              min="-50"
              max="50"
              value={coreParams.vcos[0]?.fine || 0}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[0] = { ...newVcos[0], fine: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <input className="interval" type="hidden" value={coreParams.vcos[0]?.interval || 0} />
          <div className="clearfix">
            <label>SHIFT</label>
            <select
              className="harmony"
              value={coreParams.harmony ? 'harmony' : 'chromatic'}
              onChange={(e) => {
                updateCoreParam({ harmony: e.target.value === 'harmony' });
              }}
            >
              <option>harmony</option>
              <option>chromatic</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="RS_module RS_vco1 RS_VCO">
          <legend>OSC2</legend>
          <div className="clearfix">
            <label>WAVE</label>
            <select
              className="shape"
              value={coreParams.vcos[1]?.shape || 'SAW'}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[1] = { ...newVcos[1], shape: e.target.value };
                updateCoreParam({ vcos: newVcos });
              }}
            >
              <option>SINE</option>
              <option>TRIANGLE</option>
              <option>SAW</option>
              <option>RECT</option>
              <option>SUPERSAW</option>
              <option>SUPERRECT</option>
            </select>
          </div>
          <div className="clearfix">
            <label>OCT</label>
            <input
              className="octave"
              type="number"
              min="0"
              max="5"
              value={coreParams.vcos[1]?.octave || 0}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[1] = { ...newVcos[1], octave: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <div className="clearfix">
            <label>TUNE</label>
            <input
              className="fine"
              type="number"
              min="-50"
              max="50"
              value={coreParams.vcos[1]?.fine || 1}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[1] = { ...newVcos[1], fine: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <div className="clearfix">
            <label>SHIFT</label>
            <input
              className="interval"
              type="number"
              min="-12"
              max="12"
              value={coreParams.vcos[1]?.interval || 3}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[1] = { ...newVcos[1], interval: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
        </fieldset>

        <fieldset className="RS_module RS_vco2 RS_VCO">
          <legend>OSC3</legend>
          <div className="clearfix">
            <label>WAVE</label>
            <select
              className="shape"
              value={coreParams.vcos[2]?.shape || 'NOISE'}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[2] = { ...newVcos[2], shape: e.target.value };
                updateCoreParam({ vcos: newVcos });
              }}
            >
              <option>SINE</option>
              <option>TRIANGLE</option>
              <option>SAW</option>
              <option>RECT</option>
              <option>NOISE</option>
            </select>
          </div>
          <div className="clearfix">
            <label>OCT</label>
            <input
              className="octave"
              type="number"
              min="0"
              max="5"
              value={coreParams.vcos[2]?.octave || 3}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[2] = { ...newVcos[2], octave: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <div className="clearfix">
            <label>SHIFT</label>
            <input
              className="interval"
              type="number"
              min="-12"
              max="12"
              value={coreParams.vcos[2]?.interval || 0}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[2] = { ...newVcos[2], interval: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
          <div className="clearfix">
            <label>TUNE</label>
            <input
              className="fine"
              type="number"
              min="-50"
              max="50"
              value={coreParams.vcos[2]?.fine || 0}
              onChange={(e) => {
                const newVcos = [...coreParams.vcos];
                newVcos[2] = { ...newVcos[2], fine: parseInt(e.target.value) };
                updateCoreParam({ vcos: newVcos });
              }}
            />
          </div>
        </fieldset>

        <fieldset className="RS_module RS_mixer gain">
          <legend>Mixer</legend>
          <div className="clearfix">
            <label>OSC1</label>
            <input
              type="range"
              min="0"
              max="99"
              value={Math.round((coreParams.gains[0] || 0.5) * 99)}
              onChange={(e) => {
                const newGains = [...coreParams.gains];
                newGains[0] = parseInt(e.target.value) / 99;
                updateCoreParam({ gains: newGains });
              }}
            />
          </div>
          <div className="clearfix">
            <label>OSC2</label>
            <input
              type="range"
              min="0"
              max="99"
              value={Math.round((coreParams.gains[1] || 0.4) * 99)}
              onChange={(e) => {
                const newGains = [...coreParams.gains];
                newGains[1] = parseInt(e.target.value) / 99;
                updateCoreParam({ gains: newGains });
              }}
            />
          </div>
          <div className="clearfix">
            <label>NOISE</label>
            <input
              type="range"
              min="0"
              max="99"
              value={Math.round((coreParams.gains[2] || 0.01) * 99)}
              onChange={(e) => {
                const newGains = [...coreParams.gains];
                newGains[2] = parseInt(e.target.value) / 99;
                updateCoreParam({ gains: newGains });
              }}
            />
          </div>
        </fieldset>

        <fieldset className="RS_module RS_EG EG">
          <legend>Envelope</legend>
          <canvas ref={canvasEGRef} className="canvasEG"></canvas>
          <div className="clearfix">
            <label>ATTACK</label>
            <input
              name="attack"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.eg.adsr[0] || 0) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setEGParam(value, coreParams.eg.adsr[1] * 50000, coreParams.eg.adsr[2] * 100, coreParams.eg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>DECAY</label>
            <input
              name="decay"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.eg.adsr[1] || 0.36) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setEGParam(coreParams.eg.adsr[0] * 50000, value, coreParams.eg.adsr[2] * 100, coreParams.eg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>SUSTAIN</label>
            <input
              name="sustain"
              type="range"
              min="0"
              max="100"
              value={Math.round((coreParams.eg.adsr[2] || 0.4) * 100)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setEGParam(coreParams.eg.adsr[0] * 50000, coreParams.eg.adsr[1] * 50000, value, coreParams.eg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>RELEASE</label>
            <input
              name="release"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.eg.adsr[3] || 0.2) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setEGParam(coreParams.eg.adsr[0] * 50000, coreParams.eg.adsr[1] * 50000, coreParams.eg.adsr[2] * 100, value);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
        </fieldset>

        <fieldset className="RS_module RS_filter filter clearfix">
          <legend>Filter</legend>
          <div className="RS_filter_freq">
            <label>FREQ</label>
            <input
              className="filter_slider freq"
              type="range"
              min="10"
              max="1000"
              value={coreParams.filter[0] || 400}
              onChange={(e) => {
                const newFilter = [...coreParams.filter];
                newFilter[0] = parseInt(e.target.value);
                updateCoreParam({ filter: newFilter as [number, number] });
              }}
            />
          </div>
          <div className="RS_filter_Q">
            <label>REZ</label>
            <input
              className="filter_slider q"
              type="range"
              min="0"
              max="40"
              value={coreParams.filter[1] || 6}
              onChange={(e) => {
                const newFilter = [...coreParams.filter];
                newFilter[1] = parseInt(e.target.value);
                updateCoreParam({ filter: newFilter as [number, number] });
              }}
            />
          </div>
        </fieldset>

        <fieldset className="RS_module RS_FEG FEG">
          <legend>FilterEnvelope</legend>
          <canvas ref={canvasFEGRef} className="canvasFEG"></canvas>
          <div className="clearfix">
            <label>ATTACK</label>
            <input
              name="attack"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.feg.adsr[0] || 0) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setFEGParam(value, coreParams.feg.adsr[1] * 50000, coreParams.feg.adsr[2] * 100, coreParams.feg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>DECAY</label>
            <input
              name="decay"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.feg.adsr[1] || 0) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setFEGParam(coreParams.feg.adsr[0] * 50000, value, coreParams.feg.adsr[2] * 100, coreParams.feg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>SUSTAIN</label>
            <input
              name="sustain"
              type="range"
              min="0"
              max="100"
              value={Math.round((coreParams.feg.adsr[2] || 1) * 100)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setFEGParam(coreParams.feg.adsr[0] * 50000, coreParams.feg.adsr[1] * 50000, value, coreParams.feg.adsr[3] * 50000);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
          <div className="clearfix">
            <label>RELEASE</label>
            <input
              name="release"
              type="range"
              min="0"
              max="50000"
              value={Math.round((coreParams.feg.adsr[3] || 0.2) * 50000)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                model.core.setFEGParam(coreParams.feg.adsr[0] * 50000, coreParams.feg.adsr[1] * 50000, coreParams.feg.adsr[2] * 100, value);
                setCoreParams(model.core.getParam());
              }}
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
}
