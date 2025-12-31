import $ from 'jquery';
import type { Session } from './Session';
import type { Song } from './Song';
import type { Keyboard } from './Keyboard';
import { store, selectScenePos, selectCurrentCells } from './store';
import { controller } from './controller';

declare global {
  interface Window {
    keyboard: Keyboard;
  }
}

export class SessionView {
  private _session: Session;

  get song(): Song {
    return this._session.song;
  }
  wrapper_mixer: JQuery;
  wrapper_master: JQuery;
  wrapper_tracks: JQuery;
  wrapper_tracks_sub: JQuery;
  canvas_tracks_dom: JQuery;
  canvas_master_dom: JQuery;
  canvas_tracks_on_dom: JQuery;
  canvas_master_on_dom: JQuery;
  canvas_tracks_hover_dom: JQuery;
  canvas_master_hover_dom: JQuery;
  canvas_tracks: HTMLCanvasElement;
  canvas_master: HTMLCanvasElement;
  canvas_tracks_on: HTMLCanvasElement;
  canvas_master_on: HTMLCanvasElement;
  canvas_tracks_hover: HTMLCanvasElement;
  canvas_master_hover: HTMLCanvasElement;
  ctx_tracks: CanvasRenderingContext2D;
  ctx_master: CanvasRenderingContext2D;
  ctx_tracks_on: CanvasRenderingContext2D;
  ctx_master_on: CanvasRenderingContext2D;
  ctx_tracks_hover: CanvasRenderingContext2D;
  ctx_master_hover: CanvasRenderingContext2D;
  w: number;
  h: number;
  w_master: number;
  color: string[];
  color_schemes: { [key: string]: string[] };
  track_color: string[][];
  img_play: HTMLImageElement;
  last_active: number[];
  current_cells: (number | undefined)[];
  hover_pos: { x: number; y: number; type?: string };
  click_pos: { x: number; y: number; type?: string };
  select_pos: { x: number; y: number; type: string };
  last_clicked: number;
  dialog: JQuery;
  dialog_wrapper: JQuery;
  dialog_close: JQuery;
  btn_save: JQuery;
  btn_clear: JQuery;
  song_info: JQuery;
  song_title: JQuery;
  song_creator: JQuery;
  social_twitter: JQuery;
  social_facebook: JQuery;
  social_hatena: JQuery;
  offset_y: number = 20;
  font_size: number = 12;
  rect_tracks: DOMRect;
  rect_master: DOMRect;
  offset_translate: number = 720;
  is_clicked: boolean = false;
  scene_pos: number = 0;

  constructor(model: Session) {
    // Keep session reference for song getter (controller not available at construction)
    this._session = model;

    // DOMs for session view.
    this.wrapper_mixer = $('#mixer-tracks');
    this.wrapper_master = $('#session-master-wrapper');
    this.wrapper_tracks = $('#session-tracks-wrapper');
    this.wrapper_tracks_sub = $('#session-tracks-wrapper-sub');

    this.canvas_tracks_dom = $('#session-tracks');
    this.canvas_master_dom = $('#session-master');
    this.canvas_tracks_on_dom = $('#session-tracks-on');
    this.canvas_master_on_dom = $('#session-master-on');
    this.canvas_tracks_hover_dom = $('#session-tracks-hover');
    this.canvas_master_hover_dom = $('#session-master-hover');

    this.canvas_tracks = this.canvas_tracks_dom[0] as HTMLCanvasElement;
    this.canvas_master = this.canvas_master_dom[0] as HTMLCanvasElement;
    this.canvas_tracks_on = this.canvas_tracks_on_dom[0] as HTMLCanvasElement;
    this.canvas_master_on = this.canvas_master_on_dom[0] as HTMLCanvasElement;
    this.canvas_tracks_hover = this
      .canvas_tracks_hover_dom[0] as HTMLCanvasElement;
    this.canvas_master_hover = this
      .canvas_master_hover_dom[0] as HTMLCanvasElement;

    this.ctx_tracks = this.canvas_tracks.getContext('2d')!;
    this.ctx_master = this.canvas_master.getContext('2d')!;
    this.ctx_tracks_on = this.canvas_tracks_on.getContext('2d')!;
    this.ctx_master_on = this.canvas_master_on.getContext('2d')!;
    this.ctx_tracks_hover = this.canvas_tracks_hover.getContext('2d')!;
    this.ctx_master_hover = this.canvas_master_hover.getContext('2d')!;

    // dimensions for cells in canvas
    this.w = 70;
    this.h = 20;
    this.w_master = 80;
    this.color = [
      'rgba(200, 200, 200, 1.0)',
      'rgba(  0, 220, 250, 0.7)',
      'rgba(100, 230, 255, 0.7)',
      'rgba(200, 200, 200, 1.0)',
      'rgba(255, 255, 255, 1.0)',
      'rgba(100, 230, 255, 0.2)',
    ];
    this.color_schemes = {
      REZ: [
        'rgba(200, 200, 200, 1.0)',
        'rgba(  0, 220, 250, 0.7)',
        'rgba(100, 230, 255, 0.7)',
        'rgba(200, 200, 200, 1.0)',
        'rgba(255, 255, 255, 1.0)',
        'rgba(100, 230, 255, 0.2)',
      ],
      SAMPLER: [
        'rgba(230, 230, 230, 1.0)',
        'rgba(  255, 100, 192, 0.7)',
        'rgba(255, 160, 216, 0.7)',
        'rgba(200, 200, 200, 1.0)',
        'rgba(255, 255, 255, 1.0)',
        'rgba(255, 160, 216, 0.2)',
      ],
    };

    this.track_color = [0, 1, 2, 3, 4, 5, 6, 7].map(() => this.color);

    this.img_play = new Image();
    this.img_play.src = import.meta.env.BASE_URL + 'img/play.png';
    this.img_play.onload = () => this.initCanvas();

    this.last_active = [];
    this.current_cells = [];

    this.hover_pos = { x: -1, y: -1 };
    this.click_pos = { x: -1, y: -1 };
    this.select_pos = { x: 0, y: 0, type: 'master' };
    this.last_clicked = performance.now();

    // Initialize rect before initCanvas is called asynchronously
    this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
    this.rect_master = this.canvas_master_hover.getBoundingClientRect();

    // DOMs to save songs.
    this.dialog = $('#dialog');
    this.dialog_wrapper = $('#dialog-wrapper');
    this.dialog_close = this.dialog.find('.dialog-close');
    this.btn_save = $('#btn-save');
    this.btn_clear = $('#btn-clear');
    this.song_info = $('#song-info');
    this.song_title = this.song_info.find('#song-title');
    this.song_creator = this.song_info.find('#song-creator');

    this.social_twitter = $('#twitter');
    this.social_facebook = $('#facebook');
    this.social_hatena = $('#hatena');

    this.subscribeStore();
  }

  subscribeStore() {
    // Subscribe to scenePos changes
    store.subscribe(selectScenePos, (scenePos) => {
      const currentCells = store.getState().playback.currentCells;
      this.drawScene(scenePos, currentCells);
    });

    // Subscribe to currentCells changes
    store.subscribe(selectCurrentCells, (currentCells) => {
      const scenePos = store.getState().playback.scenePos;
      this.drawScene(scenePos, currentCells);
    });
  }

  initCanvas() {
    this.canvas_tracks.width =
      this.canvas_tracks_on.width =
      this.canvas_tracks_hover.width =
        this.w * 8 + 1;
    this.canvas_master.width =
      this.canvas_master_on.width =
      this.canvas_master_hover.width =
        this.w + 11;
    this.canvas_tracks.height =
      this.canvas_tracks_on.height =
      this.canvas_tracks_hover.height =
        this.h * 11 + 10;
    this.canvas_master.height =
      this.canvas_master_on.height =
      this.canvas_master_hover.height =
        this.h * 11 + 10;

    this.offset_y = 20;
    this.ctx_tracks.translate(0, this.offset_y);
    this.ctx_master.translate(0, this.offset_y);
    this.ctx_tracks_on.translate(0, this.offset_y);
    this.ctx_master_on.translate(0, this.offset_y);
    this.ctx_tracks_hover.translate(0, this.offset_y);
    this.ctx_master_hover.translate(0, this.offset_y);

    this.font_size = 12;
    this.ctx_tracks.font = this.ctx_master.font =
      this.font_size + 'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"';
    this.rect_tracks = this.canvas_tracks_hover.getBoundingClientRect();
    this.rect_master = this.canvas_master_hover.getBoundingClientRect();
    this.offset_translate = 700 + this.offset_y;

    return this.initEvent();
  }

  resize() {
    this.ctx_tracks.translate(0, -this.offset_y);
    this.ctx_master.translate(0, -this.offset_y);
    this.ctx_tracks_on.translate(0, -this.offset_y);
    this.ctx_master_on.translate(0, -this.offset_y);
    this.ctx_tracks_hover.translate(0, -this.offset_y);
    this.ctx_master_hover.translate(0, -this.offset_y);

    const w_new = Math.max(this.song.tracks.length, 8) * this.w + 1;
    const h_new = Math.max(this.song.length + 2, 11) * this.h + 10; // 0th cell is for track name!

    this.canvas_tracks.width =
      this.canvas_tracks_on.width =
      this.canvas_tracks_hover.width =
        w_new;
    this.canvas_tracks.height =
      this.canvas_tracks_on.height =
      this.canvas_tracks_hover.height =
        h_new;
    this.canvas_master.height =
      this.canvas_master_on.height =
      this.canvas_master_hover.height =
        h_new;
    this.canvas_tracks_dom.css({ width: w_new + 'px', height: h_new + 'px' });
    this.canvas_tracks_on_dom.css({
      width: w_new + 'px',
      height: h_new + 'px',
    });
    this.canvas_tracks_hover_dom.css({
      width: w_new + 'px',
      height: h_new + 'px',
    });
    this.canvas_master_dom.css({ height: h_new + 'px' });
    this.canvas_master_on_dom.css({ height: h_new + 'px' });
    this.canvas_master_hover_dom.css({ height: h_new + 'px' });

    this.wrapper_tracks.css({ width: w_new + 'px' });
    this.wrapper_tracks_sub.css({ width: w_new + 'px' });

    this.ctx_tracks.translate(0, this.offset_y);
    this.ctx_master.translate(0, this.offset_y);
    this.ctx_tracks_on.translate(0, this.offset_y);
    this.ctx_master_on.translate(0, this.offset_y);
    this.ctx_tracks_hover.translate(0, this.offset_y);
    return this.ctx_master_hover.translate(0, this.offset_y);
  }

  // Get the cell under the mouse
  getPos(
    rect: DOMRect,
    wrapper: JQuery,
    e: JQuery.MouseEventBase,
    type: string
  ) {
    const x = Math.floor(
      (e.clientX! - rect.left + this.wrapper_mixer.scrollLeft()!) / this.w
    );
    const y = Math.floor(
      (e.clientY! - rect.top + wrapper.scrollTop()! - this.offset_translate) /
        this.h
    );
    return {
      x,
      y,
      type,
    };
  }

  getPlayPos(rect: DOMRect, wrapper: JQuery, e: JQuery.MouseEventBase) {
    const x = Math.floor(
      (e.clientX! - rect.left + this.wrapper_mixer.scrollLeft()!) / this.w
    );
    let y = Math.floor(
      (e.clientY! - rect.top + wrapper.scrollTop()! - this.offset_translate) /
        this.h
    );

    // inside canvas && not track name space
    if (
      !(
        e.clientX! - rect.left + this.wrapper_mixer.scrollLeft()! - x * this.w <
          20 &&
        e.clientY! -
          rect.top +
          wrapper.scrollTop()! -
          this.offset_translate -
          y * this.h <
          20
      )
    ) {
      y = -1;
    }

    return {
      x,
      y,
    };
  }

  initEvent() {
    // Tracks canvas
    this.canvas_tracks_hover_dom
      .on('mousemove', (e) => {
        const pos = this.getPos(
          this.rect_tracks,
          this.wrapper_tracks_sub,
          e,
          'tracks'
        );
        if (this.is_clicked) {
          return this.drawDrag(this.ctx_tracks_hover, pos);
        } else {
          return this.drawHover(this.ctx_tracks_hover, pos);
        }
      })
      .on('mouseout', () => {
        this.clearHover(this.ctx_tracks_hover);
        this.hover_pos = { x: -1, y: -1 };
        return (this.is_clicked = false);
      })
      .on('mousedown', (e) => {
        let pos = this.getPlayPos(this.rect_tracks, this.wrapper_tracks_sub, e);
        if (pos.y >= 0) {
          this.cueTracks(pos.x, pos.y);
        } else {
          pos = this.getPos(
            this.rect_tracks,
            this.wrapper_tracks_sub,
            e,
            'tracks'
          );
          const now = performance.now(); // more accurate than Date.now()

          // Double clicked
          if (now - this.last_clicked < 500 && pos.y !== -1) {
            this.editPattern(pos);
            this.last_clicked = -10000; // prevent triple-click

            // Clicked
          } else {
            this.last_clicked = now;
          }

          this.is_clicked = true;
        }

        // for both cases
        return (this.click_pos = pos);
      })
      .on('mouseup', (e) => {
        const pos = this.getPos(
          this.rect_tracks,
          this.wrapper_tracks_sub,
          e,
          'tracks'
        );
        if (this.click_pos.x === pos.x && this.click_pos.y === pos.y) {
          this.selectCell(pos);
        } else {
          if (this.click_pos.x !== pos.x || this.click_pos.y !== pos.y) {
            this.copyCell(this.click_pos, pos);
          }
        }

        return (this.is_clicked = false);
      });

    // Master canvas
    this.canvas_master_hover_dom
      .on('mousemove', (e) => {
        const pos = this.getPos(
          this.rect_master,
          this.wrapper_master,
          e,
          'master'
        );
        if (this.is_clicked) {
          return this.drawDragMaster(this.ctx_master_hover, pos);
        } else {
          return this.drawHover(this.ctx_master_hover, pos);
        }
      })
      .on('mouseout', () => {
        this.clearHover(this.ctx_master_hover);
        this.hover_pos = { x: -1, y: -1 };
        return (this.is_clicked = false);
      })
      .on('mousedown', (e) => {
        let pos = this.getPlayPos(this.rect_master, this.wrapper_master, e);
        if (pos.y >= 0) {
          this.cueMaster(pos.x, pos.y);
        } else {
          pos = this.getPos(this.rect_master, this.wrapper_master, e, 'master');
          this.is_clicked = true;
        }

        // for both cases
        return (this.click_pos = pos);
      })
      .on('mouseup', (e) => {
        const pos = this.getPos(
          this.rect_master,
          this.wrapper_master,
          e,
          'master'
        );
        if (this.click_pos.x === pos.x && this.click_pos.y === pos.y) {
          this.selectCellMaster(pos);
        } else {
          if (this.click_pos.x !== pos.x || this.click_pos.y !== pos.y) {
            this.copyCellMaster(this.click_pos, pos);
          }
        }

        return (this.is_clicked = false);
      });

    this.wrapper_master.on('scroll', () =>
      this.wrapper_tracks_sub.scrollTop(this.wrapper_master.scrollTop()!)
    );
    this.wrapper_tracks_sub.on('scroll', () =>
      this.wrapper_master.scrollTop(this.wrapper_tracks_sub.scrollTop()!)
    );

    // for Other view
    this.btn_save.on('click', () => controller.saveSong());
    this.dialog.on('mousedown', (e) => {
      if (
        !this.dialog_wrapper.is(e.target) &&
        this.dialog_wrapper.has(e.target).length === 0
      ) {
        return this.closeDialog();
      }
    });
    this.dialog_close.on('mousedown', () => this.closeDialog());

    this.song_title
      .on('focus', () => window.keyboard.beginInput())
      .on('change', () => this.setSongTitle())
      .on('blur', () => window.keyboard.endInput());
    this.song_creator
      .on('focus', () => window.keyboard.beginInput())
      .on('change', () => this.setCreatorName())
      .on('blur', () => window.keyboard.endInput());

    this.social_twitter.on('click', () => this.share('twitter'));
    this.social_facebook.on('click', () => this.share('facebook'));
    this.social_hatena.on('click', () => this.share('hatena'));

    return this.loadSong(this.current_cells);
  }

  // Set params for @song (ref to @model.song).
  setSongTitle() {
    this.song.title = this.song_title.val()?.toString();
  }

  setCreatorName() {
    this.song.creator = this.song_creator.val()?.toString();
  }

  // Read song from model.song.
  loadSong(current_cells: (number | undefined)[]) {
    this.current_cells = current_cells;
    this.resize();

    // Draw tracks
    for (let x = 0; x < Math.max(this.song.tracks.length + 1, 8); x++) {
      const t = this.song.tracks[x];
      if (t != null) {
        if (t.type != null) {
          this.track_color[x] = this.color_schemes[t.type];
        }
        if (t.name != null) {
          this.drawTrackName(x, t.name);
        }
      }

      for (let y = 0; y < Math.max(this.song.length + 1, 10); y++) {
        const p = t?.patterns[y];
        if (p !== undefined) {
          this.drawCellTracks(p, x, y);
        } else {
          this.drawEmpty(this.ctx_tracks, x, y);
        }
      }
    }

    // Draw master
    this.drawMasterName();
    for (let y = 0; y < Math.max(this.song.length + 1, 10); y++) {
      if (this.song.master[y] != null) {
        this.drawCellMaster(this.song.master[y], 0, y);
      } else {
        this.drawEmptyMaster(y);
      }
    }

    this.drawScene(this.scene_pos, this.current_cells);

    this.selectCellMaster(this.select_pos);

    // set Global info
    this.song_title.val(this.song.title ?? '');
    return this.song_creator.val(this.song.creator ?? '');
  }

  drawCellTracks(p: { name: string }, x: number, y: number) {
    this.clearCell(this.ctx_tracks, x, y);

    if (this.track_color[x] == null) {
      this.track_color[x] = this.color_schemes[this.song.tracks[x].type];
    }

    this.ctx_tracks.strokeStyle = this.track_color[x][1];
    this.ctx_tracks.lineWidth = 1;
    this.ctx_tracks.strokeRect(
      x * this.w + 2,
      y * this.h + 2,
      this.w - 2,
      this.h - 2
    );
    this.ctx_tracks.drawImage(
      this.img_play,
      0,
      0,
      18,
      18,
      x * this.w + 3,
      y * this.h + 3,
      16,
      15
    );

    this.ctx_tracks.fillStyle = this.track_color[x][1];
    return this.ctx_tracks.fillText(
      p.name,
      x * this.w + 24,
      (y + 1) * this.h - 6
    );
  }

  drawCellMaster(p: { name: string }, x: number, y: number) {
    this.clearCell(this.ctx_master, x, y);

    this.ctx_master.strokeStyle = this.color[1];
    this.ctx_master.lineWidth = 1;
    this.ctx_master.strokeRect(
      2,
      y * this.h + 2,
      this.w_master - 2,
      this.h - 2
    );
    this.ctx_master.drawImage(
      this.img_play,
      0,
      0,
      18,
      18,
      3,
      y * this.h + 3,
      16,
      15
    );

    this.ctx_master.fillStyle = this.color[1];
    return this.ctx_master.fillText(p.name, 24, (y + 1) * this.h - 6);
  }

  drawEmpty(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.clearCell(ctx, x, y);
    ctx.strokeStyle = this.color[0];
    ctx.lineWidth = 1;
    return ctx.strokeRect(
      x * this.w + 2,
      y * this.h + 2,
      this.w - 2,
      this.h - 2
    );
  }

  drawEmptyMaster(y: number) {
    this.clearCell(this.ctx_master, 0, y);
    this.ctx_master.strokeStyle = this.color[0];
    this.ctx_master.lineWidth = 1;
    this.ctx_master.strokeRect(
      2,
      y * this.h + 2,
      this.w_master - 2,
      this.h - 2
    );
    return this.ctx_master.drawImage(
      this.img_play,
      0,
      0,
      18,
      18,
      3,
      y * this.h + 3,
      16,
      15
    );
  }

  clearCell(ctx: CanvasRenderingContext2D, x: number, y: number) {
    if (ctx === this.ctx_master) {
      return ctx.clearRect(0, y * this.h, this.w_master, this.h);
    } else {
      return ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    }
  }

  drawMasterName() {
    const m = this.ctx_master.measureText('MASTER');
    const dx = (this.w - m.width) / 2;
    const dy = (this.offset_y - this.font_size) / 2;

    this.ctx_master.fillStyle = '#ccc';
    return this.ctx_master.fillText('MASTER', dx + 2, -dy - 3);
  }

  drawTrackName(x: number, name: string, type?: string) {
    if (type != null) {
      this.track_color[x] = this.color_schemes[type];
    }

    this.ctx_tracks.fillStyle = this.track_color[x][1];
    this.ctx_tracks.fillRect(x * this.w + 2, -20, this.w - 2, 18);

    const m = this.ctx_tracks.measureText(name);
    const dx = (this.w - m.width) / 2;
    const dy = (this.offset_y - this.font_size) / 2;

    this.ctx_tracks.shadowColor = '#fff';
    this.ctx_tracks.shadowBlur = 1;
    this.ctx_tracks.fillStyle = '#fff';
    this.ctx_tracks.fillText(name, x * this.w + dx + 2, -dy - 3);
    return (this.ctx_tracks.shadowBlur = 0);
  }

  drawPatternName(x: number, y: number, p: { name: string }) {
    return this.drawCellTracks(p, x, y);
  }

  drawScene(pos: number, cells: (number | undefined)[]) {
    this.ctx_tracks_on.clearRect(
      0,
      this.scene_pos * this.h,
      this.w * 8,
      this.h
    );
    this.ctx_master_on.clearRect(0, this.scene_pos * this.h, this.w, this.h);

    if (cells != null) {
      this.current_cells = cells;
    }

    for (let i = 0; i < this.current_cells.length; i++) {
      const cell = this.current_cells[i];
      if (cell != null) {
        this.drawActive(i, cell);
      }
    }

    this.drawActiveMaster(pos);
    this.scene_pos = pos;

    if (this.select_pos.type === 'tracks') {
      return this.selectCell(this.select_pos);
    } else if (this.select_pos.type === 'master') {
      return this.selectCellMaster(this.select_pos);
    }
  }

  drawActive(x: number, y: number) {
    this.clearActive(x);
    this.ctx_tracks_on.drawImage(
      this.img_play,
      36,
      0,
      18,
      18,
      x * this.w + 3,
      y * this.h + 3,
      16,
      15
    );
    return (this.last_active[x] = y);
  }

  drawActiveMaster(y: number) {
    this.ctx_master_on.clearRect(0, 0, this.w_master, 10000);
    return this.ctx_master_on.drawImage(
      this.img_play,
      36,
      0,
      18,
      18,
      3,
      y * this.h + 3,
      16,
      15
    );
  }

  drawDrag(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    this.clearHover(ctx);

    const pattern =
      this.song.tracks[this.click_pos.x]?.patterns?.[this.click_pos.y];
    if (pattern == null) {
      return;
    }
    const { name } = pattern;

    if (pos.y >= Math.max(this.song.length, 10) || pos.y < 0) {
      return;
    }

    if (this.track_color[pos.x] == null) {
      this.track_color[pos.x] =
        this.color_schemes[this.song.tracks[pos.x].type];
    }

    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);

    ctx.strokeStyle = this.track_color[pos.x][1];
    ctx.fillStyle = this.track_color[pos.x][1];

    ctx.lineWidth = 1;
    ctx.strokeRect(
      pos.x * this.w + 2,
      pos.y * this.h + 2,
      this.w - 2,
      this.h - 2
    );
    ctx.fillText(name, pos.x * this.w + 24, (pos.y + 1) * this.h - 6);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w + 2, this.h + 2);

    return (this.hover_pos = pos);
  }

  drawDragMaster(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    this.clearHover(ctx);

    // @click_pos is NOT empty
    if (this.song.master[this.click_pos.y] == null) {
      return;
    }
    const { name } = this.song.master[this.click_pos.y];

    if (pos.y >= Math.max(this.song.length, 10)) {
      return;
    }

    ctx.strokeStyle = this.color[1];
    ctx.fillStyle = this.color[1];

    ctx.lineWidth = 1;
    ctx.strokeRect(2, pos.y * this.h + 2, this.w_master - 2, this.h - 2);
    ctx.fillText(name, 24, (pos.y + 1) * this.h - 6);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, pos.y * this.h, this.w_master, this.h);

    return (this.hover_pos = pos);
  }

  drawHover(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    this.clearHover(ctx);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    if (ctx === this.ctx_master_hover) {
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w_master, this.h);
    } else {
      ctx.fillRect(pos.x * this.w, pos.y * this.h, this.w, this.h);
    }
    return (this.hover_pos = pos);
  }

  clearHover(ctx: CanvasRenderingContext2D) {
    // for tracks
    if (ctx === this.ctx_tracks_hover) {
      // Don't know why '+2' is needed .... but it's needed!!!
      ctx.clearRect(
        this.hover_pos.x * this.w,
        this.hover_pos.y * this.h,
        this.w + 2,
        this.h + 2
      );
      if (
        this.hover_pos.x === this.select_pos.x &&
        this.hover_pos.y === this.select_pos.y &&
        this.hover_pos.type === this.select_pos.type
      ) {
        return this.selectCell(this.select_pos);
      }

      // for master
    } else {
      ctx.clearRect(
        0,
        this.hover_pos.y * this.h,
        this.w_master + 2,
        this.h + 2
      );
      if (
        this.hover_pos.x === this.select_pos.x &&
        this.hover_pos.y === this.select_pos.y &&
        this.hover_pos.type === this.select_pos.type
      ) {
        return this.selectCellMaster(this.select_pos);
      }
    }
  }

  clearActive(x: number) {
    return this.ctx_tracks_on.clearRect(
      x * this.w,
      this.last_active[x] * this.h,
      this.w,
      this.h
    );
  }

  clearAllActive() {
    this.ctx_tracks_on.clearRect(0, 0, 10000, 10000);
    return this.ctx_master_on.clearRect(0, 0, 10000, 10000);
  }

  // Cue the cells to play
  cueTracks(x: number, y: number) {
    if (
      this.song.tracks[x] != null &&
      this.song.tracks[x].patterns[y] != null
    ) {
      controller.cuePattern(x, y);
      this.ctx_tracks_on.drawImage(
        this.img_play,
        36,
        0,
        18,
        18,
        x * this.w + 4,
        y * this.h + 4,
        15,
        16
      );
      return window.setTimeout(
        () =>
          this.ctx_tracks_on.clearRect(x * this.w + 4, y * this.h + 4, 15, 16),
        100
      );
    }
  }

  cueMaster(x: number, y: number) {
    if (this.song.master[y] != null) {
      controller.cueScene(y);
      this.ctx_master_on.drawImage(
        this.img_play,
        36,
        0,
        18,
        18,
        4,
        y * this.h + 4,
        15,
        16
      );
      return window.setTimeout(
        () => this.ctx_master_on.clearRect(4, y * this.h + 4, 15, 16),
        100
      );
    }
  }

  // Light the play buttons on beat.
  beat(is_master: boolean, cells: [number, number | undefined] | [number, number][]) {
    if (is_master) {
      const c = cells as [number, number | undefined];
      if (c[1] === undefined) return;
      const y = c[1];
      this.ctx_master_on.drawImage(
        this.img_play,
        36,
        0,
        18,
        18,
        c[0] * this.w + 3,
        y * this.h + 3,
        16,
        15
      );
      window.setTimeout(
        () =>
          this.ctx_master_on.clearRect(
            c[0] * this.w + 3,
            y * this.h + 3,
            16,
            15
          ),
        100
      );
    } else {
      for (const c of cells as [number, number][]) {
        this.ctx_tracks_on.drawImage(
          this.img_play,
          36,
          0,
          18,
          18,
          c[0] * this.w + 3,
          c[1] * this.h + 3,
          16,
          15
        );

        window.setTimeout(
          () =>
            this.ctx_tracks_on.clearRect(
              c[0] * this.w + 3,
              c[1] * this.h + 3,
              16,
              15
            ),
          100
        );
      }
    }
  }

  editPattern(pos: { x: number; y: number }) {
    const pat = controller.editPattern(pos.x, pos.y);
    return this.drawCellTracks(pat[2], pat[0], pat[1]);
  }

  addInstrument() {
    return this.loadSong(this.current_cells);
  }

  // Dialogs
  showSuccess(_url: string, song_title: string, user_name: string) {
    let text, title;
    if (song_title != null) {
      if (user_name != null) {
        text = '"' + song_title + '" by ' + user_name;
      } else {
        text = '"' + song_title + '"';
      }
      title = text + ' :: evil';
    } else {
      text = '"evil" by gmork';
      title = 'evil';
    }
    const url = 'http://evil.gmork.in/' + _url;

    history.pushState('', title, _url);
    document.title = title;

    this.dialog.css({ opacity: '1', 'z-index': '10000' });
    this.dialog.find('#dialog-socials').show();
    this.dialog.find('#dialog-success').show();
    this.dialog.find('#dialog-error').hide();
    this.dialog.find('.dialog-message-sub').text(url);
    const tw_url =
      'http://twitter.com/intent/tweet?url=' +
      encodeURI(url + '&text=' + text + '&hashtags=evil');
    const fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
    this.dialog
      .find('.dialog-twitter')
      .attr('href', tw_url)
      .click(() => this.closeDialog());
    return this.dialog
      .find('.dialog-facebook')
      .attr('href', fb_url)
      .click(() => this.closeDialog());
  }

  showError() {
    this.dialog.css({ opacity: '1', 'z-index': '10000' });
    this.dialog.find('#dialog-socials').hide();
    this.dialog.find('#dialog-success').hide();
    return this.dialog.find('#dialog-error').show();
  }

  closeDialog() {
    return this.dialog.css({ opacity: '1', 'z-index': '-10000' });
  }

  // Share button on dialogue
  share(service: string) {
    // Prepare the default text to share
    let text;
    if (this.song.title != null) {
      if (this.song.creator != null) {
        text = '"' + this.song.title + '" by ' + this.song.creator;
      } else {
        text = '"' + this.song.title + '"';
      }
    } else {
      text = '"evil" by gmork';
    }

    const url = location.href;

    if (service === 'twitter') {
      const tw_url =
        'http://twitter.com/intent/tweet?url=' +
        encodeURI(url + '&text=' + text + '&hashtags=evil');
      return window.open(
        tw_url,
        'Tweet',
        'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'
      );
    } else if (service === 'facebook') {
      const fb_url = 'http://www.facebook.com/sharer.php?&u=' + url;
      return window.open(
        fb_url,
        'Share on facebook',
        'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'
      );
    } else {
      const hb_url = 'http://b.hatena.ne.jp/entry/' + url.split('://')[1];
      return window.open(hb_url);
    }
  }

  // Copy cells by drag.
  copyCell(src: { x: number; y: number }, dst: { x: number; y: number }) {
    if (this.song.tracks[src.x] == null) {
      return;
    }
    if (this.song.tracks[src.x].patterns[src.y] == null) {
      return;
    }

    controller.savePattern(src.x, src.y);

    // addSynth when tracks[dst.x] is empty.
    if (this.song.tracks[dst.x] == null) {
      dst.x = controller.loadTrack(this.song, src, dst);
      this.current_cells.length = dst.x + 1;
      this.song.tracks[dst.x].type = this.song.tracks[src.x].type;
    }

    if (this.song.tracks[src.x].type !== this.song.tracks[dst.x].type) {
      return;
    }

    // Deep copy the pattern
    this.song.tracks[dst.x].patterns[dst.y] = $.extend(
      true,
      {},
      this.song.tracks[src.x].patterns[src.y]
    );
    const pattern = this.song.tracks[dst.x]?.patterns?.[dst.y];
    if (pattern) {
      this.drawCellTracks(pattern, dst.x, dst.y);
    }

    controller.loadPattern(
      this.song.tracks[dst.x].patterns[dst.y],
      dst.x,
      dst.y
    );
    return this.drawCellMaster(this.song.master[dst.y], 0, dst.y);
  }

  copyCellMaster(src: { x: number; y: number }, dst: { x: number; y: number }) {
    if (this.song.master[src.y] == null) {
      return;
    }

    // TODO: save particular master
    // @model.saveMaster(src.y)

    // Deep copy the pattern
    this.song.master[dst.y] = $.extend(true, {}, this.song.master[src.y]);
    this.drawCellMaster(this.song.master[dst.x], 0, dst.y);

    // save @song.master to @session.song.master
    return controller.loadMaster(this.song.master[dst.y], dst.y);
  }

  // Select cell on click.
  selectCell(pos: { x: number; y: number; type: string }) {
    if (this.song.tracks[pos.x] == null) {
      return;
    }
    if (this.song.tracks[pos.x].patterns[pos.y] == null) {
      return;
    }

    this.ctx_master_hover.clearRect(
      this.select_pos.x * this.w,
      this.select_pos.y * this.h,
      this.w_master,
      this.h
    );

    this.ctx_tracks_hover.clearRect(
      this.hover_pos.x * this.w,
      this.hover_pos.y * this.h,
      this.w,
      this.h
    );
    this.ctx_tracks_hover.clearRect(
      this.click_pos.x * this.w,
      this.click_pos.y * this.h,
      this.w,
      this.h
    );
    this.ctx_tracks_hover.clearRect(
      this.select_pos.x * this.w,
      this.select_pos.y * this.h,
      this.w,
      this.h
    );

    if (this.track_color[pos.x] == null) {
      this.track_color[pos.x] =
        this.color_schemes[this.song.tracks[pos.x].type];
    }

    this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][5];
    this.ctx_tracks_hover.fillRect(
      pos.x * this.w + 2,
      pos.y * this.h + 2,
      this.w - 2,
      this.h - 2
    );

    const pattern = this.song.tracks[pos.x]?.patterns?.[pos.y];
    if (pattern) {
      this.ctx_tracks_hover.fillStyle = this.track_color[pos.x][1];
      this.ctx_tracks_hover.fillText(
        pattern.name,
        pos.x * this.w + 24,
        (pos.y + 1) * this.h - 6
      );
    }

    this.select_pos = pos;
    this.select_pos.type = 'tracks';

    return controller.showSidebar(this.select_pos);
  }

  selectCellMaster(pos: { x: number; y: number; type: string }) {
    if (this.song.master[pos.y] == null) {
      return;
    }

    this.ctx_tracks_hover.clearRect(
      this.select_pos.x * this.w,
      this.select_pos.y * this.h,
      this.w,
      this.h
    );

    this.ctx_master_hover.clearRect(
      0,
      this.hover_pos.y * this.h,
      this.w_master,
      this.h
    );
    this.ctx_master_hover.clearRect(
      0,
      this.click_pos.y * this.h,
      this.w_master,
      this.h
    );
    this.ctx_master_hover.clearRect(
      0,
      this.select_pos.y * this.h,
      this.w_master,
      this.h
    );

    this.ctx_master_hover.fillStyle = this.color[5];
    this.ctx_master_hover.fillRect(
      2,
      pos.y * this.h + 2,
      this.w_master - 2,
      this.h - 2
    );

    this.ctx_master_hover.fillStyle = this.color[1];
    this.ctx_master_hover.fillText(
      this.song.master[pos.y].name,
      pos.x * this.w_master + 24,
      (pos.y + 1) * this.h - 6
    );

    this.select_pos = pos;
    this.select_pos.type = 'master';

    return controller.showSidebar(this.select_pos);
  }

  getSelectPos() {
    if (this.select_pos.x !== -1 && this.select_pos.y !== -1) {
      return this.select_pos;
    }
  }
}
