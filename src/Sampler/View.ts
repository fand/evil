/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';
import { SamplerKeyboardView } from './KeyboardView';
import type { Sampler } from '../Sampler';

declare global {
  interface Window {
    keyboard: any;
  }
}

type SamplerPattern = [note: number, velocity: number][][];

const DEFAULT_PATTERN: SamplerPattern = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

type SamplerPatternObject = { name: string; pattern: SamplerPattern };

type SamplerPos = {
  x: number;
  y: number;
  x_abs: number;
  y_abs: number;
  note: number;
};

export class SamplerView {
  model: Sampler;
  id: number;
  dom: JQuery;
  synth_name: JQuery;
  pattern_name: JQuery;
  synth_type: JQuery;
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
  core: JQuery;
  keyboard: SamplerKeyboardView;
  pattern: SamplerPattern = DEFAULT_PATTERN;
  pattern_obj: SamplerPatternObject;
  page: number;
  page_total: number;
  last_time: number;
  last_page: number;
  is_clicked: boolean;
  hover_pos: { x: number; y: number };
  click_pos: { x: number; y: number };
  rect: DOMRect;
  offset: { x: number; y: number };
  time: number;
  is_adding: boolean;
  is_removing: boolean;
  is_active: boolean;
  sample_now: number;

  constructor(model: Sampler, id: number) {
    this.model = model;
    this.id = id;

    this.dom = $('#tmpl_sampler').clone();
    this.dom.attr('id', 'sampler' + this.id);
    $('#instruments').append(this.dom);

    this.synth_name = this.dom.find('.synth-name');
    this.synth_name.val(this.model.name);
    this.pattern_name = this.dom.find('.pattern-name');
    this.pattern_name.val(this.model.pattern_name);

    // header DOM
    this.synth_type = this.dom.find('.synth-type');

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
    this.cell.src = '/img/sequencer_cell.png';
    this.cell.onload = () => this.initCanvas();

    this.cells_x = 32;
    this.cells_y = 10;

    this.core = this.dom.find('.sampler-core');

    this.keyboard = new SamplerKeyboardView(this);

    // Flags / Params;
    this.pattern_obj = {
      name: this.pattern_name.text(),
      pattern: this.pattern,
    };
    this.page = 0;
    this.page_total = 1;

    this.last_time = 0;
    this.last_page = 0;

    this.is_clicked = false;
    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };

    this.initEvent();
    this.initCanvas();
  }

  initCanvas() {
    this.canvas_hover.width =
      this.canvas_on.width =
      this.canvas_off.width =
        832;
    this.canvas_hover.height =
      this.canvas_on.height =
      this.canvas_off.height =
        260;
    this.rect = this.canvas_off.getBoundingClientRect();
    this.offset = { x: this.rect.left, y: this.rect.top };

    for (
      let i = 0, end = this.cells_y, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      for (
        var j = 0, end1 = this.cells_x, asc1 = 0 <= end1;
        asc1 ? j < end1 : j > end1;
        asc1 ? j++ : j--
      ) {
        this.ctx_off.drawImage(
          this.cell,
          0,
          26,
          26,
          26, // src (x, y, w, h)
          j * 26,
          i * 26,
          26,
          26 // dst (x, y, w, h)
        );
      }
    }
    return this.setPattern(this.pattern_obj);
  }

  getPos(e: JQuery.MouseMoveEvent | JQuery.MouseDownEvent): SamplerPos {
    this.rect = this.canvas_off.getBoundingClientRect();
    const _x = Math.floor((e.clientX - this.rect.left) / 26);
    let _y = Math.floor((e.clientY - this.rect.top) / 26);
    _y = Math.min(9, _y); // assert (note != 0)
    return {
      x: _x,
      y: _y,
      x_abs: this.page * this.cells_x + _x,
      y_abs: _y,
      note: this.cells_y - _y,
    };
  }

  initEvent() {
    // Sequencer
    this.canvas_hover_dom
      .on('mousemove', (e) => {
        const pos = this.getPos(e);
        if (pos !== this.hover_pos) {
          this.ctx_hover.clearRect(
            this.hover_pos.x * 26,
            this.hover_pos.y * 26,
            26,
            26
          );
          this.ctx_hover.drawImage(
            this.cell,
            52,
            26,
            26,
            26,
            pos.x * 26,
            pos.y * 26,
            26,
            26
          );
          this.hover_pos = pos;
        }

        if (this.is_clicked && this.click_pos !== pos) {
          if (this.is_adding) {
            this.addNote(pos, 1.0);
          } else {
            this.removeNote(pos);
          }
          return (this.click_pos = pos);
        }
      })
      .on('mousedown', (e) => {
        this.is_clicked = true;
        const pos = this.getPos(e);

        let remove = false;
        for (var note of Array.from(this.pattern[pos.x_abs])) {
          if (note[0] === pos.note) {
            remove = true;
          }
        }

        if (remove) {
          return this.removeNote(pos);
        } else {
          this.is_adding = true;
          return this.addNote(pos, 1.0);
        }
      })
      .on('mouseup', (e) => {
        this.is_clicked = false;
        this.is_adding = false;
        return (this.is_removing = false);
      })
      .on('mouseout', (e) => {
        this.ctx_hover.clearRect(
          this.hover_pos.x * 26,
          this.hover_pos.y * 26,
          26,
          26
        );
        this.hover_pos = { x: -1, y: -1 };
        this.is_clicked = false;
        this.is_adding = false;
        return (this.is_removing = false);
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
        this.model.setPatternName(this.pattern_name.val() as string)
      );

    this.marker_prev.on('click', () => this.model.player.backward(true));
    this.marker_next.on('click', () => this.model.player.forward());

    this.nosync.on('click', () => this.toggleNoSync());
    this.plus.on('click', () => this.plusPattern());
    return this.minus.on('click', () => {
      if (this.pattern.length > this.cells_x) {
        return this.minusPattern();
      }
    });
  }

  addNote(pos: SamplerPos, gain: number) {
    // if (this.pattern[pos.x_abs] === 0) {
    //   this.pattern[pos.x_abs] = [];
    // }

    // if (!Array.isArray(this.pattern[pos.x_abs])) {
    //   this.pattern[pos.x_abs] = [[this.pattern[pos.x_abs], 1.0]];
    // }

    for (
      let i = 0, end = this.pattern[pos.x_abs].length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (this.pattern[pos.x_abs][i][0] === pos.note) {
        this.pattern[pos.x_abs].splice(i, 1);
      }
    }
    this.pattern[pos.x_abs].push([pos.note, gain]);

    this.model.addNote(pos.x_abs, pos.note, gain);
    return this.ctx_on.drawImage(
      this.cell,
      26,
      26,
      26,
      26,
      pos.x * 26,
      pos.y * 26,
      26,
      26
    );
  }

  removeNote(pos: SamplerPos) {
    for (let i = 0; i < this.pattern[pos.x_abs].length; i++) {
      if (this.pattern[pos.x_abs][i][0] === pos.note) {
        this.pattern[pos.x_abs].splice(i, 1);
      }
    }

    this.ctx_on.clearRect(pos.x * 26, pos.y * 26, 26, 26);
    this.model.removeNote(pos);
  }

  playAt(time: number) {
    this.time = time;
    if (this.is_nosync) {
      return;
    }

    if (this.time % this.cells_x === 0) {
      this.drawPattern(this.time);
    }
    for (
      let i = 0, end = this.cells_y, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.ctx_off.drawImage(
        this.cell,
        0,
        26,
        26,
        26,
        (this.last_time % this.cells_x) * 26,
        i * 26,
        26,
        26
      );
      this.ctx_off.drawImage(
        this.cell,
        78,
        26,
        26,
        26,
        (this.time % this.cells_x) * 26,
        i * 26,
        26,
        26
      );
    }
    return (this.last_time = this.time);
  }

  setPattern(pattern_obj: SamplerPatternObject) {
    this.pattern_obj = pattern_obj;
    this.pattern = this.pattern_obj.pattern;
    this.page = 0;
    this.page_total = this.pattern.length / this.cells_x;
    this.drawPattern(0);
    this.setMarker();
    return this.setPatternName(this.pattern_obj.name);
  }

  drawPattern(time?: number) {
    if (time != null) {
      this.time = time;
    }
    this.page = Math.floor(this.time / this.cells_x);
    this.ctx_on.clearRect(0, 0, 832, 260);

    for (
      let i = 0, end = this.cells_x, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      for (var j of Array.from(this.pattern[this.page * this.cells_x + i])) {
        var y = this.cells_y - j[0];
        this.ctx_on.drawImage(
          this.cell,
          26,
          26,
          26,
          26,
          i * 26,
          y * 26,
          26,
          26
        );
      }
    }
    return this.setMarker();
  }

  plusPattern() {
    if (this.page_total === 8) {
      return;
    }
    this.pattern = this.pattern.concat(DEFAULT_PATTERN);
    this.page_total++;
    this.model.plusPattern();
    this.drawPattern();
    this.minus.removeClass('btn-false').addClass('btn-true');
    if (this.page_total === 8) {
      return this.plus.removeClass('btn-true').addClass('btn-false');
    }
  }

  minusPattern() {
    if (this.page_total === 1) {
      return;
    }
    this.pattern = this.pattern.slice(0, this.pattern.length - this.cells_x);
    this.page_total--;
    this.model.minusPattern();
    this.drawPattern();
    this.plus.removeClass('btn-false').addClass('btn-true');
    if (this.page_total === 1) {
      return this.minus.removeClass('btn-true').addClass('btn-false');
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
    for (let i = 0; i < this.cells_y; i++) {
      this.ctx_off.drawImage(
        this.cell,
        0,
        26,
        26,
        26,
        (this.last_time % this.cells_x) * 26,
        i * 26,
        26,
        26
      );
    }
  }

  activate(i: number) {
    this.is_active = true;
    this.initCanvas();
  }

  inactivate() {
    this.is_active = false;
  }

  setSynthName(name: string) {
    this.synth_name.val(name);
  }

  setPatternName(name: string) {
    this.pattern_name.val(name);
  }

  toggleNoSync() {
    if (this.is_nosync) {
      this.is_nosync = false;
      this.nosync.removeClass('btn-true').addClass('btn-false');
      return this.drawPattern(this.time);
    } else {
      this.is_nosync = true;
      this.nosync.removeClass('btn-false').addClass('btn-true');

      for (let i = 0; i < this.cells_y; i++) {
        this.ctx_off.drawImage(
          this.cell,
          0,
          26,
          26,
          26,
          (this.time % this.cells_x) * 26,
          i * 26,
          26,
          26
        );
      }
    }
  }

  selectSample(sample_now: number) {
    this.sample_now = sample_now;
    this.keyboard.selectSample(this.sample_now);
    return this.model.selectSample(this.sample_now);
  }
}
