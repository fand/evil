import { CELL_SIZE, CellType } from './types';

/**
 * Initialize canvas with proper dimensions
 */
export function initCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return ctx;
}

/**
 * Draw a cell on the canvas using sprite sheet
 */
export function drawCell(
  ctx: CanvasRenderingContext2D,
  cellImage: HTMLImageElement,
  type: CellType,
  x: number,
  y: number
): void {
  ctx.drawImage(
    cellImage,
    type,
    0,
    CELL_SIZE,
    CELL_SIZE,
    x * CELL_SIZE,
    y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

/**
 * Clear a single cell
 */
export function clearCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/**
 * Clear a column of cells
 */
export function clearColumn(
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number
): void {
  ctx.clearRect(x * CELL_SIZE, 0, CELL_SIZE, height * CELL_SIZE);
}

/**
 * Clear multiple columns
 */
export function clearColumns(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  height: number
): void {
  ctx.clearRect(x * CELL_SIZE, 0, width * CELL_SIZE, height * CELL_SIZE);
}

/**
 * Clear entire canvas
 */
export function clearAll(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);
}

/**
 * Calculate position from mouse event
 */
export function getPosFromEvent(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  page: number,
  cellsX: number,
  cellsY: number
): { x: number; y: number; x_abs: number; y_abs: number; note: number } {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  return {
    x,
    y,
    x_abs: page * cellsX + x,
    y_abs: y,
    note: cellsY - y,
  };
}
