import type { Synth } from '../../Synth';
import { store, selectPatternVersions } from '../../store';

type SynthPattern = (number | 'sustain' | 'end')[];

type SynthPos = {
  x: number;
  y: number;
  x_abs: number;
  y_abs: number;
  note: number;
};

// Cell sprite X offsets in sequencer_cell.png
const CELL_SIZE = 26;
const enum CellType {
  Empty = 0,
  Note = 26,
  Hover = 52,
  Playhead = 78,
  SustainStart = 104,
  SustainMiddle = 130,
  SustainEnd = 156,
}

/**
 * SequencerCanvas: Encapsulates the Canvas pattern editor logic
 * Extracted from jQuery SynthView for reuse in React components
 */
export class SequencerCanvas {
  model: Synth;
  id: number;
  container: HTMLElement;

  canvas_hover: HTMLCanvasElement;
  canvas_on: HTMLCanvasElement;
  canvas_off: HTMLCanvasElement;

  ctx_hover: CanvasRenderingContext2D;
  ctx_on: CanvasRenderingContext2D;
  ctx_off: CanvasRenderingContext2D;

  cell: HTMLImageElement;
  cells_x: number;
  cells_y: number;

  page: number;
  page_total: number;
  last_time: number;

  is_clicked: boolean;
  hover_pos: { x: number; y: number };
  click_pos: { x: number; y: number };
  rect: DOMRect;

  time: number = 0;
  is_sustaining: boolean = false;
  sustain_l: number = 0;
  sustain_r: number = 0;
  is_adding: boolean = false;
  is_step: boolean = false;
  is_nosync: boolean = false;

  unsubscribe?: () => void;

  get pattern(): SynthPattern {
    return this.model.pattern;
  }

  constructor(container: HTMLElement, model: Synth, id: number) {
    this.model = model;
    this.id = id;
    this.container = container;

    this.cells_x = 32;
    this.cells_y = 20;

    // Find canvas elements
    this.canvas_hover = container.querySelector('.table-hover') as HTMLCanvasElement;
    this.canvas_on = container.querySelector('.table-on') as HTMLCanvasElement;
    this.canvas_off = container.querySelector('.table-off') as HTMLCanvasElement;

    if (!this.canvas_hover || !this.canvas_on || !this.canvas_off) {
      throw new Error('Canvas elements not found');
    }

    this.ctx_hover = this.canvas_hover.getContext('2d')!;
    this.ctx_on = this.canvas_on.getContext('2d')!;
    this.ctx_off = this.canvas_off.getContext('2d')!;

    this.cell = new Image();
    this.cell.src = import.meta.env.BASE_URL + 'img/sequencer_cell.png';

    this.page = 0;
    this.page_total = 1;
    this.last_time = 0;
    this.is_clicked = false;
    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };
    this.rect = this.canvas_off.getBoundingClientRect();
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.cell.onload = () => {
        this.initCanvas();
        this.initEvents();
        this.subscribeStore();
        resolve();
      };
    });
  }

  private initCanvas() {
    const width = this.cells_x * CELL_SIZE;
    const height = this.cells_y * CELL_SIZE;

    this.canvas_hover.width = this.canvas_on.width = this.canvas_off.width = width;
    this.canvas_hover.height = this.canvas_on.height = this.canvas_off.height = height;

    this.rect = this.canvas_off.getBoundingClientRect();

    for (let y = 0; y < this.cells_y; y++) {
      for (let x = 0; x < this.cells_x; x++) {
        this.drawCellOff(CellType.Empty, x, y);
      }
    }
    this.refreshPattern();
  }

  private subscribeStore() {
    this.unsubscribe = store.subscribe(selectPatternVersions, (versions) => {
      if (versions[this.id] !== undefined) {
        this.refreshPattern();
      }
    });
  }

  private initEvents() {
    this.canvas_hover.addEventListener('mousemove', this.handleMouseMove);
    this.canvas_hover.addEventListener('mousedown', this.handleMouseDown);
    this.canvas_hover.addEventListener('mouseup', this.handleMouseUp);
    this.canvas_hover.addEventListener('mouseout', this.handleMouseOut);
  }

  private handleMouseMove = (e: MouseEvent) => {
    const pos = this.getPos(e);

    // Show current pos
    if (pos.x !== this.hover_pos.x || pos.y !== this.hover_pos.y) {
      this.clearCellHover(this.hover_pos.x, this.hover_pos.y);
      this.drawCellHover(CellType.Hover, pos.x, pos.y);
      this.hover_pos = pos;
    }

    // Add / Remove notes
    if (this.is_clicked && (pos.x !== this.click_pos.x || pos.y !== this.click_pos.y)) {
      if (this.is_sustaining) {
        this.sustain_l = Math.min(pos.x_abs, this.sustain_l);
        this.sustain_r = Math.max(pos.x_abs, this.sustain_r);
        this.sustainNote(this.sustain_l, this.sustain_r, pos);
      } else {
        if (this.is_adding) {
          this.addNote(pos);
        } else if (this.pattern[pos.x_abs] === pos.note) {
          this.removeNote(pos);
        }
      }
      this.click_pos = pos;
    }
  };

  private handleMouseDown = (e: MouseEvent) => {
    this.is_clicked = true;
    const pos = this.getPos(e);

    if (!this.is_step) {
      // Sustaining mode
      if (this.pattern[pos.x_abs] === 'sustain' || this.pattern[pos.x_abs] === 'end') {
        this.addNote(pos);
        this.sustain_l = this.sustain_r = pos.x_abs;
        this.is_sustaining = true;
      } else {
        this.addNote(pos);
        this.sustain_l = this.sustain_r = pos.x_abs;
        this.is_sustaining = true;
      }
    } else {
      // Step mode
      if (this.pattern[pos.x_abs] === pos.note) {
        this.removeNote(pos);
      } else {
        this.is_adding = true;
        this.addNote(pos);
      }
    }
  };

  private handleMouseUp = () => {
    this.is_clicked = false;
    if (!this.is_step) {
      this.is_sustaining = false;
    } else {
      this.is_adding = false;
    }
  };

  private handleMouseOut = () => {
    this.clearCellHover(this.hover_pos.x, this.hover_pos.y);
    this.hover_pos = { x: -1, y: -1 };
    this.is_clicked = false;
    this.is_adding = false;
  };

  private getPos(e: MouseEvent): SynthPos {
    this.rect = this.canvas_off.getBoundingClientRect();
    const x = Math.floor((e.clientX - this.rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - this.rect.top) / CELL_SIZE);
    return {
      x,
      y,
      x_abs: this.page * this.cells_x + x,
      y_abs: y,
      note: this.cells_y - y,
    };
  }

  // Drawing methods
  private drawCellOn(type: CellType, x: number, y: number) {
    this.ctx_on.drawImage(
      this.cell,
      type, 0, CELL_SIZE, CELL_SIZE,
      x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE
    );
  }

  private drawCellOff(type: CellType, x: number, y: number) {
    this.ctx_off.drawImage(
      this.cell,
      type, 0, CELL_SIZE, CELL_SIZE,
      x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE
    );
  }

  private drawCellHover(type: CellType, x: number, y: number) {
    this.ctx_hover.drawImage(
      this.cell,
      type, 0, CELL_SIZE, CELL_SIZE,
      x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE
    );
  }

  private clearCellOn(x: number, y: number) {
    this.ctx_on.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  private clearCellHover(x: number, y: number) {
    this.ctx_hover.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  private clearColumnOn(x: number) {
    this.ctx_on.clearRect(x * CELL_SIZE, 0, CELL_SIZE, this.cells_y * CELL_SIZE);
  }

  private clearColumnsOn(x: number, width: number) {
    this.ctx_on.clearRect(x * CELL_SIZE, 0, width * CELL_SIZE, this.cells_y * CELL_SIZE);
  }

  private clearAllOn() {
    this.ctx_on.clearRect(0, 0, this.cells_x * CELL_SIZE, this.cells_y * CELL_SIZE);
  }

  // Pattern manipulation
  private addNote(pos: SynthPos) {
    // Handle placing note inside existing sustained note
    if (this.pattern[pos.x_abs] === 'end' || this.pattern[pos.x_abs] === 'sustain') {
      let i = pos.x_abs - 1;
      while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
        i--;
      }

      const prevX = (pos.x_abs - 1) % this.cells_x;
      this.clearColumnOn(prevX);
      const y = this.cells_y + (this.pattern[i] as number);

      const prevNote = this.pattern[pos.x_abs - 1];
      if (typeof prevNote === 'number' && prevNote < 0) {
        this.pattern[pos.x_abs - 1] = -prevNote;
        this.drawCellOn(CellType.Empty, prevX, y);
      } else {
        this.pattern[pos.x_abs - 1] = 'end';
        this.drawCellOn(CellType.SustainEnd, prevX, y);
      }
    }

    // Clear any sustain cells after current position
    let i = pos.x_abs + 1;
    while (this.pattern[i] === 'end' || this.pattern[i] === 'sustain') {
      this.pattern[i] = 0;
      i++;
    }
    this.clearColumnsOn(pos.x, i - pos.x_abs);

    // Place the new note
    this.pattern[pos.x_abs] = pos.note;
    this.clearColumnOn(pos.x);
    this.drawCellOn(CellType.Note, pos.x, pos.y);
  }

  private removeNote(pos: SynthPos) {
    this.pattern[pos.x_abs] = 0;
    this.clearCellOn(pos.x, pos.y);
  }

  private sustainNote(l: number, r: number, pos: SynthPos) {
    if (l === r) {
      this.addNote(pos);
      return;
    }

    this.clearColumnsOn(l % this.cells_x, r - l + 1);

    for (let i = l + 1; i < r; i++) {
      this.pattern[i] = 'sustain';
      this.drawCellOn(CellType.SustainMiddle, i % this.cells_x, pos.y);
    }

    if (this.pattern[l] === 'sustain' || this.pattern[l] === 'end') {
      let i = l - 1;
      while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
        i--;
      }
      const prevX = (l - 1) % this.cells_x;
      this.clearColumnOn(prevX);
      const y = this.cells_y + (this.pattern[i] as number);
      const prevNoteL = this.pattern[l - 1];
      if (typeof prevNoteL === 'number' && prevNoteL < 0) {
        this.pattern[l - 1] = -prevNoteL;
        this.drawCellOn(CellType.Empty, prevX, y);
      } else {
        this.pattern[l - 1] = 'end';
        this.drawCellOn(CellType.SustainEnd, prevX, y);
      }
    }

    const noteR = this.pattern[r];
    if (typeof noteR === 'number' && noteR < 0) {
      const y = this.cells_y + noteR;
      const nextX = (r + 1) % this.cells_x;
      if (this.pattern[r + 1] === 'end') {
        this.pattern[r + 1] = -noteR;
        this.drawCellOn(CellType.Note, nextX, y);
      } else {
        this.pattern[r + 1] = noteR;
        this.drawCellOn(CellType.SustainStart, nextX, y);
      }
    }

    this.pattern[l] = -pos.note;
    this.pattern[r] = 'end';

    this.drawCellOn(CellType.SustainStart, l % this.cells_x, pos.y);
    this.drawCellOn(CellType.SustainEnd, r % this.cells_x, pos.y);
  }

  // Pattern drawing
  drawPattern(time?: number) {
    if (time !== undefined) {
      this.time = time;
    }
    this.page = Math.floor(this.time / this.cells_x);
    this.clearAllOn();

    let lastY = 0;
    for (let x = 0; x < this.cells_x; x++) {
      const note = this.pattern[this.page * this.cells_x + x];
      if (note === 'sustain') {
        this.drawCellOn(CellType.SustainMiddle, x, lastY);
      } else if (note === 'end') {
        this.drawCellOn(CellType.SustainEnd, x, lastY);
        lastY = 0;
      } else if (typeof note === 'number' && note < 0) {
        const y = this.cells_y + note;
        this.drawCellOn(CellType.SustainStart, x, y);
        lastY = y;
      } else if (typeof note === 'number' && note > 0) {
        const y = this.cells_y - note;
        this.drawCellOn(CellType.Note, x, y);
        lastY = y;
      }
    }
  }

  refreshPattern() {
    this.page = 0;
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern(0);
  }

  // Playback position
  playAt(time: number) {
    this.time = time;
    if (this.is_nosync) {
      return;
    }

    if (this.time % this.cells_x === 0) {
      this.drawPattern(this.time);
    }

    const lastX = this.last_time % this.cells_x;
    const currX = this.time % this.cells_x;
    for (let y = 0; y < this.cells_y; y++) {
      this.drawCellOff(CellType.Empty, lastX, y);
      this.drawCellOff(CellType.Playhead, currX, y);
    }

    this.last_time = this.time;
  }

  setIsStep(isStep: boolean) {
    this.is_step = isStep;
  }

  setNoSync(isNoSync: boolean) {
    if (isNoSync === this.is_nosync) return;

    this.is_nosync = isNoSync;
    if (!isNoSync) {
      this.drawPattern(this.time);
    } else {
      const x = this.time % this.cells_x;
      for (let y = 0; y < this.cells_y; y++) {
        this.drawCellOff(CellType.Empty, x, y);
      }
    }
  }

  destroy() {
    this.canvas_hover.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas_hover.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas_hover.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas_hover.removeEventListener('mouseout', this.handleMouseOut);

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
