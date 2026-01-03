import type { Sidebar } from './Sidebar';
import type { Keyboard } from './Keyboard';
import type { Instrument } from './Instrument';
import type { Scene } from './Song';

declare global {
  interface Window {
    keyboard: Keyboard;
  }
}

class SidebarView {
  model: Sidebar;
  wrapper: HTMLElement;
  tracks: HTMLElement;
  master: HTMLElement;
  master_display: HTMLElement;
  master_control: HTMLElement;
  master_display_label: HTMLElement;
  master_edit: HTMLElement;
  master_name: HTMLInputElement;
  master_bpm: HTMLInputElement;
  master_key: HTMLSelectElement;
  master_scale: HTMLSelectElement;
  master_save: HTMLElement;
  master_effects: HTMLElement;
  add_master: HTMLSelectElement;
  add_master_btn: HTMLElement;
  tracks_effects: HTMLElement;
  add_tracks: HTMLSelectElement;
  add_tracks_btn: HTMLElement;

  constructor(model: Sidebar) {
    this.model = model;
    this.wrapper = document.getElementById('sidebar-wrapper')!;
    this.tracks = this.wrapper.querySelector('#sidebar-tracks')!;
    this.master = this.wrapper.querySelector('#sidebar-master')!;

    this.master_display = this.master.querySelector('.display')!;
    this.master_control = this.master.querySelector('.control')!;

    this.master_display_label = this.master.querySelector(
      '.display-current-control'
    )!;
    this.master_edit = this.master.querySelector('[name=edit]')!;

    this.master_name = this.master.querySelector(
      '[name=name]'
    ) as HTMLInputElement;
    this.master_bpm = this.master.querySelector(
      '[name=bpm]'
    ) as HTMLInputElement;
    this.master_key = this.master.querySelector(
      '[name=key]'
    ) as HTMLSelectElement;
    this.master_scale = this.master.querySelector(
      '[name=mode]'
    ) as HTMLSelectElement;
    this.master_save = this.master.querySelector('[name=save]')!;

    this.master_effects = this.master.querySelector('.sidebar-effects')!;
    this.add_master = this.master.querySelector('.add-type') as HTMLSelectElement;
    this.add_master_btn = this.master.querySelector('.add-btn')!;
    this.tracks_effects = this.tracks.querySelector('.sidebar-effects')!;
    this.add_tracks = this.tracks.querySelector('.add-type') as HTMLSelectElement;
    this.add_tracks_btn = this.tracks.querySelector('.add-btn')!;

    this.initEvent();
  }

  // init Master Effect

  initEvent() {
    this.master_name.addEventListener('focus', () =>
      window.keyboard.beginInput()
    );
    this.master_name.addEventListener('blur', () => window.keyboard.endInput());
    this.master_name.addEventListener('change', () => this.saveMaster());

    for (const m of [this.master_bpm, this.master_key, this.master_scale]) {
      m.addEventListener('focus', () => window.keyboard.beginInput());
      m.addEventListener('blur', () => window.keyboard.endInput());
    }
    this.master_save.addEventListener('click', () => {
      this.saveMaster();
      return this.hideMasterControl();
    });
    this.master_edit.addEventListener('click', () => this.showMasterControl());

    this.tracks.querySelectorAll('.sidebar-effect').forEach((el) => {
      el.addEventListener('change', () => {
        // change i-th effect
        // this.model.readTracksEffect(i);
      });
    });

    this.add_master_btn.addEventListener('click', () => {
      return this.addMasterEffect(this.add_master.value);
    });

    this.add_tracks_btn.addEventListener('click', () => {
      return this.addTracksEffect(this.add_tracks.value);
    });
  }

  saveMaster() {
    const name = this.master_name.value || undefined;
    const bpm = this.master_bpm.value || undefined;
    const key = this.master_key.value || undefined;
    const scale = this.master_scale.value || undefined;
    const obj = {
      name,
      bpm: bpm ? parseInt(bpm, 10) : undefined,
      key,
      scale,
    };
    this.model.saveMaster(obj);
    return this.showMaster(obj);
  }

  clearMaster() {
    const name = this.master_name.value || undefined;
    const o = { name };
    this.model.saveMaster(o);
    return this.showMaster(o);
  }

  saveTracksEffect() {
    return Array.from(this.tracks_effects.children).map((f: Element) =>
      (f as unknown as { getParam: () => unknown }).getParam()
    );
  }

  showTracks(track: Instrument) {
    this.tracks_effects
      .querySelectorAll('.sidebar-effect')
      .forEach((el) => el.remove());
    for (const f of track.effects) {
      f.appendTo(this.tracks_effects);
    }
    return (this.wrapper.style.left = '0px');
  }

  showMaster(o: Partial<Scene>) {
    this.hideMasterControl();

    let s = '';
    if (o.name != null) {
      this.master_name.value = o.name;
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
    this.master_display_label.textContent = s;

    return (this.wrapper.style.left = '-223px');
  }

  showMasterControl() {
    this.master_control.style.display = 'block';
    return (this.master_display.style.display = 'none');
  }

  hideMasterControl() {
    this.master_display.style.display = 'block';
    return (this.master_control.style.display = 'none');
  }

  addMasterEffect(name: string) {
    const fx = this.model.addMasterEffect(name);
    return fx.appendTo(this.master_effects);
  }

  addTracksEffect(name: string) {
    const fx = this.model.addTracksEffect(name);
    return fx.appendTo(this.tracks_effects);
  }

  setBPM(bpm: number) {
    this.master_bpm.value = String(bpm);
  }

  setKey(key: string) {
    this.master_key.value = key;
  }

  setScale(scale: string) {
    this.master_scale.value = scale;
  }
}

export { SidebarView };
