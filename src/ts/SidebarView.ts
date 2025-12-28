/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery';

declare global {
  interface Window {
    keyboard: any;
  }
}

class SidebarView {
  model: any;
  wrapper: JQuery;
  tracks: JQuery;
  master: JQuery;
  master_display: JQuery;
  master_control: JQuery;
  master_display_label: JQuery;
  master_edit: JQuery;
  master_name: JQuery;
  master_bpm: JQuery;
  master_key: JQuery;
  master_scale: JQuery;
  master_save: JQuery;
  master_effects: JQuery;
  add_master: JQuery;
  add_master_btn: JQuery;
  tracks_effects: JQuery;
  add_tracks: JQuery;
  add_tracks_btn: JQuery;

  constructor(model: any) {
    this.model = model;
    this.wrapper = $('#sidebar-wrapper');
    this.tracks = this.wrapper.find('#sidebar-tracks');
    this.master = this.wrapper.find('#sidebar-master');

    this.master_display = this.master.find('.display');
    this.master_control = this.master.find('.control');

    this.master_display_label = this.master.find('.display-current-control');
    this.master_edit = this.master.find('[name=edit]');

    this.master_name = this.master.find('[name=name]');
    this.master_bpm = this.master.find('[name=bpm]');
    this.master_key = this.master.find('[name=key]');
    this.master_scale = this.master.find('[name=mode]');
    this.master_save = this.master.find('[name=save]');

    this.master_effects = this.master.find('.sidebar-effects');
    this.add_master = this.master.find('.add-type');
    this.add_master_btn = this.master.find('.add-btn');
    this.tracks_effects = this.tracks.find('.sidebar-effects');
    this.add_tracks = this.tracks.find('.add-type');
    this.add_tracks_btn = this.tracks.find('.add-btn');

    this.initEvent();
  }

  // init Master Effect

  initEvent() {
    this.master_name
      .on('focus', () => window.keyboard.beginInput())
      .on('blur', () => window.keyboard.endInput())
      .on('change', () => this.saveMaster());
    for (var m of [this.master_bpm, this.master_key, this.master_scale]) {
      m.on('focus', () => window.keyboard.beginInput()).on('blur', () =>
        window.keyboard.endInput()
      );
    }
    this.master_save.on('click', () => {
      this.saveMaster();
      return this.hideMasterControl();
    });
    this.master_edit.on('click', () => this.showMasterControl());

    this.tracks.find('.sidebar-effect').each((i: number, el: HTMLElement) => {
      $(el).on('change', () => {
        // change i-th effect
        this.model.readTracksEffect(i);
      });
    });

    this.add_master_btn.on('click', () => {
      return this.addMasterEffect(this.add_master.val());
    });

    return this.add_tracks_btn.on('click', () => {
      return this.addTracksEffect(this.add_tracks.val());
    });
  }

  saveMaster() {
    const name = this.master_name.val();
    const bpm = this.master_bpm.val();
    const key = this.master_key.val();
    const scale = this.master_scale.val();
    const obj = {
      name: name != null ? name : undefined,
      bpm: bpm != null ? bpm : undefined,
      key: key != null ? key : undefined,
      scale: scale != null ? scale : undefined,
    };
    this.model.saveMaster(obj);
    return this.showMaster(obj);
  }

  clearMaster() {
    const o = { name: this.master_name.val() };
    this.model.saveMaster(o);
    return this.showMaster(o);
  }

  saveTracksEffect() {
    return Array.from(this.tracks_effects).map((f: any) => f.getParam());
  }

  showTracks(track: any) {
    this.tracks_effects.find('.sidebar-effect').remove();
    for (var f of Array.from(track.effects) as any[]) {
      f.appendTo(this.tracks_effects);
    }
    return this.wrapper.css('left', '0px');
  }

  showMaster(o) {
    this.hideMasterControl();

    let s = '';
    if (o.name != null) {
      this.master_name.val(o.name);
    }
    if (o.bpm != null) {
      s += o.bpm + ' BPM 　';
    }
    if (o.key != null) {
      s += o.key + ' 　';
    }
    if (o.scale != null) {
      s += o.scale;
    }
    this.master_display_label.text(s);

    return this.wrapper.css('left', '-223px');
  }

  showMasterControl() {
    this.master_control.show();
    return this.master_display.hide();
  }

  hideMasterControl() {
    this.master_display.show();
    return this.master_control.hide();
  }

  addMasterEffect(name) {
    const fx = this.model.addMasterEffect(name);
    return fx.appendTo(this.master_effects);
  }

  addTracksEffect(name) {
    const fx = this.model.addTracksEffect(name);
    return fx.appendTo(this.tracks_effects);
  }

  setBPM(b) {
    return this.master_bpm.val(b);
  }
  setKey(k) {
    return this.master_key.val(k);
  }
  setScale(s) {
    return this.master_scale.val(s);
  }
}

// Exports!
export default SidebarView;
