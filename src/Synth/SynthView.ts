import $ from 'jquery';
import { KeyboardView } from './KeyboardView';
import type { Synth } from '../Synth';
import type { Keyboard } from '../Keyboard';

declare global {
  interface Window {
    keyboard: Keyboard;
  }
}

// TODO: merge with SamplerPattern
export type SynthPattern = (number | 'sustain' | 'end')[];

export type SynthPatternObject = { name: string; pattern: SynthPattern };

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

export class SynthView {
  model: Synth;
  id: number;
  dom: JQuery;
  synth_name: JQuery;
  pattern_name: JQuery;
  synth_type: JQuery;
  pencil: JQuery;
  step: JQuery;
  is_step: boolean;
  header: JQuery;
  markers: JQuery;
  pos_markers: JQuery;
  marker_prev: JQuery;
  marker_next: JQuery;
  plus: JQuery;
  minus: JQuery;
  nosync: JQuery;
  is_nosync: boolean;
  table_wrapper: JQuery;
  canvas_hover_dom: JQuery;
  canvas_on_dom: JQuery;
  canvas_off_dom: JQuery;
  canvas_hover: HTMLCanvasElement;
  canvas_on: HTMLCanvasElement;
  canvas_off: HTMLCanvasElement;
  ctx_hover: CanvasRenderingContext2D;
  ctx_on: CanvasRenderingContext2D;
  ctx_off: CanvasRenderingContext2D;
  cell: HTMLImageElement;
  cells_x: number;
  cells_y: number;
  btn_fold: JQuery;
  core: JQuery;
  is_panel_opened: boolean;
  btn_fx: JQuery;
  fx: JQuery;
  is_fx_view: boolean;
  keyboard: KeyboardView;
  page: number;

  // Reference model's pattern (single source of truth)
  get pattern(): SynthPattern {
    return this.model.pattern;
  }

  get pattern_obj(): SynthPatternObject {
    return this.model.pattern_obj;
  }
  page_total: number;
  last_time: number;
  last_page: number;
  is_clicked: boolean;
  hover_pos: { x: number; y: number };
  click_pos: { x: number; y: number };
  rect: DOMRect;
  offset: { x: number; y: number };
  time: number = 0;
  is_sustaining: boolean = false;
  sustain_l: number = 0;
  sustain_r: number = 0;
  is_adding: boolean = false;
  is_active: boolean = false;

  constructor(model: Synth, id: number) {
    this.model = model;
    this.id = id;
    this.dom = $('#tmpl_synth').clone();
    this.dom.attr('id', 'synth' + this.id);
    $('#instruments').append(this.dom);

    this.synth_name = this.dom.find('.synth-name');
    this.synth_name.val(this.model.name);
    this.pattern_name = this.dom.find('.pattern-name');
    this.pattern_name.val(this.model.pattern_name);

    // header DOM
    this.synth_type = this.dom.find('.synth-type');
    this.pencil = this.dom.find('.sequencer-pencil');
    this.step = this.dom.find('.sequencer-step');
    this.is_step = false;

    this.header = this.dom.find('.header');
    this.markers = this.dom.find('.markers');
    this.pos_markers = this.dom.find('.marker'); // list of list of markers
    this.marker_prev = this.dom.find('.marker-prev');
    this.marker_next = this.dom.find('.marker-next');
    this.plus = this.dom.find('.pattern-plus');
    this.minus = this.dom.find('.pattern-minus');
    this.nosync = this.dom.find('.pattern-nosync');
    this.is_nosync = false;
    this.setMarker();

    // table DOM
    this.table_wrapper = this.dom.find('.sequencer-table');
    this.canvas_hover_dom = this.dom.find('.table-hover');
    this.canvas_on_dom = this.dom.find('.table-on');
    this.canvas_off_dom = this.dom.find('.table-off');

    this.canvas_hover = this.canvas_hover_dom[0] as HTMLCanvasElement;
    this.canvas_on = this.canvas_on_dom[0] as HTMLCanvasElement;
    this.canvas_off = this.canvas_off_dom[0] as HTMLCanvasElement;

    this.ctx_hover = this.canvas_hover.getContext('2d')!;
    this.ctx_on = this.canvas_on.getContext('2d')!;
    this.ctx_off = this.canvas_off.getContext('2d')!;

    this.cell = new Image();
    this.cell.src = import.meta.env.BASE_URL + 'img/sequencer_cell.png';
    this.cell.onload = () => this.initCanvas();

    this.cells_x = 32;
    this.cells_y = 20;

    this.btn_fold = this.dom.find('.btn-fold-core');
    this.core = this.dom.find('.synth-core');
    this.is_panel_opened = true;

    this.btn_fx = this.dom.find('.btn-fx-view');
    this.fx = this.dom.find('.synth-fx');
    this.is_fx_view = false;

    this.keyboard = new KeyboardView(this);

    // Flags / Params
    this.page = 0;
    this.page_total = 1;

    this.last_time = 0;
    this.last_page = 0;

    this.is_clicked = false;
    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };

    // Initialize rect and offset before initCanvas is called asynchronously
    this.rect = this.canvas_off.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    this.initEvent();
  }

  initCanvas() {
    const width = this.cells_x * CELL_SIZE;
    const height = this.cells_y * CELL_SIZE;
    this.canvas_hover.width =
      this.canvas_on.width =
      this.canvas_off.width =
        width;
    this.canvas_hover.height =
      this.canvas_on.height =
      this.canvas_off.height =
        height;
    this.rect = this.canvas_off.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    for (let y = 0; y < this.cells_y; y++) {
      for (let x = 0; x < this.cells_x; x++) {
        this.drawCellOff(CellType.Empty, x, y);
      }
    }
    this.setPattern(this.pattern_obj);
  }

  // ========================================
  // Canvas drawing helpers
  // ========================================

  private drawCellOn(type: CellType, x: number, y: number) {
    this.ctx_on.drawImage(
      this.cell,
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

  private drawCellOff(type: CellType, x: number, y: number) {
    this.ctx_off.drawImage(
      this.cell,
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

  private drawCellHover(type: CellType, x: number, y: number) {
    this.ctx_hover.drawImage(
      this.cell,
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

  private clearCellOn(x: number, y: number) {
    this.ctx_on.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  private clearCellHover(x: number, y: number) {
    this.ctx_hover.clearRect(
      x * CELL_SIZE,
      y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }

  private clearColumnOn(x: number) {
    this.ctx_on.clearRect(
      x * CELL_SIZE,
      0,
      CELL_SIZE,
      this.cells_y * CELL_SIZE
    );
  }

  private clearColumnsOn(x: number, width: number) {
    this.ctx_on.clearRect(
      x * CELL_SIZE,
      0,
      width * CELL_SIZE,
      this.cells_y * CELL_SIZE
    );
  }

  private clearAllOn() {
    this.ctx_on.clearRect(
      0,
      0,
      this.cells_x * CELL_SIZE,
      this.cells_y * CELL_SIZE
    );
  }

  // ========================================

  getPos(e: JQuery.MouseEventBase): SynthPos {
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

  initEvent() {
    // Sequencer
    this.canvas_hover_dom
      .on('mousemove', (e) => {
        const pos = this.getPos(e);

        // Show current pos.
        if (pos !== this.hover_pos) {
          this.clearCellHover(this.hover_pos.x, this.hover_pos.y);
          this.drawCellHover(CellType.Hover, pos.x, pos.y);
          this.hover_pos = pos;
        }

        // Add / Remove notes.
        if (this.is_clicked && this.click_pos !== pos) {
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
      })
      .on('mousedown', (e) => {
        this.is_clicked = true;
        const pos = this.getPos(e);

        if (!this.is_step) {
          // sustaining
          if (
            this.pattern[pos.x_abs] === 'sustain' ||
            this.pattern[pos.x_abs] === 'end'
          ) {
            this.addNote(pos);
            this.sustain_l = this.sustain_r = pos.x_abs;
            this.is_sustaining = true;
            // not sustaining
          } else {
            this.addNote(pos);
            this.sustain_l = this.sustain_r = pos.x_abs;
            this.is_sustaining = true;
          }
        } else {
          if (this.pattern[pos.x_abs] === pos.note) {
            this.removeNote(pos);
          } else {
            this.is_adding = true;
            this.addNote(pos);
          }
        }
      })
      .on('mouseup', () => {
        this.is_clicked = false;
        if (!this.is_step) {
          this.is_sustaining = false;
        } else {
          this.is_adding = false;
        }
      })
      .on('mouseout', () => {
        this.clearCellHover(this.hover_pos.x, this.hover_pos.y);
        this.hover_pos = { x: -1, y: -1 };
        this.is_clicked = false;
        this.is_adding = false;
      });

    // Headers
    this.synth_type.on('change', () =>
      this.model.changeSynth(this.synth_type.val() as string)
    );
    this.synth_name
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput())
      .on('change', () =>
        this.model.setSynthName(this.synth_name.val() as string)
      );
    this.pattern_name
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput())
      .on('change', () =>
        this.model.inputPatternName(this.pattern_name.val() as string)
      );
    this.pencil.on('click', () => this.pencilMode());
    this.step.on('click', () => this.stepMode());

    this.marker_prev.on('click', () => this.model.player.backward(true));
    this.marker_next.on('click', () => this.model.player.forward());

    this.nosync.on('click', () => this.toggleNoSync());
    this.plus.on('click', () => this.plusPattern());
    this.minus.on('click', () => {
      if (this.pattern.length > this.cells_x) {
        this.minusPattern();
      }
    });

    this.btn_fold.on('mousedown', () => {
      if (this.is_panel_opened) {
        this.core.css('height', '0px');
        this.table_wrapper.css('height', '524px');
        this.btn_fold
          .css({ top: '-22px', padding: '0px 5px 0px 0px' })
          .removeClass('fa-angle-down')
          .addClass('fa-angle-up');
        this.is_panel_opened = false;
      } else {
        this.core.css('height', '280px');
        this.table_wrapper.css('height', '262px');
        this.btn_fold
          .css({ top: '0px', padding: '5px 5px 5px 5px' })
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');
        this.is_panel_opened = true;
      }
    });

    this.btn_fx.on('mousedown', () => {
      if (this.is_fx_view) {
        this.is_fx_view = false;
      } else {
        this.core.css('height', '280px');
        this.table_wrapper.css('height', '262px');
        this.btn_fold
          .css({ top: '0px', padding: '5px 5px 5px 5px' })
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');
        this.is_panel_opened = true;
      }
    });
  }

  addNote(pos: SynthPos) {
    // ========================================
    // 1. Handle placing note inside existing sustained note
    //    → Truncate the sustain at previous position
    // ========================================
    if (
      this.pattern[pos.x_abs] === 'end' ||
      this.pattern[pos.x_abs] === 'sustain'
    ) {
      // Find the start of the sustained note (negative value)
      let i = pos.x_abs - 1;
      while (this.pattern[i] === 'sustain' || this.pattern[i] === 'end') {
        i--;
      }

      const prevX = (pos.x_abs - 1) % this.cells_x;
      this.clearColumnOn(prevX);
      // Calculate Y position from sustain start (negative, so add)
      const y = this.cells_y + (this.pattern[i] as number);

      const prevNote = this.pattern[pos.x_abs - 1];
      if (typeof prevNote === 'number' && prevNote < 0) {
        // Previous cell is sustain start → convert to regular note (flip sign)
        this.pattern[pos.x_abs - 1] = -prevNote;
        this.drawCellOn(CellType.Empty, prevX, y);
      } else {
        // Previous cell is 'sustain' → convert to 'end' to terminate
        this.pattern[pos.x_abs - 1] = 'end';
        this.drawCellOn(CellType.SustainEnd, prevX, y);
      }
    }

    // ========================================
    // 2. Clear any sustain cells after current position
    // ========================================
    let i = pos.x_abs + 1;
    while (this.pattern[i] === 'end' || this.pattern[i] === 'sustain') {
      this.pattern[i] = 0;
      i++;
    }
    this.clearColumnsOn(pos.x, i - pos.x_abs);

    // ========================================
    // 3. Place the new note
    // ========================================
    this.pattern[pos.x_abs] = pos.note;
    this.clearColumnOn(pos.x);
    this.drawCellOn(CellType.Note, pos.x, pos.y);
  }

  removeNote(pos: SynthPos) {
    this.pattern[pos.x_abs] = 0;
    this.clearCellOn(pos.x, pos.y);
  }

  sustainNote(l: number, r: number, pos: SynthPos) {
    if (l === r) {
      this.addNote(pos);
      return;
    }

    // Clear cells from l to r
    this.clearColumnsOn(l % this.cells_x, r - l + 1);

    // Mark cells between l and r as sustain
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

  endSustain(time?: number) {
    if (this.is_sustaining && time !== undefined) {
      const note = this.pattern[time - 1];
      if (note === 'sustain') {
        this.pattern[time - 1] = 'end';
      } else if (typeof note === 'number') {
        this.pattern[time - 1] = note * -1;
      }

      this.is_sustaining = false;
    }
  }

  // Show the position bar.
  playAt(time: number) {
    this.time = time;
    if (this.is_nosync) {
      return;
    }

    if (this.time % this.cells_x === 0) {
      this.endSustain();
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

  setPattern() {
    // pattern_obj is now accessed via getter from model
    this.page = 0;
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern(0);
    this.setMarker();
    this.setPatternName(this.pattern_obj.name);
  }

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
      } else if (note < 0) {
        const y = this.cells_y + note;
        this.drawCellOn(CellType.SustainStart, x, y);
        lastY = y;
      } else {
        const y = this.cells_y - note;
        this.drawCellOn(CellType.Note, x, y);
        lastY = y;
      }
    }
    this.setMarker();
  }

  plusPattern() {
    if (this.page_total === 8) {
      return;
    }
    // model.plusPattern modifies model.pattern (accessed via getter)
    this.model.plusPattern();
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern();
    this.minus.removeClass('btn-false').addClass('btn-true');

    if (this.page_total === 8) {
      this.plus.removeClass('btn-true').addClass('btn-false');
    }
  }

  minusPattern() {
    if (this.page_total === 1) {
      return;
    }

    // model.minusPattern modifies model.pattern (accessed via getter)
    this.model.minusPattern();
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern();
    this.plus.removeClass('btn-false').addClass('btn-true');

    if (this.page_total === 1) {
      this.minus.removeClass('btn-true').addClass('btn-false');
    }
  }

  setMarker() {
    this.pos_markers
      .filter((i) => i < this.page_total)
      .addClass('marker-active');
    this.pos_markers
      .filter((i) => this.page_total <= i)
      .removeClass('marker-active');
    this.pos_markers
      .removeClass('marker-now')
      .eq(this.page)
      .addClass('marker-now');
    this.markers.find('.marker-pos').text(this.page + 1);
    this.markers.find('.marker-total').text(this.page_total);

    this.pos_markers
      .filter((i: number) => i < this.page_total)
      .each((i: number) => {
        this.pos_markers.eq(i).on('mousedown', () => {
          if (this.page < i) {
            while (this.page !== i) {
              this.model.player.forward();
            }
          }
          if (i < this.page) {
            while (this.page !== i) {
              this.model.player.backward(true);
            }
          } // force
        });
      });
  }

  play() {}
  stop() {
    const x = this.last_time % this.cells_x;
    for (let y = 0; y < this.cells_y; y++) {
      this.drawCellOff(CellType.Empty, x, y);
    }
  }

  activate() {
    this.is_active = true;
    this.initCanvas();
  }

  deactivate() {
    this.is_active = false;
  }

  setSynthName(name: string) {
    this.synth_name.val(name);
  }

  setPatternName(name: string) {
    this.pattern_name.val(name);
    this.pattern_obj.name = name;
  }

  toggleNoSync() {
    if (this.is_nosync) {
      this.is_nosync = false;
      this.nosync.removeClass('btn-true').addClass('btn-false');
      this.drawPattern(this.time);
    } else {
      this.is_nosync = true;
      this.nosync.removeClass('btn-false').addClass('btn-true');
      const x = this.time % this.cells_x;
      for (let y = 0; y < this.cells_y; y++) {
        this.drawCellOff(CellType.Empty, x, y);
      }
    }
  }

  pencilMode() {
    this.is_step = false;
    this.pencil.removeClass('btn-false').addClass('btn-true');
    this.step.removeClass('btn-true').addClass('btn-false');
  }

  stepMode() {
    this.is_step = true;
    this.step.removeClass('btn-false').addClass('btn-true');
    this.pencil.removeClass('btn-true').addClass('btn-false');
  }

  changeScale(scale: number[]) {
    this.keyboard.changeScale(scale);
  }
}
