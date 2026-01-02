import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import {
  CELL_SIZE,
  CellType,
  SYNTH_CELLS_X,
  SYNTH_CELLS_Y,
  MAX_PAGES,
  type SynthPos,
} from './types';
import {
  initCanvas,
  drawCell,
  clearCell,
  clearColumn,
  clearColumns,
  clearAll,
  getPosFromEvent,
} from './canvasUtils';
import type { Synth } from '../../Synth';

interface SynthEditorProps {
  model: Synth;
  id: number;
}

export function SynthEditor({ model, id }: SynthEditorProps) {
  // Canvas refs for ADSR
  const canvasEGRef = useRef<HTMLCanvasElement>(null);
  const canvasFEGRef = useRef<HTMLCanvasElement>(null);

  // Canvas refs
  const canvasOffRef = useRef<HTMLCanvasElement>(null);
  const canvasOnRef = useRef<HTMLCanvasElement>(null);
  const canvasHoverRef = useRef<HTMLCanvasElement>(null);

  // Context refs
  const ctxOffRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxOnRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxHoverRef = useRef<CanvasRenderingContext2D | null>(null);

  // Cell image ref
  const cellImageRef = useRef<HTMLImageElement | null>(null);

  // State
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [pageTotal, setPageTotal] = useState(1);
  const [isStep, setIsStep] = useState(false);
  const [isNoSync, setIsNoSync] = useState(false);
  const [isPanelOpened, setIsPanelOpened] = useState(true);
  const [hoverPos, setHoverPos] = useState({ x: -1, y: -1 });
  const [isClicked, setIsClicked] = useState(false);
  const [clickPos, setClickPos] = useState({ x: -1, y: -1 });
  const [isSustaining, setIsSustaining] = useState(false);
  const [sustainL, setSustainL] = useState(0);
  const [sustainR, setSustainR] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [lastTime, setLastTime] = useState(0);

  // Store state
  const currentInstrument = useAppStore((state) => state.ui.currentInstrument);
  const patternVersions = useAppStore((state) => state.ui.patternVersions);
  const playbackTime = useAppStore((state) => state.playback.time);
  const isActive = currentInstrument === id;

  // Get pattern from model
  const pattern = model.pattern;

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

  // Load cell image
  useEffect(() => {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + 'img/sequencer_cell.png';
    img.onload = () => {
      cellImageRef.current = img;
      setIsImageLoaded(true);
    };
  }, []);

  // Initialize canvases
  useEffect(() => {
    if (!canvasOffRef.current || !canvasOnRef.current || !canvasHoverRef.current) {
      return;
    }

    const width = SYNTH_CELLS_X * CELL_SIZE;
    const height = SYNTH_CELLS_Y * CELL_SIZE;

    ctxOffRef.current = initCanvas(canvasOffRef.current, width, height);
    ctxOnRef.current = initCanvas(canvasOnRef.current, width, height);
    ctxHoverRef.current = initCanvas(canvasHoverRef.current, width, height);
  }, []);

  // Draw all off cells when image loads
  useEffect(() => {
    if (!isImageLoaded || !ctxOffRef.current || !cellImageRef.current) {
      return;
    }

    // Draw empty cells
    for (let y = 0; y < SYNTH_CELLS_Y; y++) {
      for (let x = 0; x < SYNTH_CELLS_X; x++) {
        drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, x, y);
      }
    }

    refreshPattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageLoaded]);

  // Refresh pattern when version changes
  useEffect(() => {
    if (patternVersions[id] !== undefined && isImageLoaded) {
      refreshPattern();
    }
  }, [patternVersions[id], isImageLoaded]);

  // Update playback position
  useEffect(() => {
    if (!isImageLoaded || !ctxOffRef.current || !cellImageRef.current || isNoSync) {
      return;
    }

    const time = playbackTime;

    if (time % SYNTH_CELLS_X === 0) {
      drawPattern(time);
    }

    const lastX = lastTime % SYNTH_CELLS_X;
    const currX = time % SYNTH_CELLS_X;

    for (let y = 0; y < SYNTH_CELLS_Y; y++) {
      drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, lastX, y);
      drawCell(ctxOffRef.current, cellImageRef.current, CellType.Playhead, currX, y);
    }

    setLastTime(time);
  }, [playbackTime, isImageLoaded, isNoSync]);

  // Draw pattern on canvas
  const drawPattern = useCallback(
    (time?: number) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      const currentPage = time !== undefined ? Math.floor(time / SYNTH_CELLS_X) : page;
      setPage(currentPage);

      clearAll(ctxOnRef.current, SYNTH_CELLS_X, SYNTH_CELLS_Y);

      let lastY = 0;
      for (let x = 0; x < SYNTH_CELLS_X; x++) {
        const note = pattern[currentPage * SYNTH_CELLS_X + x];

        if (note === 'sustain') {
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainMiddle, x, lastY);
        } else if (note === 'end') {
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainEnd, x, lastY);
          lastY = 0;
        } else if (typeof note === 'number' && note < 0) {
          const y = SYNTH_CELLS_Y + note;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainStart, x, y);
          lastY = y;
        } else if (typeof note === 'number' && note > 0) {
          const y = SYNTH_CELLS_Y - note;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.Note, x, y);
          lastY = y;
        }
      }
    },
    [pattern, page]
  );

  const refreshPattern = useCallback(() => {
    setPage(0);
    setPageTotal(pattern.length / SYNTH_CELLS_X);
    drawPattern(0);
  }, [pattern, drawPattern]);

  // Note editing functions
  const addNote = useCallback(
    (pos: SynthPos) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      // Handle placing note inside existing sustained note
      if (pattern[pos.x_abs] === 'end' || pattern[pos.x_abs] === 'sustain') {
        let i = pos.x_abs - 1;
        while (pattern[i] === 'sustain' || pattern[i] === 'end') {
          i--;
        }

        const prevX = (pos.x_abs - 1) % SYNTH_CELLS_X;
        clearColumn(ctxOnRef.current, prevX, SYNTH_CELLS_Y);
        const y = SYNTH_CELLS_Y + (pattern[i] as number);

        const prevNote = pattern[pos.x_abs - 1];
        if (typeof prevNote === 'number' && prevNote < 0) {
          pattern[pos.x_abs - 1] = -prevNote;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.Empty, prevX, y);
        } else {
          pattern[pos.x_abs - 1] = 'end';
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainEnd, prevX, y);
        }
      }

      // Clear any sustain cells after current position
      let i = pos.x_abs + 1;
      while (pattern[i] === 'end' || pattern[i] === 'sustain') {
        pattern[i] = 0;
        i++;
      }
      clearColumns(ctxOnRef.current, pos.x, i - pos.x_abs, SYNTH_CELLS_Y);

      // Place the new note
      pattern[pos.x_abs] = pos.note;
      clearColumn(ctxOnRef.current, pos.x, SYNTH_CELLS_Y);
      drawCell(ctxOnRef.current, cellImageRef.current, CellType.Note, pos.x, pos.y);
    },
    [pattern]
  );

  const removeNote = useCallback(
    (pos: SynthPos) => {
      if (!ctxOnRef.current) return;

      pattern[pos.x_abs] = 0;
      clearCell(ctxOnRef.current, pos.x, pos.y);
    },
    [pattern]
  );

  const sustainNote = useCallback(
    (l: number, r: number, pos: SynthPos) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      if (l === r) {
        addNote(pos);
        return;
      }

      clearColumns(ctxOnRef.current, l % SYNTH_CELLS_X, r - l + 1, SYNTH_CELLS_Y);

      for (let i = l + 1; i < r; i++) {
        pattern[i] = 'sustain';
        drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainMiddle, i % SYNTH_CELLS_X, pos.y);
      }

      if (pattern[l] === 'sustain' || pattern[l] === 'end') {
        let i = l - 1;
        while (pattern[i] === 'sustain' || pattern[i] === 'end') {
          i--;
        }
        const prevX = (l - 1) % SYNTH_CELLS_X;
        clearColumn(ctxOnRef.current, prevX, SYNTH_CELLS_Y);
        const y = SYNTH_CELLS_Y + (pattern[i] as number);
        const prevNoteL = pattern[l - 1];
        if (typeof prevNoteL === 'number' && prevNoteL < 0) {
          pattern[l - 1] = -prevNoteL;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.Empty, prevX, y);
        } else {
          pattern[l - 1] = 'end';
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainEnd, prevX, y);
        }
      }

      const noteR = pattern[r];
      if (typeof noteR === 'number' && noteR < 0) {
        const y = SYNTH_CELLS_Y + noteR;
        const nextX = (r + 1) % SYNTH_CELLS_X;
        if (pattern[r + 1] === 'end') {
          pattern[r + 1] = -noteR;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.Note, nextX, y);
        } else {
          pattern[r + 1] = noteR;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainStart, nextX, y);
        }
      }

      pattern[l] = -pos.note;
      pattern[r] = 'end';

      drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainStart, l % SYNTH_CELLS_X, pos.y);
      drawCell(ctxOnRef.current, cellImageRef.current, CellType.SustainEnd, r % SYNTH_CELLS_X, pos.y);
    },
    [pattern, addNote]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasHoverRef.current || !ctxHoverRef.current || !cellImageRef.current) return;

      const pos = getPosFromEvent(e, canvasHoverRef.current, page, SYNTH_CELLS_X, SYNTH_CELLS_Y);

      // Show hover
      if (pos.x !== hoverPos.x || pos.y !== hoverPos.y) {
        clearCell(ctxHoverRef.current, hoverPos.x, hoverPos.y);
        drawCell(ctxHoverRef.current, cellImageRef.current, CellType.Hover, pos.x, pos.y);
        setHoverPos(pos);
      }

      // Add/Remove notes on drag
      if (isClicked && (pos.x !== clickPos.x || pos.y !== clickPos.y)) {
        if (isSustaining) {
          const newL = Math.min(pos.x_abs, sustainL);
          const newR = Math.max(pos.x_abs, sustainR);
          setSustainL(newL);
          setSustainR(newR);
          sustainNote(newL, newR, pos);
        } else {
          if (isAdding) {
            addNote(pos);
          } else if (pattern[pos.x_abs] === pos.note) {
            removeNote(pos);
          }
        }
        setClickPos(pos);
      }
    },
    [hoverPos, isClicked, clickPos, isSustaining, isAdding, sustainL, sustainR, page, pattern, addNote, removeNote, sustainNote]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasHoverRef.current) return;

      setIsClicked(true);
      const pos = getPosFromEvent(e, canvasHoverRef.current, page, SYNTH_CELLS_X, SYNTH_CELLS_Y);

      if (!isStep) {
        // Sustaining mode
        if (pattern[pos.x_abs] === 'sustain' || pattern[pos.x_abs] === 'end') {
          addNote(pos);
          setSustainL(pos.x_abs);
          setSustainR(pos.x_abs);
          setIsSustaining(true);
        } else {
          addNote(pos);
          setSustainL(pos.x_abs);
          setSustainR(pos.x_abs);
          setIsSustaining(true);
        }
      } else {
        // Step mode
        if (pattern[pos.x_abs] === pos.note) {
          removeNote(pos);
        } else {
          setIsAdding(true);
          addNote(pos);
        }
      }
    },
    [page, isStep, pattern, addNote, removeNote]
  );

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
    if (!isStep) {
      setIsSustaining(false);
    } else {
      setIsAdding(false);
    }
  }, [isStep]);

  const handleMouseOut = useCallback(() => {
    if (!ctxHoverRef.current) return;

    clearCell(ctxHoverRef.current, hoverPos.x, hoverPos.y);
    setHoverPos({ x: -1, y: -1 });
    setIsClicked(false);
    setIsAdding(false);
  }, [hoverPos]);

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
    if (pageTotal >= MAX_PAGES) return;
    controller.plusPattern(id);
  };

  const handleMinusPattern = () => {
    if (pattern.length <= SYNTH_CELLS_X) return;
    controller.minusPattern(id);
  };

  const toggleNoSync = () => {
    setIsNoSync(!isNoSync);
    if (isNoSync) {
      drawPattern(playbackTime);
    } else {
      if (!ctxOffRef.current || !cellImageRef.current) return;
      const x = playbackTime % SYNTH_CELLS_X;
      for (let y = 0; y < SYNTH_CELLS_Y; y++) {
        drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, x, y);
      }
    }
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
                className={`fa fa-circle marker ${i < pageTotal ? 'marker-active' : ''} ${i === page ? 'marker-now' : ''}`}
              />
            ))}
            <i className="fa fa-angle-right marker-next" onClick={() => controller.forward()} />

            <span className="marker-pos">{page + 1}</span>
            <span className="marker-divide">/</span>
            <span className="marker-total">{pageTotal}</span>
          </div>

          <i
            className={`fa fa-thumb-tack pattern-nosync btn ${isNoSync ? 'btn-true' : 'btn-false'}`}
            onClick={toggleNoSync}
          />
          <i
            className={`fa fa-minus pattern-minus btn ${pattern.length > SYNTH_CELLS_X ? 'btn-true' : 'btn-false'}`}
            onClick={handleMinusPattern}
          />
          <i
            className="fa fa-plus pattern-plus btn btn-true"
            onClick={handlePlusPattern}
          />
        </div>

        <div className="sequencer-table">
          <canvas ref={canvasOffRef} className="table table-off" />
          <canvas ref={canvasOnRef} className="table table-on" />
          <canvas
            ref={canvasHoverRef}
            className="table table-hover"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
          />
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
              value={Math.round((coreParams.gains[0] ?? 0.5) * 99)}
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
              value={Math.round((coreParams.gains[1] ?? 0.4) * 99)}
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
              value={Math.round((coreParams.gains[2] ?? 0.01) * 99)}
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
              value={Math.round((coreParams.eg.adsr[0] ?? 0) * 50000)}
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
              value={Math.round((coreParams.eg.adsr[1] ?? 0.36) * 50000)}
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
              value={Math.round((coreParams.eg.adsr[2] ?? 0.4) * 100)}
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
              value={Math.round((coreParams.eg.adsr[3] ?? 0.2) * 50000)}
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
              value={Math.round((coreParams.feg.adsr[0] ?? 0) * 50000)}
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
              value={Math.round((coreParams.feg.adsr[1] ?? 0) * 50000)}
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
              value={Math.round((coreParams.feg.adsr[2] ?? 1) * 100)}
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
              value={Math.round((coreParams.feg.adsr[3] ?? 0.2) * 50000)}
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
