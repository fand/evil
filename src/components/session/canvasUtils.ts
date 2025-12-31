import {
  CELL_WIDTH,
  CELL_HEIGHT,
  MASTER_WIDTH,
  OFFSET_Y,
  FONT_SIZE,
  DEFAULT_COLOR,
  COLOR_SCHEMES,
  type CellPos,
  type Pattern,
  type ColorScheme,
} from './types';

/**
 * Initialize canvas with proper dimensions and font
 */
export function initCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D {
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d')!;
  ctx.translate(0, OFFSET_Y);
  ctx.font = `${FONT_SIZE}px "MS PGothic", "Hiragino Kaku Gothic Pro W3", sans-serif`;

  return ctx;
}

/**
 * Clear a single cell
 */
export function clearCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isMaster: boolean = false
): void {
  if (isMaster) {
    ctx.clearRect(0, y * CELL_HEIGHT, MASTER_WIDTH, CELL_HEIGHT);
  } else {
    ctx.clearRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
  }
}

/**
 * Draw an empty cell
 */
export function drawEmptyCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: ColorScheme = DEFAULT_COLOR,
  isMaster: boolean = false
): void {
  clearCell(ctx, x, y, isMaster);
  ctx.strokeStyle = color[0];
  ctx.lineWidth = 1;

  if (isMaster) {
    ctx.strokeRect(2, y * CELL_HEIGHT + 2, MASTER_WIDTH - 2, CELL_HEIGHT - 2);
  } else {
    ctx.strokeRect(
      x * CELL_WIDTH + 2,
      y * CELL_HEIGHT + 2,
      CELL_WIDTH - 2,
      CELL_HEIGHT - 2
    );
  }
}

/**
 * Draw a pattern cell (track or master)
 */
export function drawPatternCell(
  ctx: CanvasRenderingContext2D,
  pattern: { name: string },
  x: number,
  y: number,
  imgPlay: HTMLImageElement,
  color: ColorScheme = DEFAULT_COLOR,
  isMaster: boolean = false
): void {
  clearCell(ctx, x, y, isMaster);

  ctx.strokeStyle = color[1];
  ctx.lineWidth = 1;

  if (isMaster) {
    ctx.strokeRect(2, y * CELL_HEIGHT + 2, MASTER_WIDTH - 2, CELL_HEIGHT - 2);
    ctx.drawImage(imgPlay, 0, 0, 18, 18, 3, y * CELL_HEIGHT + 3, 16, 15);
    ctx.fillStyle = color[1];
    ctx.fillText(pattern.name, 24, (y + 1) * CELL_HEIGHT - 6);
  } else {
    ctx.strokeRect(
      x * CELL_WIDTH + 2,
      y * CELL_HEIGHT + 2,
      CELL_WIDTH - 2,
      CELL_HEIGHT - 2
    );
    ctx.drawImage(
      imgPlay,
      0,
      0,
      18,
      18,
      x * CELL_WIDTH + 3,
      y * CELL_HEIGHT + 3,
      16,
      15
    );
    ctx.fillStyle = color[1];
    ctx.fillText(pattern.name, x * CELL_WIDTH + 24, (y + 1) * CELL_HEIGHT - 6);
  }
}

/**
 * Draw track name header
 */
export function drawTrackName(
  ctx: CanvasRenderingContext2D,
  x: number,
  name: string,
  color: ColorScheme = DEFAULT_COLOR
): void {
  ctx.fillStyle = color[1];
  ctx.fillRect(x * CELL_WIDTH + 2, -20, CELL_WIDTH - 2, 18);

  const m = ctx.measureText(name);
  const dx = (CELL_WIDTH - m.width) / 2;
  const dy = (OFFSET_Y - FONT_SIZE) / 2;

  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 1;
  ctx.fillStyle = '#fff';
  ctx.fillText(name, x * CELL_WIDTH + dx + 2, -dy - 3);
  ctx.shadowBlur = 0;
}

/**
 * Draw "MASTER" header
 */
export function drawMasterName(ctx: CanvasRenderingContext2D): void {
  const m = ctx.measureText('MASTER');
  const dx = (CELL_WIDTH - m.width) / 2;
  const dy = (OFFSET_Y - FONT_SIZE) / 2;

  ctx.fillStyle = '#ccc';
  ctx.fillText('MASTER', dx + 2, -dy - 3);
}

/**
 * Draw active indicator (play button highlight)
 */
export function drawActiveIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  imgPlay: HTMLImageElement,
  isMaster: boolean = false
): void {
  if (isMaster) {
    ctx.drawImage(imgPlay, 36, 0, 18, 18, 3, y * CELL_HEIGHT + 3, 16, 15);
  } else {
    ctx.drawImage(
      imgPlay,
      36,
      0,
      18,
      18,
      x * CELL_WIDTH + 3,
      y * CELL_HEIGHT + 3,
      16,
      15
    );
  }
}

/**
 * Draw hover highlight
 */
export function drawHover(
  ctx: CanvasRenderingContext2D,
  pos: CellPos,
  isMaster: boolean = false
): void {
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  if (isMaster) {
    ctx.fillRect(pos.x * CELL_WIDTH, pos.y * CELL_HEIGHT, MASTER_WIDTH, CELL_HEIGHT);
  } else {
    ctx.fillRect(pos.x * CELL_WIDTH, pos.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
  }
}

/**
 * Clear hover highlight
 */
export function clearHover(
  ctx: CanvasRenderingContext2D,
  pos: CellPos,
  isMaster: boolean = false
): void {
  if (isMaster) {
    ctx.clearRect(0, pos.y * CELL_HEIGHT, MASTER_WIDTH + 2, CELL_HEIGHT + 2);
  } else {
    ctx.clearRect(
      pos.x * CELL_WIDTH,
      pos.y * CELL_HEIGHT,
      CELL_WIDTH + 2,
      CELL_HEIGHT + 2
    );
  }
}

/**
 * Draw selection highlight
 */
export function drawSelection(
  ctx: CanvasRenderingContext2D,
  pos: CellPos,
  pattern: Pattern | { name: string } | undefined,
  color: ColorScheme = DEFAULT_COLOR,
  isMaster: boolean = false
): void {
  if (isMaster) {
    ctx.fillStyle = color[5];
    ctx.fillRect(2, pos.y * CELL_HEIGHT + 2, MASTER_WIDTH - 2, CELL_HEIGHT - 2);
    if (pattern) {
      ctx.fillStyle = color[1];
      ctx.fillText(pattern.name, pos.x * MASTER_WIDTH + 24, (pos.y + 1) * CELL_HEIGHT - 6);
    }
  } else {
    ctx.fillStyle = color[5];
    ctx.fillRect(
      pos.x * CELL_WIDTH + 2,
      pos.y * CELL_HEIGHT + 2,
      CELL_WIDTH - 2,
      CELL_HEIGHT - 2
    );
    if (pattern) {
      ctx.fillStyle = color[1];
      ctx.fillText(pattern.name, pos.x * CELL_WIDTH + 24, (pos.y + 1) * CELL_HEIGHT - 6);
    }
  }
}

/**
 * Get color scheme for track type
 */
export function getColorScheme(type: string): ColorScheme {
  return COLOR_SCHEMES[type as keyof typeof COLOR_SCHEMES] || DEFAULT_COLOR;
}

/**
 * Calculate cell position from mouse event
 */
export function getCellFromEvent(
  e: React.MouseEvent,
  rect: DOMRect,
  scrollLeft: number,
  scrollTop: number,
  offsetTranslate: number,
  isMaster: boolean = false
): CellPos {
  const x = Math.floor((e.clientX - rect.left + scrollLeft) / CELL_WIDTH);
  const y = Math.floor((e.clientY - rect.top + scrollTop - offsetTranslate) / CELL_HEIGHT);
  return { x, y, type: isMaster ? 'master' : 'tracks' };
}

/**
 * Check if click is on play button area
 */
export function isPlayButtonClick(
  e: React.MouseEvent,
  rect: DOMRect,
  scrollLeft: number,
  scrollTop: number,
  offsetTranslate: number
): boolean {
  const x = Math.floor((e.clientX - rect.left + scrollLeft) / CELL_WIDTH);
  const y = Math.floor((e.clientY - rect.top + scrollTop - offsetTranslate) / CELL_HEIGHT);

  const relX = e.clientX - rect.left + scrollLeft - x * CELL_WIDTH;
  const relY = e.clientY - rect.top + scrollTop - offsetTranslate - y * CELL_HEIGHT;

  return relX < 20 && relY < 20;
}
