# jQuery to React Migration Plan

## Executive Summary

This document outlines the migration strategy for transitioning the evil DAW application from jQuery-based architecture to React. The codebase consists of ~9,400 lines of TypeScript with 488+ jQuery method calls across 21 files. Based on the scope analysis, this migration can be completed in 3-4 days.

## Current State Analysis

### Technology Stack

**Frontend:**
- Language: TypeScript (ES2020)
- UI Library: jQuery 3.7.1
- Build Tool: Vite 7.3.0
- Templates: ECT (Embedded CoffeeScript Templates)
- Audio: Web Audio API

**Architecture Pattern:**
- Custom Model-View pattern (not strict MVC)
- Models: Business logic + Web Audio (Player, Session, Mixer, Synth, Sampler, FX)
- Views: jQuery-based DOM manipulation (21 view files)

### jQuery Dependency Analysis

**Files with Heavy jQuery Usage:**
- `SessionView.ts` (1,243 lines) - Most complex component
- `Synth/View.ts` (843 lines)
- `Sampler/CoreView.ts` (336 lines)
- `MixerView.ts` (218 lines)
- `PlayerView.ts` (266 lines)
- `SidebarView.ts` (186 lines)
- FX Views (6 files)

**Common jQuery Patterns:**
1. DOM Selection: `$('#control')`, `$('.synth-name')`
2. Event Handling: `.on('click')`, `.on('change')`, `.on('mousemove')`
3. DOM Manipulation: `.append()`, `.remove()`, `.show()`, `.hide()`
4. CSS Manipulation: `.addClass()`, `.removeClass()`, `.css()`
5. Deep Cloning: `$.extend(true, {}, obj)`

### Migration Challenges

**High Complexity:**
- SessionView (1,243 lines) - Complex canvas interactions, drag-drop, scroll sync
- Global keyboard handling - Window-level event coordination
- State synchronization - Manual two-way binding between models and views

**Medium Complexity:**
- Canvas event handling - Mouse position calculations
- Deep cloning patterns - Need to replace `$.extend()`
- Window resize handling - Layout recalculations

**Good News:**
- ✅ Modern build tools already in place (Vite, TypeScript, ES modules)
- ✅ Clean Model-View separation
- ✅ Models are mostly jQuery-free (can be reused as-is)

## Migration Strategy: Single Root Approach

### Why This Approach?

**Problem with Gradual Multi-Mount Strategy:**
Mounting multiple React components in different parts of a jQuery app creates:
1. State synchronization hell (jQuery DOM vs React virtual DOM conflicts)
2. Multiple React roots (difficult to share state between components)
3. Event bubbling collisions (jQuery and React event systems interfere)
4. Unclear source of truth (data duplicated between jQuery and React)

**Solution: Single Root Strategy:**
1. Create one React root that wraps the entire application
2. Temporarily mount jQuery components inside React using a wrapper
3. Convert jQuery views to React components one by one
4. Remove jQuery when all components are migrated

### Timeline: 3-4 Days

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| **1** | React environment setup + Legacy wrapper | jQuery app running inside React |
| **2** | Convert simple components (Player, Sidebar, FX) | 50% React migration |
| **3** | Convert medium components (Mixer, Synth, Sampler) | 80% React migration |
| **4** | Convert SessionView + Remove jQuery | 100% React migration |

## Implementation Plan

### Day 1: React Shell Setup

#### 1.1 Install Dependencies

```bash
npm install react react-dom zustand
npm install -D @types/react @types/react-dom
```

#### 1.2 Update Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ... existing config
});
```

#### 1.3 Create Legacy Wrapper Component

```tsx
// src/tsx/components/LegacyJQueryComponent.tsx
import React, { useEffect, useRef } from 'react';

interface LegacyJQueryComponentProps {
  ViewClass: any;
  model: any;
  className?: string;
}

export function LegacyJQueryComponent({
  ViewClass,
  model,
  className
}: LegacyJQueryComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mount jQuery view
    viewInstanceRef.current = new ViewClass(model, containerRef.current);

    return () => {
      // Cleanup
      viewInstanceRef.current?.destroy?.();
    };
  }, [ViewClass, model]);

  return <div ref={containerRef} className={className} />;
}
```

#### 1.4 Create App Component

```tsx
// src/tsx/App.tsx
import React, { useRef } from 'react';
import { LegacyJQueryComponent } from './components/LegacyJQueryComponent';
import { Player } from './Player';
import { Mixer } from './Mixer';
import { Session } from './Session';
import { PlayerView } from './PlayerView';
import { MixerView } from './MixerView';
import { SessionView } from './SessionView';
import { SidebarView } from './SidebarView';
// ... other imports

export function App() {
  // Models remain unchanged (Web Audio logic stays the same)
  const player = useRef(new Player()).current;
  const mixer = useRef(new Mixer()).current;
  const session = useRef(new Session()).current;

  return (
    <div className="evil-app">
      <LegacyJQueryComponent ViewClass={PlayerView} model={player} />
      <LegacyJQueryComponent ViewClass={SidebarView} model={session} />
      <LegacyJQueryComponent ViewClass={MixerView} model={mixer} />
      <LegacyJQueryComponent ViewClass={SessionView} model={session} />
      {/* ... other views */}
    </div>
  );
}
```

#### 1.5 Create Main Entry Point

```tsx
// src/tsx/main.tsx (replaces main.ts)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
```

#### 1.6 Update HTML Template

```html
<!-- views/index.ect -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/tsx/main.tsx"></script>
</body>
```

**Milestone:** jQuery app now runs inside a single React root.

---

### Day 2: Convert Simple Components

#### 2.1 Setup State Management

```tsx
// src/tsx/store.ts
import { create } from 'zustand';
import { Player } from './Player';
import { Mixer } from './Mixer';
import { Session } from './Session';

interface AppStore {
  player: Player;
  mixer: Mixer;
  session: Session;
}

export const useAppStore = create<AppStore>(() => ({
  player: new Player(),
  mixer: new Mixer(),
  session: new Session(),
}));
```

#### 2.2 Create Custom Hooks

```tsx
// src/tsx/hooks/useCanvas.ts
import { useRef, useEffect } from 'react';

export function useCanvas(
  draw: (ctx: CanvasRenderingContext2D) => void,
  deps: any[] = []
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, deps);

  return canvasRef;
}
```

#### 2.3 Convert PlayerView → PlayerControls Component

```tsx
// src/tsx/components/PlayerControls.tsx
import React, { useState } from 'react';
import { useAppStore } from '../store';

export function PlayerControls() {
  const player = useAppStore((s) => s.player);
  const [bpm, setBpm] = useState(player.bpm);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    player.play();
    setIsPlaying(true);
  };

  const handleStop = () => {
    player.stop();
    setIsPlaying(false);
  };

  const handleBpmChange = (value: number) => {
    setBpm(value);
    player.setBPM(value);
  };

  return (
    <div className="player-controls">
      <button onClick={handlePlay} disabled={isPlaying}>Play</button>
      <button onClick={handleStop} disabled={!isPlaying}>Stop</button>
      <input
        type="number"
        value={bpm}
        onChange={(e) => handleBpmChange(Number(e.target.value))}
      />
      {/* ... other controls */}
    </div>
  );
}
```

**Replace in App.tsx:**
```tsx
// Before
<LegacyJQueryComponent ViewClass={PlayerView} model={player} />

// After
<PlayerControls />
```

#### 2.4 Convert SidebarView → Sidebar Component

Similar pattern - convert jQuery event handlers to React event handlers.

#### 2.5 Convert FX Components

Convert individual FX view components (CompressorView, DelayView, etc.) to React.

**Milestone:** 50% of components are React-native.

---

### Day 3: Convert Medium Complexity Components

#### 3.1 Convert MixerView → Mixer Component

```tsx
// src/tsx/components/Mixer.tsx
import React from 'react';
import { useAppStore } from '../store';
import { VUMeter } from './VUMeter';

export function Mixer() {
  const mixer = useAppStore((s) => s.mixer);

  return (
    <div className="mixer">
      {mixer.tracks.map((track, index) => (
        <div key={index} className="mixer-track">
          <VUMeter level={track.level} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.gain}
            onChange={(e) => track.setGain(Number(e.target.value))}
          />
          {/* ... pan, effects, etc. */}
        </div>
      ))}
    </div>
  );
}
```

```tsx
// src/tsx/components/VUMeter.tsx
import React from 'react';
import { useCanvas } from '../hooks/useCanvas';

export function VUMeter({ level }: { level: number }) {
  const canvasRef = useCanvas((ctx) => {
    // Port existing VU meter drawing logic
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 100 - level, 10, level);
  }, [level]);

  return <canvas ref={canvasRef} width={10} height={100} />;
}
```

#### 3.2 Convert SynthView → Synth Component

Handle canvas-based sequencer interactions with `useCanvas` hook and React event handlers.

#### 3.3 Convert SamplerView → Sampler Component

Similar to SynthView - canvas for waveform display + React controls.

**Milestone:** 80% of components are React-native.

---

### Day 4: Convert SessionView & Cleanup

#### 4.1 Convert SessionView → Session Component (Most Complex)

**Key challenges:**
- Multiple canvases (tracks, master, on/off/hover layers)
- Drag-and-drop pattern copying
- Scroll synchronization
- Complex mouse interactions

**Strategy:**
```tsx
// src/tsx/components/Session.tsx
import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../store';

export function Session() {
  const session = useAppStore((s) => s.session);

  // Separate canvases for different layers
  const tracksCanvasRef = useRef<HTMLCanvasElement>(null);
  const masterCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Port existing canvas drawing logic
    const tracksCanvas = tracksCanvasRef.current;
    if (!tracksCanvas) return;

    const ctx = tracksCanvas.getContext('2d');
    // ... drawing logic
  }, [session]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Port existing click handler logic
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // ... interaction logic
  };

  return (
    <div className="session">
      <canvas
        ref={tracksCanvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />
      <canvas ref={masterCanvasRef} />
      <canvas ref={hoverCanvasRef} />
    </div>
  );
}
```

#### 4.2 Remove LegacyJQueryComponent

Once all components are converted, remove the legacy wrapper:
- Delete `src/tsx/components/LegacyJQueryComponent.tsx`
- Update `App.tsx` to use only React components

#### 4.3 Remove jQuery Dependency

```bash
npm uninstall jquery @types/jquery
```

#### 4.4 Replace `$.extend()` with Modern JavaScript

```typescript
// Before
const copy = $.extend(true, {}, original);

// After (use structuredClone for deep cloning)
const copy = structuredClone(original);
```

#### 4.5 Verify Build

```bash
npm run build
npm run dev
```

**Milestone:** 100% React migration complete, jQuery removed.

---

## Technical Guidelines

### Event Handler Migration

```tsx
// jQuery Pattern
$('#button').on('click', () => doSomething());

// React Pattern
<button onClick={() => doSomething()}>Click</button>
```

### Canvas Element Handling

Always use `useRef` for canvas elements:

```tsx
function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Drawing logic here
  }, []);

  return <canvas ref={canvasRef} />;
}
```

### State Management

Use Zustand for global state:

```tsx
// Define store
const useStore = create<State>((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
}));

// Use in component
function Component() {
  const value = useStore((s) => s.value);
  const increment = useStore((s) => s.increment);

  return <button onClick={increment}>{value}</button>;
}
```

### Model Integration

Keep existing Model classes (Player, Mixer, Session, etc.) unchanged:
- Models contain Web Audio API logic (should not be rewritten)
- React components consume models via Zustand store
- Models notify React components via state updates

---

## Migration Checklist

### Day 1
- [ ] Install React, ReactDOM, Zustand
- [ ] Update Vite config for React/JSX
- [ ] Create `LegacyJQueryComponent` wrapper
- [ ] Create `App.tsx` with all jQuery views mounted
- [ ] Create `main.tsx` entry point
- [ ] Update HTML template
- [ ] Verify app runs inside React root

### Day 2
- [ ] Setup Zustand store
- [ ] Create `useCanvas` hook
- [ ] Convert `PlayerView` → `PlayerControls`
- [ ] Convert `SidebarView` → `Sidebar`
- [ ] Convert FX components (Compressor, Delay, Reverb, Fuzz, Double)
- [ ] Test all converted components

### Day 3
- [ ] Convert `MixerView` → `Mixer` (including VU meters)
- [ ] Convert `SynthView` → `Synth`
- [ ] Convert `SamplerView` → `Sampler`
- [ ] Implement canvas interaction patterns
- [ ] Test audio functionality

### Day 4
- [ ] Convert `SessionView` → `Session` (most complex)
- [ ] Implement drag-and-drop in React
- [ ] Remove `LegacyJQueryComponent`
- [ ] Remove jQuery dependency from package.json
- [ ] Replace `$.extend()` with `structuredClone()`
- [ ] Run full build and test
- [ ] Clean up unused code

---

## Testing Strategy

1. **Manual Testing**: Test each component after conversion
2. **Audio Testing**: Verify Web Audio API functionality remains intact
3. **Browser Testing**: Test in Google Chrome (primary target)
4. **Performance Testing**: Compare render performance before/after
5. **Integration Testing**: Verify all components work together

---

## Rollback Strategy

If critical issues arise during migration:
1. Each day's work is in a separate commit
2. Can revert to previous day's state with `git revert`
3. `LegacyJQueryComponent` wrapper allows partial rollback (keep some jQuery views)

---

## Benefits After Migration

1. **Developer Experience**: Modern React DevTools, hot module replacement
2. **Performance**: Virtual DOM optimizations, efficient re-renders
3. **Maintainability**: Component-based architecture, clear data flow
4. **Testing**: Easier to write unit tests with React Testing Library
5. **Future-Proof**: Modern ecosystem, active community support
6. **Bundle Size**: Remove jQuery dependency (~87KB minified)

---

## References

- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## Next Steps

1. Review this plan with the team
2. Create a feature branch for migration
3. Begin Day 1 implementation
4. Daily progress reviews
5. Final testing and deployment

---

*Last Updated: 2025-12-29*
