import { useEffect, useState } from 'react';
import { controller } from '../../controller';
import { SynthEditor } from './SynthEditor';
import { SamplerEditor } from './SamplerEditor';
import type { Synth } from '../../Synth';
import type { Sampler } from '../../Sampler';
import type { Instrument } from '../../Instrument';

/**
 * Container component that renders all instrument editors.
 * Fetches instruments from controller and renders appropriate editor for each.
 */
export function InstrumentsContainer() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    // Get initial instruments from controller
    const loadInstruments = () => {
      const count = controller.instrumentsCount;
      const insts: Instrument[] = [];
      for (let i = 0; i < count; i++) {
        insts.push(controller.getInstrument(i));
      }
      setInstruments(insts);
    };

    loadInstruments();

    // Poll for instrument changes (simple approach)
    // TODO: Replace with proper event system
    const interval = setInterval(() => {
      const count = controller.instrumentsCount;
      const insts: Instrument[] = [];
      for (let i = 0; i < count; i++) {
        insts.push(controller.getInstrument(i));
      }
      setInstruments(insts);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {instruments.map((inst, id) => {
        // Check instrument type and render appropriate editor
        if (inst.type === 'REZ') {
          // It's a Synth
          return <SynthEditor key={id} model={inst as Synth} id={id} />;
        } else if (inst.type === 'SAMPLER') {
          // It's a Sampler
          return <SamplerEditor key={id} model={inst as Sampler} id={id} />;
        }
        return null;
      })}
    </>
  );
}
