import type { Mixer } from '../../Mixer';
import type { MixerPanelRef } from './MixerPanel';
import { store } from '../../store';

/**
 * Adapter that bridges the Mixer audio model with React MixerPanel component.
 * Handles VU meter updates and syncs gain/pan changes to the audio engine.
 */
export class MixerAdapter {
  private mixer: Mixer;
  private panelRef: MixerPanelRef | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;

  constructor(mixer: Mixer) {
    this.mixer = mixer;
  }

  /**
   * Set the React panel ref for accessing canvas elements
   */
  setPanelRef(ref: MixerPanelRef) {
    this.panelRef = ref;
  }

  /**
   * Start VU meter updates
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.updateVUMeters();
  }

  /**
   * Stop VU meter updates
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Update VU meters using requestAnimationFrame
   */
  private updateVUMeters = () => {
    if (!this.isRunning) return;

    this.drawGains();

    // Schedule next update (roughly 30fps to match original setInterval(30))
    this.animationFrameId = requestAnimationFrame(() => {
      setTimeout(this.updateVUMeters, 30);
    });
  };

  /**
   * Draw VU meter levels for all tracks and master
   */
  private drawGains() {
    if (!this.panelRef) return;

    const trackCanvases = this.panelRef.getTrackCanvases();
    const masterCanvas = this.panelRef.getMasterCanvas();

    // Draw track VU meters
    for (
      let i = 0;
      i < this.mixer.analysers.length && i < trackCanvases.length;
      i++
    ) {
      const analyser = this.mixer.analysers[i];
      const canvas = trackCanvases[i];
      if (!analyser || !canvas) continue;

      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);
      this.drawTrackVU(canvas, data);
    }

    // Draw master VU meter
    if (masterCanvas && this.mixer.analyser_master) {
      const dataL = new Uint8Array(
        this.mixer.analyser_master[0].frequencyBinCount
      );
      const dataR = new Uint8Array(
        this.mixer.analyser_master[1].frequencyBinCount
      );
      this.mixer.analyser_master[0].getByteTimeDomainData(dataL);
      this.mixer.analyser_master[1].getByteTimeDomainData(dataR);
      this.drawMasterVU(masterCanvas, dataL, dataR);
    }
  }

  private drawTrackVU(canvas: HTMLCanvasElement, data: Uint8Array) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const v = Math.max(...data);
    const h = ((v - 128) / 128) * 100;

    ctx.clearRect(0, 0, 10, 100);
    ctx.fillStyle = '#0df';
    ctx.fillRect(0, 100 - h, 10, h);
  }

  private drawMasterVU(
    canvas: HTMLCanvasElement,
    dataL: Uint8Array,
    dataR: Uint8Array
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vL = Math.max(...dataL);
    const vR = Math.max(...dataR);
    const hL = ((vL - 128) / 128) * 130;
    const hR = ((vR - 128) / 128) * 130;

    ctx.clearRect(0, 0, 10, 130);
    ctx.clearRect(60, 0, 10, 130);
    ctx.fillStyle = '#0df';
    ctx.fillRect(0, 130 - hL, 10, hL);
    ctx.fillRect(60, 130 - hR, 10, hR);
  }

  /**
   * Handle gain changes from React - sync to audio engine
   */
  handleGainsChange = (trackGains: number[], masterGain: number) => {
    this.mixer.setGains(trackGains, masterGain);
  };

  /**
   * Handle pan changes from React - sync to audio engine
   */
  handlePansChange = (trackPans: number[], masterPan: number) => {
    this.mixer.setPans(trackPans, masterPan);
  };

  /**
   * Add a new track to the mixer (called when instrument is added)
   */
  addTrack() {
    store.getState().addMixerTrack();
  }

  /**
   * Load mixer state from saved data
   */
  loadState(
    gains: number[],
    masterGain: number,
    pans: number[],
    masterPan: number
  ) {
    store.getState().loadMixerState({
      trackGains: gains,
      masterGain,
      trackPans: pans,
      masterPan,
    });
  }

  /**
   * Reset mixer state
   */
  reset() {
    store.getState().resetMixer();
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
    this.panelRef = null;
  }
}
