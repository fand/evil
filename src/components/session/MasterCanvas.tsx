import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore, useShallow } from '../../hooks/useStore';
import { controller } from '../../controller';
import { usePlayImage } from './usePlayImage';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  MASTER_WIDTH,
  OFFSET_Y,
  DEFAULT_COLOR,
  type CellPos,
} from './types';
import {
  initCanvas,
  drawEmptyCell,
  drawPatternCell,
  drawMasterName,
  drawActiveIndicator,
  drawHover,
  clearHover,
  drawSelection,
} from './canvasUtils';
import type { Song } from '../../Song';

interface MasterCanvasProps {
  song: Song;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  offsetTranslate: number;
  onCellSelect: (pos: CellPos) => void;
  selectedPos: CellPos | null;
  onSyncScroll: (scrollTop: number) => void;
}

export function MasterCanvas({
  song,
  wrapperRef,
  offsetTranslate,
  onCellSelect,
  selectedPos,
  onSyncScroll,
}: MasterCanvasProps) {
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

  // Store subscriptions
  const { scenePos, beat } = useAppStore(
    useShallow((state) => ({
      scenePos: state.playback.scenePos,
      beat: state.playback.beat,
    }))
  );

  // Calculate dimensions
  const width = MASTER_WIDTH + 11;
  const height = Math.max(song.length + 2, 11) * CELL_HEIGHT + 10;

  // Initialize canvases
  useEffect(() => {
    if (!canvasRef.current || !canvasOnRef.current || !canvasHoverRef.current || !imgPlay) {
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

    // Draw master name
    drawMasterName(ctx);

    // Draw cells
    for (let y = 0; y < Math.max(song.length + 1, 10); y++) {
      const pattern = song.master[y];
      if (pattern) {
        drawPatternCell(ctx, pattern, 0, y, imgPlay, DEFAULT_COLOR, true);
      } else {
        drawEmptyCell(ctx, 0, y, DEFAULT_COLOR, true);
      }
    }
  }, [song, imgPlay, width, height]);

  // Update active position when scenePos changes
  useEffect(() => {
    const ctxOn = ctxOnRef.current;
    if (!ctxOn || !imgPlay) return;

    // Clear and redraw active indicator
    ctxOn.clearRect(0, -OFFSET_Y, width, height + OFFSET_Y);
    drawActiveIndicator(ctxOn, 0, scenePos, imgPlay, true);
  }, [scenePos, imgPlay, width, height]);

  // Handle beat animation
  useEffect(() => {
    const ctxOn = ctxOnRef.current;
    if (!ctxOn || !imgPlay || beat.trigger === 0) return;

    if (beat.isMaster) {
      const cells = beat.cells as [number, number | undefined];
      if (cells[1] !== undefined) {
        const y = cells[1];
        drawActiveIndicator(ctxOn, 0, y, imgPlay, true);
        setTimeout(() => {
          ctxOn.clearRect(3, y * CELL_HEIGHT + 3, 16, 15);
        }, 100);
      }
    }
  }, [beat, imgPlay]);

  // Get cell position from mouse event
  const getCellPos = useCallback(
    (e: React.MouseEvent): CellPos => {
      const rect = canvasHoverRef.current?.getBoundingClientRect();
      const scrollTop = wrapperRef.current?.scrollTop || 0;
      if (!rect) return { x: -1, y: -1, type: 'master' };

      const x = 0; // Master only has one column
      const y = Math.floor((e.clientY - rect.top + scrollTop - offsetTranslate) / CELL_HEIGHT);
      return { x, y, type: 'master' };
    },
    [offsetTranslate, wrapperRef]
  );

  // Check if click is on play button
  const isPlayButton = useCallback(
    (e: React.MouseEvent, pos: CellPos): boolean => {
      const rect = canvasHoverRef.current?.getBoundingClientRect();
      const scrollTop = wrapperRef.current?.scrollTop || 0;
      if (!rect) return false;

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top + scrollTop - offsetTranslate - pos.y * CELL_HEIGHT;
      return relX < 20 && relY < 20 && pos.y >= 0;
    },
    [offsetTranslate, wrapperRef]
  );

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const ctxHover = ctxHoverRef.current;
      if (!ctxHover) return;

      const pos = getCellPos(e);

      if (isClicked) {
        clearHover(ctxHover, hoverPos, true);
        drawHover(ctxHover, pos, true);
      } else {
        clearHover(ctxHover, hoverPos, true);
        drawHover(ctxHover, pos, true);
      }

      setHoverPos(pos);
    },
    [getCellPos, hoverPos, isClicked]
  );

  const handleMouseOut = useCallback(() => {
    const ctxHover = ctxHoverRef.current;
    if (ctxHover) {
      clearHover(ctxHover, hoverPos, true);
    }
    setHoverPos({ x: -1, y: -1 });
    setIsClicked(false);
  }, [hoverPos]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCellPos(e);

      // Check if clicking play button
      if (isPlayButton(e, pos)) {
        if (song.master[pos.y]) {
          controller.cueScene(pos.y);
        }
        return;
      }

      setClickPos(pos);
      setIsClicked(true);
    },
    [getCellPos, isPlayButton, song]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCellPos(e);

      if (clickPos.x === pos.x && clickPos.y === pos.y) {
        // Single click - select cell
        if (song.master[pos.y]) {
          onCellSelect(pos);
        }
      }

      setIsClicked(false);
    },
    [getCellPos, clickPos, song, onCellSelect]
  );

  // Handle scroll sync
  const handleScroll = useCallback(() => {
    if (wrapperRef.current) {
      onSyncScroll(wrapperRef.current.scrollTop);
    }
  }, [wrapperRef, onSyncScroll]);

  // Draw selection
  useEffect(() => {
    const ctxHover = ctxHoverRef.current;
    if (!ctxHover || !selectedPos || selectedPos.type !== 'master') return;

    const pattern = song.master[selectedPos.y];
    if (pattern) {
      drawSelection(ctxHover, selectedPos, pattern, DEFAULT_COLOR, true);
    }
  }, [selectedPos, song]);

  return (
    <div
      id="session-master-wrapper"
      ref={wrapperRef}
      onScroll={handleScroll}
    >
      <canvas
        id="session-master"
        ref={canvasRef}
        style={{ height: height + 'px' }}
      />
      <canvas
        id="session-master-on"
        ref={canvasOnRef}
        style={{ height: height + 'px' }}
      />
      <canvas
        id="session-master-hover"
        ref={canvasHoverRef}
        style={{
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
  );
}
