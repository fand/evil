import { useRef, useEffect, useCallback } from 'react';
import { useAppStore, useShallow } from '../../hooks/useStore';
import { store } from '../../store';

// Format pan value for display
// pan value: 0 = Right, 0.5 = Center, 1 = Left
function formatPan(value: number): string {
  const l = Math.round((value * 200 - 100) * -1);
  if (l === 0) return 'C';
  if (l < 0) return `${-l}% L`;
  return `${l}% R`;
}

// Convert slider value (0-200) to pan value (0-1)
function sliderToPan(sliderValue: number): number {
  return 1.0 - sliderValue / 200.0;
}

// Convert pan value (0-1) to slider value (0-200)
function panToSlider(panValue: number): number {
  return (1.0 - panValue) * 200;
}

interface TrackChannelProps {
  index: number;
  gain: number;
  pan: number;
  onGainChange: (index: number, gain: number) => void;
  onPanChange: (index: number, pan: number) => void;
  vuMeterRef?: (el: HTMLCanvasElement | null) => void;
}

function TrackChannel({
  index,
  gain,
  pan,
  onGainChange,
  onPanChange,
  vuMeterRef,
}: TrackChannelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && vuMeterRef) {
      vuMeterRef(canvasRef.current);
    }
  }, [vuMeterRef]);

  // Initialize canvas size
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 10;
      canvasRef.current.height = 100;
    }
  }, []);

  return (
    <div className="console-track">
      <div className="pan-label">{formatPan(pan)}</div>
      <input
        className="pan-slider"
        type="range"
        min="0"
        max="200"
        value={panToSlider(pan)}
        onChange={(e) => onPanChange(index, sliderToPan(Number(e.target.value)))}
      />
      <input
        className="gain-slider"
        type="range"
        min="0"
        max="100"
        value={gain * 100}
        onChange={(e) => onGainChange(index, Number(e.target.value) / 100)}
      />
      <canvas ref={canvasRef} className="vu-meter" />
    </div>
  );
}

interface MasterChannelProps {
  gain: number;
  onGainChange: (gain: number) => void;
  vuMeterRef?: (el: HTMLCanvasElement | null) => void;
}

function MasterChannel({ gain, onGainChange, vuMeterRef }: MasterChannelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && vuMeterRef) {
      vuMeterRef(canvasRef.current);
    }
  }, [vuMeterRef]);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = 70;
        canvasRef.current.height = 130;
        ctx.fillStyle = '#fff';
        ctx.fillRect(10, 0, 50, 130);
      }
    }
  }, []);

  return (
    <div className="console-track">
      <div>MASTER</div>
      <input
        className="gain-slider"
        type="range"
        min="0"
        max="100"
        value={gain * 100}
        onChange={(e) => onGainChange(Number(e.target.value) / 100)}
      />
      <canvas ref={canvasRef} className="vu-meter" />
    </div>
  );
}

export interface MixerPanelRef {
  getTrackCanvases: () => HTMLCanvasElement[];
  getMasterCanvas: () => HTMLCanvasElement | null;
}

// ============================================================================
// Tracks Mixer - Goes inside #mixer-tracks
// ============================================================================

interface TracksMixerProps {
  onTrackCanvasesRef?: (getCanvases: () => HTMLCanvasElement[]) => void;
  onGainsChange?: (trackGains: number[], masterGain: number) => void;
  onPansChange?: (trackPans: number[], masterPan: number) => void;
}

export function TracksMixer({
  onTrackCanvasesRef,
  onGainsChange,
  onPansChange,
}: TracksMixerProps) {
  const { trackGains, masterGain, trackPans, masterPan } = useAppStore(
    useShallow((state) => ({
      trackGains: state.mixer.trackGains,
      masterGain: state.mixer.masterGain,
      trackPans: state.mixer.trackPans,
      masterPan: state.mixer.masterPan,
    }))
  );

  const trackCanvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);

  // Expose canvas refs to parent
  useEffect(() => {
    if (onTrackCanvasesRef) {
      onTrackCanvasesRef(() =>
        trackCanvasesRef.current.filter((c): c is HTMLCanvasElement => c !== null)
      );
    }
  }, [onTrackCanvasesRef, trackGains.length]);

  const handleTrackGainChange = useCallback(
    (index: number, gain: number) => {
      store.getState().setTrackGain(index, gain);
      const newGains = [...store.getState().mixer.trackGains];
      newGains[index] = gain;
      onGainsChange?.(newGains, store.getState().mixer.masterGain);
    },
    [onGainsChange]
  );

  const handleTrackPanChange = useCallback(
    (index: number, pan: number) => {
      store.getState().setTrackPan(index, pan);
      const newPans = [...store.getState().mixer.trackPans];
      newPans[index] = pan;
      onPansChange?.(newPans, store.getState().mixer.masterPan);
    },
    [onPansChange]
  );

  const setTrackCanvasRef = useCallback(
    (index: number) => (el: HTMLCanvasElement | null) => {
      trackCanvasesRef.current[index] = el;
    },
    []
  );

  return (
    <div id="console-tracks" className="clearfix" style={{ width: `${trackGains.length * 80 + 2}px` }}>
      {trackGains.map((gain, index) => (
        <TrackChannel
          key={index}
          index={index}
          gain={gain}
          pan={trackPans[index] ?? 0.5}
          onGainChange={handleTrackGainChange}
          onPanChange={handleTrackPanChange}
          vuMeterRef={setTrackCanvasRef(index)}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Master Mixer - Goes inside #mixer-master
// ============================================================================

interface MasterMixerProps {
  onMasterCanvasRef?: (getCanvas: () => HTMLCanvasElement | null) => void;
  onGainChange?: (masterGain: number) => void;
}

export function MasterMixer({
  onMasterCanvasRef,
  onGainChange,
}: MasterMixerProps) {
  const masterGain = useAppStore((state) => state.mixer.masterGain);
  const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Expose canvas ref to parent
  useEffect(() => {
    if (onMasterCanvasRef) {
      onMasterCanvasRef(() => masterCanvasRef.current);
    }
  }, [onMasterCanvasRef]);

  const handleMasterGainChange = useCallback(
    (gain: number) => {
      store.getState().setMasterGain(gain);
      onGainChange?.(gain);
    },
    [onGainChange]
  );

  const setMasterCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    masterCanvasRef.current = el;
  }, []);

  return (
    <div id="console-master" className="clearfix">
      <MasterChannel
        gain={masterGain}
        onGainChange={handleMasterGainChange}
        vuMeterRef={setMasterCanvasRef}
      />
    </div>
  );
}

// ============================================================================
// Combined MixerPanel (for backwards compatibility)
// ============================================================================

interface MixerPanelProps {
  onMixerRef?: (ref: MixerPanelRef) => void;
  onGainsChange?: (trackGains: number[], masterGain: number) => void;
  onPansChange?: (trackPans: number[], masterPan: number) => void;
}

export function MixerPanel({
  onMixerRef,
  onGainsChange,
  onPansChange,
}: MixerPanelProps) {
  const { trackGains, masterGain, trackPans } = useAppStore(
    useShallow((state) => ({
      trackGains: state.mixer.trackGains,
      masterGain: state.mixer.masterGain,
      trackPans: state.mixer.trackPans,
    }))
  );

  const trackCanvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Expose canvas refs to parent
  useEffect(() => {
    if (onMixerRef) {
      onMixerRef({
        getTrackCanvases: () =>
          trackCanvasesRef.current.filter((c): c is HTMLCanvasElement => c !== null),
        getMasterCanvas: () => masterCanvasRef.current,
      });
    }
  }, [onMixerRef, trackGains.length]);

  const handleTrackGainChange = useCallback(
    (index: number, gain: number) => {
      store.getState().setTrackGain(index, gain);
      const newGains = [...store.getState().mixer.trackGains];
      newGains[index] = gain;
      onGainsChange?.(newGains, store.getState().mixer.masterGain);
    },
    [onGainsChange]
  );

  const handleMasterGainChange = useCallback(
    (gain: number) => {
      store.getState().setMasterGain(gain);
      onGainsChange?.(store.getState().mixer.trackGains, gain);
    },
    [onGainsChange]
  );

  const handleTrackPanChange = useCallback(
    (index: number, pan: number) => {
      store.getState().setTrackPan(index, pan);
      const newPans = [...store.getState().mixer.trackPans];
      newPans[index] = pan;
      onPansChange?.(newPans, store.getState().mixer.masterPan);
    },
    [onPansChange]
  );

  const setTrackCanvasRef = useCallback(
    (index: number) => (el: HTMLCanvasElement | null) => {
      trackCanvasesRef.current[index] = el;
    },
    []
  );

  const setMasterCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    masterCanvasRef.current = el;
  }, []);

  return (
    <>
      <div id="console-tracks" className="clearfix" style={{ width: `${trackGains.length * 80 + 2}px` }}>
        {trackGains.map((gain, index) => (
          <TrackChannel
            key={index}
            index={index}
            gain={gain}
            pan={trackPans[index] ?? 0.5}
            onGainChange={handleTrackGainChange}
            onPanChange={handleTrackPanChange}
            vuMeterRef={setTrackCanvasRef(index)}
          />
        ))}
      </div>
      <div id="console-master" className="clearfix">
        <MasterChannel
          gain={masterGain}
          onGainChange={handleMasterGainChange}
          vuMeterRef={setMasterCanvasRef}
        />
      </div>
    </>
  );
}
