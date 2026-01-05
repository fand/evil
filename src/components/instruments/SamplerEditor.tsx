import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { controller } from '../../controller';
import {
  CELL_SIZE,
  CellType,
  SAMPLER_CELLS_X,
  SAMPLER_CELLS_Y,
  MAX_PAGES,
  type SamplerPos,
} from './types';
import {
  initCanvas,
  drawCell,
  clearCell,
  clearAll,
  getPosFromEvent,
} from './canvasUtils';
import { Keyboard, SAMPLER_KEYBOARD_COLORS } from './Keyboard';
import type { Sampler } from '../../Sampler';
import styles from './Instruments.module.css';

interface SamplerEditorProps {
  model: Sampler;
  id: number;
}

export function SamplerEditor({ model, id }: SamplerEditorProps) {
  // Canvas refs
  const canvasOffRef = useRef<HTMLCanvasElement>(null);
  const canvasOnRef = useRef<HTMLCanvasElement>(null);
  const canvasHoverRef = useRef<HTMLCanvasElement>(null);
  const canvasWaveformRef = useRef<HTMLCanvasElement>(null);
  const canvasEQRef = useRef<HTMLCanvasElement>(null);

  // Context refs
  const ctxOffRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxOnRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxHoverRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxWaveformRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxEQRef = useRef<CanvasRenderingContext2D | null>(null);

  // Cell image ref
  const cellImageRef = useRef<HTMLImageElement | null>(null);

  // State
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [pageTotal, setPageTotal] = useState(1);
  const [isNoSync, setIsNoSync] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: -1, y: -1 });
  const [isClicked, setIsClicked] = useState(false);
  const [clickPos, setClickPos] = useState({ x: -1, y: -1 });
  const [isAdding, setIsAdding] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [sampleNow, setSampleNow] = useState(0); // Currently selected sample index

  // Store state
  const currentInstrument = useAppStore((state) => state.ui.currentInstrument);
  const patternVersions = useAppStore((state) => state.ui.patternVersions);
  const playbackTime = useAppStore((state) => state.playback.time);
  const isActive = currentInstrument === id;

  // Get pattern from model
  const pattern = model.pattern;

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
    if (
      !canvasOffRef.current ||
      !canvasOnRef.current ||
      !canvasHoverRef.current
    ) {
      return;
    }

    const width = SAMPLER_CELLS_X * CELL_SIZE;
    const height = SAMPLER_CELLS_Y * CELL_SIZE;

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
    for (let y = 0; y < SAMPLER_CELLS_Y; y++) {
      for (let x = 0; x < SAMPLER_CELLS_X; x++) {
        drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, x, y);
      }
    }

    refreshPattern();
  }, [isImageLoaded]);

  // Refresh pattern when version changes
  useEffect(() => {
    if (patternVersions[id] !== undefined && isImageLoaded) {
      refreshPattern();
    }
  }, [patternVersions[id], isImageLoaded]);

  // Update playback position
  useEffect(() => {
    if (
      !isActive ||
      !isImageLoaded ||
      !ctxOffRef.current ||
      !cellImageRef.current ||
      isNoSync
    ) {
      return;
    }

    const time = playbackTime;

    if (time % SAMPLER_CELLS_X === 0) {
      drawPattern(time);
    }

    const lastX = lastTime % SAMPLER_CELLS_X;
    const currX = time % SAMPLER_CELLS_X;

    for (let y = 0; y < SAMPLER_CELLS_Y; y++) {
      drawCell(
        ctxOffRef.current,
        cellImageRef.current,
        CellType.Empty,
        lastX,
        y
      );
      drawCell(
        ctxOffRef.current,
        cellImageRef.current,
        CellType.Playhead,
        currX,
        y
      );
    }

    setLastTime(time);
  }, [playbackTime, isActive, isImageLoaded, isNoSync]);

  // Draw pattern on canvas
  const drawPattern = useCallback(
    (time?: number) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      const currentPage =
        time !== undefined ? Math.floor(time / SAMPLER_CELLS_X) : page;
      setPage(currentPage);

      clearAll(ctxOnRef.current, SAMPLER_CELLS_X, SAMPLER_CELLS_Y);

      for (let x = 0; x < SAMPLER_CELLS_X; x++) {
        const notes = pattern[currentPage * SAMPLER_CELLS_X + x];
        for (const [note] of notes) {
          const y = SAMPLER_CELLS_Y - note;
          drawCell(ctxOnRef.current, cellImageRef.current, CellType.Note, x, y);
        }
      }
    },
    [pattern, page]
  );

  const refreshPattern = useCallback(() => {
    setPage(0);
    setPageTotal(pattern.length / SAMPLER_CELLS_X);
    drawPattern(0);
  }, [pattern, drawPattern]);

  // Note editing functions
  const addNote = useCallback(
    (pos: SamplerPos, gain: number) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      // Remove existing note at this position if any
      const notes = pattern[pos.x_abs];
      for (let i = 0; i < notes.length; i++) {
        if (notes[i][0] === pos.note) {
          notes.splice(i, 1);
          break;
        }
      }

      // Add new note
      notes.push([pos.note, gain]);

      drawCell(
        ctxOnRef.current,
        cellImageRef.current,
        CellType.Note,
        pos.x,
        pos.y
      );
    },
    [pattern]
  );

  const removeNote = useCallback(
    (pos: SamplerPos) => {
      if (!ctxOnRef.current) return;

      const notes = pattern[pos.x_abs];
      for (let i = 0; i < notes.length; i++) {
        if (notes[i][0] === pos.note) {
          notes.splice(i, 1);
          break;
        }
      }

      clearCell(ctxOnRef.current, pos.x, pos.y);
    },
    [pattern]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (
        !canvasHoverRef.current ||
        !ctxHoverRef.current ||
        !cellImageRef.current
      )
        return;

      const pos = getPosFromEvent(
        e,
        canvasHoverRef.current,
        page,
        SAMPLER_CELLS_X,
        SAMPLER_CELLS_Y
      ) as SamplerPos;
      // Clamp y to prevent note 0
      if (pos.y >= SAMPLER_CELLS_Y) {
        pos.y = SAMPLER_CELLS_Y - 1;
        pos.note = 1;
      }

      // Show hover
      if (pos.x !== hoverPos.x || pos.y !== hoverPos.y) {
        clearCell(ctxHoverRef.current, hoverPos.x, hoverPos.y);
        drawCell(
          ctxHoverRef.current,
          cellImageRef.current,
          CellType.Hover,
          pos.x,
          pos.y
        );
        setHoverPos(pos);
      }

      // Add/Remove notes on drag
      if (isClicked && (pos.x !== clickPos.x || pos.y !== clickPos.y)) {
        if (isAdding) {
          addNote(pos, 1.0);
        } else {
          removeNote(pos);
        }
        setClickPos(pos);
      }
    },
    [hoverPos, isClicked, clickPos, isAdding, page, addNote, removeNote]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasHoverRef.current) return;

      setIsClicked(true);
      const pos = getPosFromEvent(
        e,
        canvasHoverRef.current,
        page,
        SAMPLER_CELLS_X,
        SAMPLER_CELLS_Y
      ) as SamplerPos;
      // Clamp y
      if (pos.y >= SAMPLER_CELLS_Y) {
        pos.y = SAMPLER_CELLS_Y - 1;
        pos.note = 1;
      }

      // Check if note exists at position
      let remove = false;
      for (const [note] of pattern[pos.x_abs]) {
        if (note === pos.note) {
          remove = true;
          break;
        }
      }

      if (remove) {
        removeNote(pos);
      } else {
        setIsAdding(true);
        addNote(pos, 1.0);
      }
    },
    [page, pattern, addNote, removeNote]
  );

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
    setIsAdding(false);
  }, []);

  const handleMouseOut = useCallback(() => {
    if (!ctxHoverRef.current) return;

    clearCell(ctxHoverRef.current, hoverPos.x, hoverPos.y);
    setHoverPos({ x: -1, y: -1 });
    setIsClicked(false);
    setIsAdding(false);
  }, [hoverPos]);

  // Control handlers
  const handleInstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controller.setInstrumentName(id, e.target.value);
  };

  const handlePatternNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controller.setInstrumentPatternName(id, e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    controller.changeInstrumentType(id, e.target.value);
  };

  const handlePlusPattern = () => {
    if (pageTotal >= MAX_PAGES) return;
    controller.plusPattern(id);
  };

  const handleMinusPattern = () => {
    if (pattern.length <= SAMPLER_CELLS_X) return;
    controller.minusPattern(id);
  };

  const toggleNoSync = () => {
    setIsNoSync(!isNoSync);
    if (isNoSync) {
      drawPattern(playbackTime);
    } else {
      if (!ctxOffRef.current || !cellImageRef.current) return;
      const x = playbackTime % SAMPLER_CELLS_X;
      for (let y = 0; y < SAMPLER_CELLS_Y; y++) {
        drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, x, y);
      }
    }
  };

  // Sampler core parameter handlers
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = Math.pow(10, parseFloat(e.target.value) / 100.0 - 1.0);
    const timeParam = model.core.getSampleTimeParam(sampleNow);
    model.core.setSampleTimeParam(sampleNow, timeParam[0], timeParam[1], speed);
  };

  const handleEQChange = (param: 'lo' | 'mid' | 'hi', value: string) => {
    const eqParam = model.core.getSampleEQParam(sampleNow);
    const newValue = parseFloat(value) - 100.0;

    if (param === 'lo') {
      model.core.setSampleEQParam(sampleNow, newValue, eqParam[1], eqParam[2]);
    } else if (param === 'mid') {
      model.core.setSampleEQParam(sampleNow, eqParam[0], newValue, eqParam[2]);
    } else if (param === 'hi') {
      model.core.setSampleEQParam(sampleNow, eqParam[0], eqParam[1], newValue);
    }

    // Update EQ canvas
    updateEQCanvas();
  };

  // Draw waveform canvas
  const updateWaveformCanvas = useCallback(() => {
    if (!canvasWaveformRef.current || !ctxWaveformRef.current) return;

    const canvas = canvasWaveformRef.current;
    const ctx = ctxWaveformRef.current;
    const w = 300;
    const h = 170;

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.translate(0, 10);

    const hts = model.core.getSampleTimeParam(sampleNow);
    const _data = model.core.getSampleData(sampleNow);

    if (_data) {
      const wave = _data.getChannelData(0);

      // Draw waveform
      ctx.translate(0, (h - 10) / 2);
      ctx.beginPath();

      const d = wave.length / w;
      for (let x = 0; x < w; x++) {
        ctx.lineTo(x, wave[Math.floor(x * d)] * (h - 10) * 0.45);
      }

      ctx.closePath();
      ctx.strokeStyle = 'rgb(255, 0, 220)';
      ctx.stroke();
      ctx.translate(0, -(h - 10) / 2);
    }

    // Draw params (head/tail)
    const left = hts[0] * w;
    const right = hts[1] * w;
    if (left < right) {
      ctx.fillStyle = 'rgba(255, 0, 160, 0.2)';
      ctx.fillRect(left, 0, right - left, h - 10);
    }

    ctx.strokeStyle = 'rgb(255, 0, 220)';
    ctx.beginPath();
    ctx.arc(left, -5, 5, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(right, -5, 5, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    ctx.translate(0, -10);
  }, [model, sampleNow]);

  // Draw EQ canvas
  const updateEQCanvas = useCallback(() => {
    if (!canvasEQRef.current || !ctxEQRef.current) return;

    const canvas = canvasEQRef.current;
    const ctx = ctxEQRef.current;
    const w = 270;
    const h = 100;

    canvas.width = w;
    canvas.height = h;

    const eq = model.core.getSampleEQParam(sampleNow);

    ctx.clearRect(0, 0, w, h);
    ctx.translate(0, h / 2);
    ctx.beginPath();
    ctx.moveTo(0, -(eq[0] / 100.0) * (h / 2));
    ctx.lineTo(w / 3, -(eq[1] / 100.0) * (h / 2));
    ctx.lineTo((w / 3) * 2, -(eq[1] / 100.0) * (h / 2));
    ctx.lineTo(w, -(eq[2] / 100.0) * (h / 2));
    ctx.strokeStyle = 'rgb(255, 0, 220)';
    ctx.stroke();
    ctx.closePath();
    ctx.translate(0, -h / 2);
  }, [model, sampleNow]);

  // Initialize waveform and EQ canvases
  useEffect(() => {
    if (canvasWaveformRef.current) {
      ctxWaveformRef.current = canvasWaveformRef.current.getContext('2d');
    }
    if (canvasEQRef.current) {
      ctxEQRef.current = canvasEQRef.current.getContext('2d');
    }
    updateWaveformCanvas();
    updateEQCanvas();
  }, [isActive, sampleNow, updateWaveformCanvas, updateEQCanvas]);

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pan = 1.0 - parseFloat(e.target.value) / 200.0;
    const outputParam = model.core.getSampleOutputParam(sampleNow);
    model.core.setSampleOutputParam(sampleNow, pan, outputParam[1]);
  };

  const handleGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gain = parseFloat(e.target.value) / 100.0;
    const outputParam = model.core.getSampleOutputParam(sampleNow);
    model.core.setSampleOutputParam(sampleNow, outputParam[0], gain);
  };

  // Keyboard callbacks
  const handleKeyboardNoteOn = useCallback(
    (note: number) => {
      model.noteOn(note);
    },
    [model]
  );

  const handleKeyboardNoteOff = useCallback(() => {
    model.noteOff();
  }, [model]);

  const handleKeyboardSelectSample = useCallback(
    (sample: number) => {
      setSampleNow(sample);
      controller.selectSample(id, sample);
    },
    [id]
  );

  // Default scale for sampler (7 notes per octave display)
  const samplerScale = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div
      className={`${styles.instrument} ${styles.sampler} ${styles.clearfix} ${isActive ? 'active' : ''}`}
      id={`sampler${id}`}
    >
      <div className="sequencer">
        <div className={styles.header}>
          <select
            className={styles.synthType}
            value={model.type}
            onChange={handleTypeChange}
          >
            <option value="REZ">REZ</option>
            <option value="SAMPLER">SAMPLER</option>
          </select>

          <div className={`${styles.names} ${styles.clearfix}`}>
            <input
              type="text"
              className={styles.synthName}
              value={model.name}
              onChange={handleInstNameChange}
              onFocus={() => window.keyboard.beginInput()}
              onBlur={() => window.keyboard.endInput()}
            />
            <span>&gt;</span>
            <input
              type="text"
              className={styles.patternName}
              value={model.pattern_name}
              onChange={handlePatternNameChange}
              onFocus={() => window.keyboard.beginInput()}
              onBlur={() => window.keyboard.endInput()}
            />
          </div>

          <div className={`${styles.markers} ${styles.clearfix}`}>
            <i
              className={`fa fa-angle-left ${styles.markerPrev}`}
              onClick={() => controller.backward(true)}
            />
            {[...Array(8)].map((_, i) => (
              <i
                key={i}
                className={`fa fa-circle ${styles.marker} ${i < pageTotal ? styles.markerActive : ''} ${i === page ? styles.markerNow : ''}`}
              />
            ))}
            <i
              className={`fa fa-angle-right ${styles.markerNext}`}
              onClick={() => controller.forward()}
            />

            <span className={styles.markerPos}>{page + 1}</span>
            <span className={styles.markerDivide}>/</span>
            <span className={styles.markerTotal}>{pageTotal}</span>
          </div>

          <i
            className={`fa fa-thumb-tack ${styles.patternNosync} ${isNoSync ? styles.btnTrue : styles.btnFalse}`}
            onClick={toggleNoSync}
          />
          <i
            className={`fa fa-minus ${styles.patternMinus} ${styles.headerBtn} ${pattern.length > SAMPLER_CELLS_X ? styles.btnTrue : styles.btnFalse}`}
            onClick={handleMinusPattern}
          />
          <i
            className={`fa fa-plus ${styles.patternPlus} ${styles.headerBtn} ${styles.btnTrue}`}
            onClick={handlePlusPattern}
          />
        </div>

        <div className={styles.sequencerTable}>
          <Keyboard
            numKeys={SAMPLER_CELLS_Y}
            scale={samplerScale}
            width={64}
            height={SAMPLER_CELLS_Y * 26}
            colors={SAMPLER_KEYBOARD_COLORS}
            onNoteOn={handleKeyboardNoteOn}
            onNoteOff={handleKeyboardNoteOff}
            onSelectSample={handleKeyboardSelectSample}
          />
          <canvas
            ref={canvasOffRef}
            className={`${styles.table} ${styles.tableOff}`}
          />
          <canvas
            ref={canvasOnRef}
            className={`${styles.table} ${styles.tableOn}`}
          />
          <canvas
            ref={canvasHoverRef}
            className={`${styles.table} ${styles.tableHover}`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
          />
        </div>
      </div>

      <div className={styles.samplerCore}>
        <fieldset className={`${styles.samplerModule} ${styles.samplerSample}`}>
          <legend>Sample</legend>

          <div className="wave">
            <div className={`${styles.fileSelect} ${styles.clearfix}`}>
              <label>SAMPLE</label>
              <div className={styles.sampleName}>
                <span>hello</span>
                <i className="fa fa-angle-down"></i>
              </div>
              <div className="sample-error"></div>
            </div>

            <canvas ref={canvasWaveformRef} className={styles.waveform}></canvas>
          </div>

          <div className={`${styles.clearfix} ${styles.param}`}>
            <label>SPEED</label>
            <input
              type="range"
              min="0"
              max="200"
              defaultValue="100"
              onChange={handleSpeedChange}
            />
          </div>
        </fieldset>

        <fieldset className={`${styles.samplerModule} ${styles.samplerEQ}`}>
          <legend>EQ</legend>
          <canvas ref={canvasEQRef} className={styles.canvasEQ}></canvas>
          <div className={`${styles.clearfix} ${styles.eqSliders}`}>
            <div className={styles.eqSlider}>
              <label>LO</label>
              <input
                className={styles.gainSlider}
                type="range"
                min="0"
                max="200"
                defaultValue="100"
                onChange={(e) => handleEQChange('lo', e.target.value)}
              />
            </div>
            <div className={styles.eqSlider}>
              <label>MID</label>
              <input
                className={styles.gainSlider}
                type="range"
                min="0"
                max="200"
                defaultValue="100"
                onChange={(e) => handleEQChange('mid', e.target.value)}
              />
            </div>
            <div className={styles.eqSlider}>
              <label>HI</label>
              <input
                className={styles.gainSlider}
                type="range"
                min="0"
                max="200"
                defaultValue="100"
                onChange={(e) => handleEQChange('hi', e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={`${styles.samplerModule} ${styles.samplerOutput}`}>
          <legend>output</legend>L{' '}
          <input
            className={styles.panSlider}
            type="range"
            min="0"
            max="200"
            defaultValue="100"
            onChange={handlePanChange}
          />{' '}
          R
          <input
            className={styles.gainSlider}
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            onChange={handleGainChange}
          />
        </fieldset>
      </div>
    </div>
  );
}
