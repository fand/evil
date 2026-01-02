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
import type { Sampler } from '../../Sampler';

interface SamplerEditorProps {
  model: Sampler;
  id: number;
}

export function SamplerEditor({ model, id }: SamplerEditorProps) {
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
  const [isNoSync, setIsNoSync] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: -1, y: -1 });
  const [isClicked, setIsClicked] = useState(false);
  const [clickPos, setClickPos] = useState({ x: -1, y: -1 });
  const [isAdding, setIsAdding] = useState(false);
  const [lastTime, setLastTime] = useState(0);

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
    if (!canvasOffRef.current || !canvasOnRef.current || !canvasHoverRef.current) {
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
    if (!isActive || !isImageLoaded || !ctxOffRef.current || !cellImageRef.current || isNoSync) {
      return;
    }

    const time = playbackTime;

    if (time % SAMPLER_CELLS_X === 0) {
      drawPattern(time);
    }

    const lastX = lastTime % SAMPLER_CELLS_X;
    const currX = time % SAMPLER_CELLS_X;

    for (let y = 0; y < SAMPLER_CELLS_Y; y++) {
      drawCell(ctxOffRef.current, cellImageRef.current, CellType.Empty, lastX, y);
      drawCell(ctxOffRef.current, cellImageRef.current, CellType.Playhead, currX, y);
    }

    setLastTime(time);
  }, [playbackTime, isActive, isImageLoaded, isNoSync]);

  // Draw pattern on canvas
  const drawPattern = useCallback(
    (time?: number) => {
      if (!ctxOnRef.current || !cellImageRef.current) return;

      const currentPage = time !== undefined ? Math.floor(time / SAMPLER_CELLS_X) : page;
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

      drawCell(ctxOnRef.current, cellImageRef.current, CellType.Note, pos.x, pos.y);
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
      if (!canvasHoverRef.current || !ctxHoverRef.current || !cellImageRef.current) return;

      const pos = getPosFromEvent(e, canvasHoverRef.current, page, SAMPLER_CELLS_X, SAMPLER_CELLS_Y) as SamplerPos;
      // Clamp y to prevent note 0
      if (pos.y >= SAMPLER_CELLS_Y) {
        pos.y = SAMPLER_CELLS_Y - 1;
        pos.note = 1;
      }

      // Show hover
      if (pos.x !== hoverPos.x || pos.y !== hoverPos.y) {
        clearCell(ctxHoverRef.current, hoverPos.x, hoverPos.y);
        drawCell(ctxHoverRef.current, cellImageRef.current, CellType.Hover, pos.x, pos.y);
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
      const pos = getPosFromEvent(e, canvasHoverRef.current, page, SAMPLER_CELLS_X, SAMPLER_CELLS_Y) as SamplerPos;
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

  return (
    <div
      className={`instrument sampler clearfix ${isActive ? 'active' : ''}`}
      id={`sampler${id}`}
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
              onChange={handleInstNameChange}
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
            className={`fa fa-minus pattern-minus btn ${pattern.length > SAMPLER_CELLS_X ? 'btn-true' : 'btn-false'}`}
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

      <div className="sampler-core">
        <fieldset className="Sampler_module Sampler_sample">
          <legend>Sample</legend>

          <div className="wave">
            <div className="file-select clearfix">
              <label>SAMPLE</label>
              <div className="sample-name">
                <span>hello</span>
                <i className="fa fa-angle-down"></i>
              </div>
              <div className="sample-error"></div>
            </div>

            <canvas className="waveform"></canvas>
          </div>

          <div className="clearfix param">
            <label>SPEED</label>
            <input className="speed" type="range" min="0" max="200" defaultValue="100" />
          </div>
        </fieldset>

        <fieldset className="Sampler_module Sampler_EQ">
          <legend>EQ</legend>
          <canvas className="canvasEQ"></canvas>
          <div className="clearfix EQ-sliders">
            <div className="EQ-slider">
              <label>LO</label>
              <input className="gain-slider EQ_lo" type="range" min="0" max="200" defaultValue="100" />
            </div>
            <div className="EQ-slider">
              <label>MID</label>
              <input className="gain-slider EQ_mid" type="range" min="0" max="200" defaultValue="100" />
            </div>
            <div className="EQ-slider">
              <label>HI</label>
              <input className="gain-slider EQ_hi" type="range" min="0" max="200" defaultValue="100" />
            </div>
          </div>
        </fieldset>

        <fieldset className="Sampler_module Sampler_output">
          <legend>output</legend>
          L <input className="pan-slider" type="range" min="0" max="200" defaultValue="100" /> R
          <input className="gain-slider" type="range" min="0" max="100" defaultValue="100" />
        </fieldset>
      </div>
    </div>
  );
}
