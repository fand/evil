import { useCallback } from 'react';

// Common FX panel wrapper with remove button
interface FXPanelWrapperProps {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
}

function FXPanelWrapper({ title, onRemove, children }: FXPanelWrapperProps) {
  return (
    <fieldset className="sidebar-effect sidebar-module">
      <legend>{title}</legend>
      <i className="fa fa-minus sidebar-effect-minus" onClick={onRemove} />
      {children}
    </fieldset>
  );
}

// Slider control component
interface SliderControlProps {
  label: string;
  name: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function SliderControl({ label, name, min, max, value, onChange }: SliderControlProps) {
  return (
    <div className="clearfix">
      <label>{label}</label>
      <input
        name={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

// Select control component
interface SelectControlProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectControl({ label, name, value, options, onChange }: SelectControlProps) {
  return (
    <div className="clearfix">
      <label>{label}</label>
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// Delay Effect Panel
export interface DelayParams {
  delay: number;
  feedback: number;
  lofi: number;
  wet: number;
}

interface DelayPanelProps {
  params: DelayParams;
  onChange: (params: Partial<DelayParams>) => void;
  onRemove?: () => void;
}

export function DelayPanel({ params, onChange, onRemove }: DelayPanelProps) {
  return (
    <FXPanelWrapper title="Delay" onRemove={onRemove}>
      <SliderControl
        label="delay"
        name="delay"
        min={50}
        max={1000}
        value={params.delay * 1000}
        onChange={(v) => onChange({ delay: v / 1000 })}
      />
      <SliderControl
        label="feedback"
        name="feedback"
        min={0}
        max={100}
        value={params.feedback * 100}
        onChange={(v) => onChange({ feedback: v / 100 })}
      />
      <SliderControl
        label="lofi"
        name="lofi"
        min={0}
        max={100}
        value={params.lofi * 20}
        onChange={(v) => onChange({ lofi: (v * 5) / 100 })}
      />
      <SliderControl
        label="wet"
        name="wet"
        min={0}
        max={100}
        value={params.wet * 100}
        onChange={(v) => onChange({ wet: v / 100 })}
      />
    </FXPanelWrapper>
  );
}

// Reverb Effect Panel
// Reverb types from index.html
const REVERB_TYPES = [
  'BIG_SNARE', 'Sweep_Reverb', 'Reverb_Factory', 'Dense_Room', '8_SEC_REVERB',
  'GUITAR_ROOM', 'HUNTER_DELAY', 'JERRY_RACE_CAR', 'ResoVibroEee', 'ROOM_OF_DOOM',
  'RHYTHM_&_REVERB', 'BIG_SWEEP', 'BRIGHT_ROOM', 'CANYON', 'DARK_ROOM',
  'DISCRETE-VERB', "EXPLODING_'VERB", 'GATED_REVERB', 'LOCKER_ROOM', 'RANDOM_GATE',
  'REVERSE_GATE', 'RICH_PLATE', 'SHIMMERISH', 'SMALL_ROOM', 'TONAL_ROOM',
  'WARM_HALL', 'THRAX-VERB', 'TWIRLING_ROOM', 'USEFUL_VERB', 'FLUTTEROUS_ROOM',
];

export interface ReverbParams {
  name: string;
  wet: number;
}

interface ReverbPanelProps {
  params: ReverbParams;
  onChange: (params: Partial<ReverbParams>) => void;
  onIRChange?: (name: string) => void;
  onRemove?: () => void;
}

export function ReverbPanel({ params, onChange, onIRChange, onRemove }: ReverbPanelProps) {
  const handleNameChange = useCallback(
    (name: string) => {
      onChange({ name });
      onIRChange?.(name);
    },
    [onChange, onIRChange]
  );

  return (
    <FXPanelWrapper title="Reverb" onRemove={onRemove}>
      <SelectControl
        label="type"
        name="name"
        value={params.name}
        options={REVERB_TYPES}
        onChange={handleNameChange}
      />
      <SliderControl
        label="wet"
        name="wet"
        min={0}
        max={100}
        value={params.wet * 100}
        onChange={(v) => onChange({ wet: v / 100 })}
      />
    </FXPanelWrapper>
  );
}

// Compressor Effect Panel
export interface CompressorParams {
  input: number;
  attack: number;
  release: number;
  threshold: number;
  ratio: number;
  knee: number;
  output: number;
}

interface CompressorPanelProps {
  params: CompressorParams;
  onChange: (params: Partial<CompressorParams>) => void;
  onRemove?: () => void;
}

export function CompressorPanel({ params, onChange, onRemove }: CompressorPanelProps) {
  return (
    <FXPanelWrapper title="Comp" onRemove={onRemove}>
      <SliderControl
        label="input"
        name="input"
        min={0}
        max={100}
        value={params.input * 100}
        onChange={(v) => onChange({ input: v / 100 })}
      />
      <SliderControl
        label="attack"
        name="attack"
        min={0}
        max={1000}
        value={params.attack * 1000}
        onChange={(v) => onChange({ attack: v / 1000 })}
      />
      <SliderControl
        label="release"
        name="release"
        min={1}
        max={1000}
        value={params.release * 1000}
        onChange={(v) => onChange({ release: v / 1000 })}
      />
      <SliderControl
        label="threshold"
        name="threshold"
        min={0}
        max={1000}
        value={params.threshold * -10}
        onChange={(v) => onChange({ threshold: v / -10 })}
      />
      <SliderControl
        label="ratio"
        name="ratio"
        min={1}
        max={20}
        value={params.ratio}
        onChange={(v) => onChange({ ratio: v })}
      />
      <SliderControl
        label="knee"
        name="knee"
        min={0}
        max={40}
        value={params.knee * 1000}
        onChange={(v) => onChange({ knee: v / 1000 })}
      />
      <SliderControl
        label="output"
        name="output"
        min={0}
        max={100}
        value={params.output * 100}
        onChange={(v) => onChange({ output: v / 100 })}
      />
    </FXPanelWrapper>
  );
}

// Fuzz Effect Panel
const FUZZ_TYPES = ['Sigmoid', 'Octavia'];

export interface FuzzParams {
  input: number;
  type: string;
  gain: number;
  output: number;
}

interface FuzzPanelProps {
  params: FuzzParams;
  onChange: (params: Partial<FuzzParams>) => void;
  onRemove?: () => void;
}

export function FuzzPanel({ params, onChange, onRemove }: FuzzPanelProps) {
  return (
    <FXPanelWrapper title="Fuzz" onRemove={onRemove}>
      <SliderControl
        label="input"
        name="input"
        min={0}
        max={100}
        value={params.input * 100}
        onChange={(v) => onChange({ input: v / 100 })}
      />
      <SelectControl
        label="type"
        name="type"
        value={params.type}
        options={FUZZ_TYPES}
        onChange={(v) => onChange({ type: v })}
      />
      <SliderControl
        label="gain"
        name="gain"
        min={8}
        max={99}
        value={params.gain * 100}
        onChange={(v) => onChange({ gain: v / 100 })}
      />
      <SliderControl
        label="output"
        name="output"
        min={0}
        max={100}
        value={params.output * 100}
        onChange={(v) => onChange({ output: v / 100 })}
      />
    </FXPanelWrapper>
  );
}

// Double Effect Panel
export interface DoubleParams {
  delay: number;
  width: number;
}

interface DoublePanelProps {
  params: DoubleParams;
  onChange: (params: Partial<DoubleParams>) => void;
  onRemove?: () => void;
}

export function DoublePanel({ params, onChange, onRemove }: DoublePanelProps) {
  return (
    <FXPanelWrapper title="Double" onRemove={onRemove}>
      <SliderControl
        label="delay"
        name="delay"
        min={10}
        max={100}
        value={params.delay * 1000}
        onChange={(v) => onChange({ delay: v / 1000 })}
      />
      <SliderControl
        label="width"
        name="width"
        min={0}
        max={100}
        value={(params.width - 0.5) * 200}
        onChange={(v) => onChange({ width: v / 200 + 0.5 })}
      />
    </FXPanelWrapper>
  );
}

// Generic FX Panel that renders the appropriate effect panel based on type
export type FXType = 'Delay' | 'Reverb' | 'Comp' | 'Fuzz' | 'Double';

export interface FXPanelProps {
  type: FXType;
  params: DelayParams | ReverbParams | CompressorParams | FuzzParams | DoubleParams;
  onChange: (params: Record<string, unknown>) => void;
  onIRChange?: (name: string) => void;
  onRemove?: () => void;
}

export function FXPanel({ type, params, onChange, onIRChange, onRemove }: FXPanelProps) {
  switch (type) {
    case 'Delay':
      return (
        <DelayPanel
          params={params as DelayParams}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    case 'Reverb':
      return (
        <ReverbPanel
          params={params as ReverbParams}
          onChange={onChange}
          onIRChange={onIRChange}
          onRemove={onRemove}
        />
      );
    case 'Comp':
      return (
        <CompressorPanel
          params={params as CompressorParams}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    case 'Fuzz':
      return (
        <FuzzPanel
          params={params as FuzzParams}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    case 'Double':
      return (
        <DoublePanel
          params={params as DoubleParams}
          onChange={onChange}
          onRemove={onRemove}
        />
      );
    default:
      return null;
  }
}
