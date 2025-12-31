# React Migration Plan

## Overview

jQuery ViewをReact componentに段階的に置き換える。Zustand storeは既存のものを活用し、`zustand/react`のhooksを追加。

### Target Architecture
```
store.song (single source of truth)
    │
    ├─→ React components (useStore hooks)
    │
    └─→ Audio engine (vanilla subscribe)
```

---

## Phase 1: Infrastructure Setup

### 1.1 Dependencies

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react
```

### 1.2 Vite Configuration

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), legacy()],
})
```

### 1.3 TypeScript Configuration

```json
// tsconfig.json に追加
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### 1.4 useStore Hook

```typescript
// src/hooks/useStore.ts
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { store, type Store } from '../store'

export const useAppStore = <T>(selector: (state: Store) => T): T => {
  return useStore(store, selector)
}

export { useShallow }
```

### 1.5 React Entry Point

```typescript
// src/react/index.tsx
import { createRoot } from 'react-dom/client'
import { App } from './App'

export function mountReactApp() {
  const container = document.getElementById('react-root')
  if (container) {
    const root = createRoot(container)
    root.render(<App />)
  }
}
```

### Checklist
- [ ] Install React dependencies
- [ ] Configure Vite plugin
- [ ] Update tsconfig.json
- [ ] Create useStore hook
- [ ] Create React entry point
- [ ] Add `#react-root` to index.html (or mount into existing DOM)

---

## Phase 2: PlayerView → PlayerControls

### Target
`PlayerView.ts` (287行) → `PlayerControls.tsx`

### Current PlayerView Responsibilities
| Feature | Store State | Action |
|---------|-------------|--------|
| Play/Pause | `playback.isPlaying` | `controller.play/pause` |
| Stop | - | `controller.stop` |
| Forward/Backward | - | `controller.forward/backward` |
| Loop toggle | `playback.isLoop` | `controller.toggleLoop` |
| BPM input | `scene.bpm` | `controller.setBPM` |
| Key select | `scene.key` | `controller.setKey` |
| Scale select | `scene.scale` | `controller.setScale` |
| Navigation (←→↑↓) | - | `controller.moveLeft/Right/Top/Bottom` |

### Component Structure
```
src/components/
├── player/
│   ├── PlayerControls.tsx    # Main container
│   ├── TransportButtons.tsx  # Play/Stop/Forward/Backward/Loop
│   ├── SceneParams.tsx       # BPM/Key/Scale inputs
│   └── NavigationButtons.tsx # Left/Right/Top/Bottom
```

### Migration Steps
1. Create `PlayerControls.tsx` with store subscription
2. Mount React component into `#control` element
3. Remove jQuery event bindings from `PlayerView.ts`
4. Delete `PlayerView.ts` once React version is stable

### Checklist
- [ ] Create PlayerControls.tsx
- [ ] Create TransportButtons.tsx
- [ ] Create SceneParams.tsx
- [ ] Create NavigationButtons.tsx
- [ ] Mount into DOM
- [ ] Remove PlayerView.ts
- [ ] Update main.ts

---

## Phase 3: SessionView → SessionGrid

### Target
`SessionView.ts` (1239行) → `SessionGrid.tsx`

### Challenges
- 6つのCanvasレイヤー (tracks, master, on, hover)
- マウスイベント処理 (hover, click, drag)
- ダイアログ表示

### Component Structure
```
src/components/
├── session/
│   ├── SessionGrid.tsx       # Main container
│   ├── TracksCanvas.tsx      # Tracks canvas layer
│   ├── MasterCanvas.tsx      # Master canvas layer
│   ├── useCanvasDrawing.ts   # Canvas描画hooks
│   └── SaveDialog.tsx        # Save/Share dialog
```

### Canvas Strategy
```tsx
// useRef + useEffect for canvas rendering
const canvasRef = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  const ctx = canvasRef.current?.getContext('2d')
  if (ctx) {
    drawTracks(ctx, song.tracks, currentCells)
  }
}, [song.tracks, currentCells])
```

### Checklist
- [x] Create SessionGrid.tsx
- [x] Create TracksCanvas.tsx with canvas drawing hooks
- [x] Create MasterCanvas.tsx with canvas drawing hooks
- [x] Create canvasUtils.ts (drawing utilities)
- [x] Create types.ts (shared types and constants)
- [x] Create usePlayImage.ts hook
- [x] Create SongInfo.tsx
- [x] Create SessionViewAdapter.ts (handles dialogs, syncs store)
- [x] Handle mouse events (hover, click, drag, double-click)
- [ ] Create SaveDialog.tsx (dialogs still in SessionViewAdapter)
- [x] Remove SessionView.ts

---

## Phase 4: SynthView / SamplerView

### Target
- `SynthView.ts` → `SynthEditor.tsx`
- `SamplerView.ts` → `SamplerEditor.tsx`

### Shared Components
```
src/components/
├── instruments/
│   ├── InstrumentEditor.tsx  # Shared wrapper
│   ├── PatternGrid.tsx       # Note grid (shared)
│   ├── SynthControls.tsx     # Synth-specific
│   └── SamplerControls.tsx   # Sampler-specific
```

### Pattern Editing Strategy
- Local state for real-time editing
- Debounced sync to store
- `patternVersions` for optimistic updates

```tsx
const [localPattern, setLocalPattern] = useState(pattern)

// Debounced sync
useEffect(() => {
  const timer = setTimeout(() => {
    store.getState().updateTrackPattern(trackIdx, patternIdx, localPattern)
  }, 300)
  return () => clearTimeout(timer)
}, [localPattern])
```

### Checklist
- [ ] Create PatternGrid.tsx (shared)
- [ ] Create SynthEditor.tsx
- [ ] Create SamplerEditor.tsx
- [ ] Remove SynthView.ts
- [ ] Remove SamplerView.ts

---

## Phase 5: Remaining Views

### MixerView → MixerPanel
- Volume/Pan sliders
- Mute/Solo buttons

### SidebarView → Sidebar
- Pattern info display
- Scene length control

### FX Views
- FXView → FXPanel
- Individual effect controls

---

## File Structure (Final)

```
src/
├── components/
│   ├── player/
│   │   ├── PlayerControls.tsx
│   │   ├── TransportButtons.tsx
│   │   ├── SceneParams.tsx
│   │   └── NavigationButtons.tsx
│   ├── session/
│   │   ├── SessionGrid.tsx
│   │   ├── TracksCanvas.tsx
│   │   ├── MasterCanvas.tsx
│   │   └── SaveDialog.tsx
│   ├── instruments/
│   │   ├── PatternGrid.tsx
│   │   ├── SynthEditor.tsx
│   │   └── SamplerEditor.tsx
│   ├── mixer/
│   │   └── MixerPanel.tsx
│   └── App.tsx
├── hooks/
│   ├── useStore.ts
│   └── useCanvasDrawing.ts
├── store.ts          # Existing (keep)
├── controller.ts     # Existing (keep)
├── main.ts           # Updated to mount React
└── ...audio files    # Unchanged
```

---

## Migration Strategy

### Coexistence Period
During migration, jQuery and React will coexist:

```typescript
// main.ts
const player = new Player(ctx)

// Mount React components into existing DOM
mountReactApp()

// Gradually remove jQuery views as React versions are ready
```

### DOM Mount Points
Option A: Replace existing elements
```html
<!-- Before: jQuery renders into #control -->
<!-- After: React mounts into #control -->
<div id="control"></div>
```

Option B: Add React root alongside
```html
<div id="control"><!-- jQuery --></div>
<div id="react-player"><!-- React --></div>
```

**Recommended**: Option A (cleaner final state)

---

## Progress Tracking

| Phase | Component | Status |
|-------|-----------|--------|
| 1 | Infrastructure | ✅ Complete |
| 2 | PlayerControls | ✅ Complete |
| 3 | SessionGrid | ✅ Complete |
| 4 | SynthEditor | 🔲 Not started |
| 4 | SamplerEditor | 🔲 Not started |
| 5 | MixerPanel | 🔲 Not started |
| 5 | Sidebar | 🔲 Not started |
| 5 | FX Views | 🔲 Not started |

---

## Notes

### Keep Outside React
- Audio engine (WebAudio callbacks)
- `MutekiTimer` (timing critical)
- `controller.ts` (bridge layer)

### Testing Strategy
- Manual testing after each component migration
- Verify store subscription works correctly
- Check audio playback is not affected
