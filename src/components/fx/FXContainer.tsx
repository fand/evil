import { useCallback } from 'react';
import { FuzzView } from './FuzzView';
import { DelayView } from './DelayView';
import { ReverbView } from './ReverbView';
import { CompressorView } from './CompressorView';
import { DoubleView } from './DoubleView';
import type { FX } from '../../FX/FX';
import type { Fuzz } from '../../FX/Fuzz';
import type { Delay } from '../../FX/Delay';
import type { Reverb } from '../../FX/Reverb';
import type { Compressor } from '../../FX/Compressor';
import type { Double } from '../../FX/Double';

interface FXContainerProps {
  effects: FX[];
  onRemove: (fx: FX) => void;
}

export function FXContainer({ effects, onRemove }: FXContainerProps) {
  const renderEffect = useCallback(
    (fx: FX, index: number) => {
      const handleRemove = () => onRemove(fx);
      const param = fx.getParam();

      switch (param.effect) {
        case 'Fuzz':
          return (
            <FuzzView key={index} model={fx as Fuzz} onRemove={handleRemove} />
          );
        case 'Delay':
          return (
            <DelayView
              key={index}
              model={fx as Delay}
              onRemove={handleRemove}
            />
          );
        case 'Reverb':
          return (
            <ReverbView
              key={index}
              model={fx as Reverb}
              onRemove={handleRemove}
            />
          );
        case 'Compressor':
          return (
            <CompressorView
              key={index}
              model={fx as Compressor}
              onRemove={handleRemove}
            />
          );
        case 'Double':
          return (
            <DoubleView
              key={index}
              model={fx as Double}
              onRemove={handleRemove}
            />
          );
        default:
          return null;
      }
    },
    [onRemove]
  );

  return <>{effects.map(renderEffect)}</>;
}
