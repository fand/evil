import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore, useShallow } from '../../hooks/useStore';
import { controller } from '../../controller';
import { usePlayImage } from './usePlayImage';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  OFFSET_Y,
  DEFAULT_COLOR,
  type CellPos,
  type ColorScheme,
} from './types';
import {
  initCanvas,
  drawEmptyCell,
  drawPatternCell,
  drawTrackName,
  drawActiveIndicator,
  drawHover,
  clearHover,
  drawSelection,
  getColorScheme,
} from './canvasUtils';
import type { Song } from '../../Song';

interface TracksCanvasProps {
  song: Song;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  mixerScrollLeft: number;
  offsetTranslate: number;
  onCellSelect: (pos: CellPos) => void;
  selectedPos: CellPos | null;
}

export function TracksCanvas({
  song,
  wrapperRef,
  mixerScrollLeft,
  offsetTranslate,
  onCellSelect,
  selectedPos,
}: TracksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasOnRef = useRef<HTMLCanvasElement>(null);
  const canvasHoverRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxOnRef = useRef<CanvasRenderingContext2D | null>(null);
  const ctxHoverRef = useRef<CanvasRenderingContext2D | null>(null);

  const imgPlay = usePlayImage();
  const [hoverPos, setHoverPos] = useState<CellPos>({ x: -1, y: -1 });
  const [clickPos, setClickPos] = useState<CellPos>({ x: -1, y: -1 });
  const [isClicked, setIsClicked] = useState(false);
  const [lastClicked, setLastClicked] = useState(0);
  const [trackColors, setTrackColors] = useState<ColorScheme[]>([]);

  // Store subscriptions
  const { scenePos, currentCells, beat } = useAppStore(
    useShallow((state) => ({
      scenePos: state.playback.scenePos,
      currentCells: state.playback.currentCells,
      beat: state.playback.beat,
    }))
  );

  // Calculate dimensions
  const width = Math.max(song.tracks.length, 8) * CELL_WIDTH + 1;
  const height = Math.max(song.length + 2, 11) * CELL_HEIGHT + 10;

  // Initialize track colors
  useEffect(() => {
    const colors = song.tracks.map(
      (track) => getColorScheme(track.type) || DEFAULT_COLOR
    );
    // Pad with default colors for empty tracks
    while (colors.length < 8) {
      colors.push(DEFAULT_COLOR);
    }
    setTrackColors(colors);
  }, [song.tracks]);

  // Initialize canvases
  useEffect(() => {
    if (
      !canvasRef.current ||
      !canvasOnRef.current ||
      !canvasHoverRef.current ||
      !imgPlay
    ) {
      return;
    }

    ctxRef.current = initCanvas(canvasRef.current, width, height);
    ctxOnRef.current = initCanvas(canvasOnRef.current, width, height);
    ctxHoverRef.current = initCanvas(canvasHoverRef.current, width, height);

    // Draw all cells
    drawAllCells();
  }, [imgPlay, width, height, song]);

  // Draw all cells
  const drawAllCells = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !imgPlay) return;

    // Clear canvas
    ctx.clearRect(0, -OFFSET_Y, width, height + OFFSET_Y);

    // Draw tracks
    for (let x = 0; x < Math.max(song.tracks.length + 1, 8); x++) {
      const track = song.tracks[x];
      const color = trackColors[x] || DEFAULT_COLOR;

      // Draw track name
      if (track?.name) {
        drawTrackName(ctx, x, track.name, color);
      }

      // Draw cells
      for (let y = 0; y < Math.max(song.length + 1, 10); y++) {
        const pattern = track?.patterns[y];
        if (pattern) {
          drawPatternCell(ctx, pattern, x, y, imgPlay, color);
        } else {
          drawEmptyCell(ctx, x, y, color);
        }
      }
    }
  }, [song, imgPlay, width, height, trackColors]);

  // Update active cells when currentCells or scenePos changes
  useEffect(() => {
    const ctxOn = ctxOnRef.current;
    if (!ctxOn || !imgPlay) return;

    // Clear previous active cells
    ctxOn.clearRect(0, -OFFSET_Y, width, height + OFFSET_Y);

    // Draw new active cells
    currentCells.forEach((cellY, trackIdx) => {
      if (cellY !== undefined) {
        drawActiveIndicator(ctxOn, trackIdx, cellY, imgPlay);
      }
    });
  }, [currentCells, scenePos, imgPlay, width, height]);

  // Handle beat animation
  useEffect(() => {
    const ctxOn = ctxOnRef.current;
    if (!ctxOn || !imgPlay || beat.trigger === 0) return;

    if (!beat.isMaster && Array.isArray(beat.cells)) {
      for (const [x, y] of beat.cells as [number, number][]) {
        drawActiveIndicator(ctxOn, x, y, imgPlay);
        setTimeout(() => {
          ctxOn.clearRect(x * CELL_WIDTH + 3, y * CELL_HEIGHT + 3, 16, 15);
        }, 100);
      }
    }
  }, [beat, imgPlay]);

  // Get cell position from mouse event
  const getCellPos = useCallback(
    (e: React.MouseEvent): CellPos => {
      const rect = canvasHoverRef.current?.getBoundingClientRect();
      const scrollTop = wrapperRef.current?.scrollTop || 0;
      if (!rect) return { x: -1, y: -1, type: 'tracks' };

      const x = Math.floor(
        (e.clientX - rect.left + mixerScrollLeft) / CELL_WIDTH
      );
      const y = Math.floor(
        (e.clientY - rect.top + scrollTop - offsetTranslate) / CELL_HEIGHT
      );
      return { x, y, type: 'tracks' };
    },
    [mixerScrollLeft, offsetTranslate, wrapperRef]
  );

  // Check if click is on play button
  const isPlayButton = useCallback(
    (e: React.MouseEvent, pos: CellPos): boolean => {
      const rect = canvasHoverRef.current?.getBoundingClientRect();
      const scrollTop = wrapperRef.current?.scrollTop || 0;
      if (!rect) return false;

      const relX = e.clientX - rect.left + mixerScrollLeft - pos.x * CELL_WIDTH;
      const relY =
        e.clientY -
        rect.top +
        scrollTop -
        offsetTranslate -
        pos.y * CELL_HEIGHT;
      return relX < 20 && relY < 20 && pos.y >= 0;
    },
    [mixerScrollLeft, offsetTranslate, wrapperRef]
  );

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const ctxHover = ctxHoverRef.current;
      if (!ctxHover) return;

      const pos = getCellPos(e);

      if (isClicked) {
        // Drag mode - show preview of dragged cell
        clearHover(ctxHover, hoverPos);
        // Draw drag preview (simplified)
        drawHover(ctxHover, pos);
      } else {
        // Hover mode
        clearHover(ctxHover, hoverPos);
        drawHover(ctxHover, pos);
      }

      setHoverPos(pos);
    },
    [getCellPos, hoverPos, isClicked]
  );

  const handleMouseOut = useCallback(() => {
    const ctxHover = ctxHoverRef.current;
    if (ctxHover) {
      clearHover(ctxHover, hoverPos);
    }
    setHoverPos({ x: -1, y: -1 });
    setIsClicked(false);
  }, [hoverPos]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCellPos(e);

      // Check if clicking play button
      if (isPlayButton(e, pos)) {
        const track = song.tracks[pos.x];
        if (track?.patterns[pos.y]) {
          controller.cuePattern(pos.x, pos.y);
        }
        return;
      }

      // Check for double click
      const now = performance.now();
      if (now - lastClicked < 500 && pos.y !== -1) {
        // Double click - edit pattern
        const result = controller.editPattern(pos.x, pos.y);
        if (result) {
          drawAllCells();
        }
        setLastClicked(-10000);
      } else {
        setLastClicked(now);
      }

      setClickPos(pos);
      setIsClicked(true);
    },
    [getCellPos, isPlayButton, lastClicked, song, drawAllCells]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCellPos(e);

      if (clickPos.x === pos.x && clickPos.y === pos.y) {
        // Single click - select cell
        const track = song.tracks[pos.x];
        if (track?.patterns[pos.y]) {
          onCellSelect(pos);
        }
      } else if (clickPos.x !== -1 && clickPos.y !== -1) {
        // Drag - copy cell
        const srcTrack = song.tracks[clickPos.x];
        if (srcTrack?.patterns[clickPos.y]) {
          controller.savePattern(clickPos.x, clickPos.y);
          // Copy logic would go here
          drawAllCells();
        }
      }

      setIsClicked(false);
    },
    [getCellPos, clickPos, song, onCellSelect, drawAllCells]
  );

  // Draw selection
  useEffect(() => {
    const ctxHover = ctxHoverRef.current;
    if (!ctxHover || !selectedPos || selectedPos.type !== 'tracks') return;

    const track = song.tracks[selectedPos.x];
    const pattern = track?.patterns[selectedPos.y];
    const color = trackColors[selectedPos.x] || DEFAULT_COLOR;

    if (pattern) {
      drawSelection(ctxHover, selectedPos, pattern, color);
    }
  }, [selectedPos, song, trackColors]);

  return (
    <div id="session-tracks-wrapper" style={{ width: width + 'px' }}>
      <div
        id="session-tracks-wrapper-sub"
        ref={wrapperRef}
        style={{ width: width + 'px' }}
      >
        <canvas
          id="session-tracks"
          ref={canvasRef}
          style={{ width: width + 'px', height: height + 'px' }}
        />
        <canvas
          id="session-tracks-on"
          ref={canvasOnRef}
          style={{ width: width + 'px', height: height + 'px' }}
        />
        <canvas
          id="session-tracks-hover"
          ref={canvasHoverRef}
          style={{
            width: width + 'px',
            height: height + 'px',
            pointerEvents: 'auto',
            zIndex: 10,
          }}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}
