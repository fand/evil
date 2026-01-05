# Test Summary (Archived)

CoffeeScript tests from `src/test/` - console-based test framework.

## Test Framework (`test_lib.coffee`)

`Tester` class with:

- Assertions: `assert`, `assertEq`, `assertNotEq`, `assertMatch`, `assertNotMatch`, `assertArrayEq`, `assertArrayNotEq`
- Mouse simulators: `mousedown`, `mouseup`, `mousedrag`
- Results logged to console with color coding

## Tests

### Control (`test_control.coffee`)

- **Main Control**: Verify BPM/key/mode inputs match `window.player` state
- **Main Control Change**: Change BPM=200, key=D, scale=Major and verify player updates

### Initial View (`test_initial.coffee`)

- **Initial View: Synth at 0**: Verify left button hidden, right button visible with "new" text

### Sampler (`test_sampler.coffee`)

- **Sampler JSON**: Set sampler params (10 samples with wave/time/gains/output), verify `getParam()` returns correct values

### Synth (`test_synth.coffee`)

- **Synth JSON**: Set synth params (name, scale, gains, filter, EG/FEG ADSR, 3 VCOs), verify serialization
- **Change synth type**: Toggle between REZ/SAMPLER, verify type changes correctly
- **Synth Sequencer**: Test canvas click/drag interactions for pattern editing (click notes, drag sustain, divide/join sustain)

## Entry Point (`test_main.coffee`)

```javascript
setTimeout(() => window.t.runAll(), 1000);
```
