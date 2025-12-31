# Zustand State Management Migration Plan

## Overview

### Target Data Flow
```
User Input → Store Action → State更新 ─┬→ View購読 → DOM
                                       └→ Audio購読 → WebAudio
```

### Why Zustand
- SongをPOJOで一元管理、`JSON.stringify`で即serialize
- `subscribeWithSelector`で部分購読
- React不要（vanilla JS対応）

---

## Phase 1: Vanilla JS Integration ✅ Complete

### Summary
Zustand storeを作成し、既存のjQuery ViewがStore経由で状態を購読する形に移行完了。

### Completed Steps

| Step | Task | Status |
|------|------|:------:|
| 1-2 | Store作成 & Player/Session sync | ✅ |
| 3 | Controller layer (this.model削除) | ✅ |
| 4 | Pattern action化 | 保留 (React化時) |
| 5 | Model→View push削除 | ✅ |
| 6 | Song Store同期 | ✅ |

### Component Status (All Complete)

| Component | Store Sync | Store Subscribe |
|-----------|:----------:|:---------------:|
| Player | BPM/Key/Scale/isPlaying | - |
| PlayerView | - | isPlaying/BPM/Key/Scale/isLoop |
| Session | scenePos/cells + syncSongToStore | - |
| SessionView | - | scenePos/cells/beat |
| Synth | patternRefresh | Key/Scale |
| SynthView | - | currentInstrument/patternVersions |
| Sampler | patternRefresh | - (不要) |
| SamplerView | - | currentInstrument/patternVersions |

### Current Data Flow
```
Session.song (runtime source of truth)
    │
    ├─→ Instrument.pattern (working copy)
    │       │
    │       └─→ store.triggerPatternRefresh() → View re-render
    │
    └─→ syncSongToStore() → store.song (React読み取り用)
```

---

## Phase 2: React Migration (Next)

### Goal
jQuery ViewをReact componentに置き換え、store.songをsingle source of truthに。

### Approach
1. React infrastructure setup (entry point, useStore hook)
2. 小さいcomponentから順次React化
3. Pattern編集はReact component内でlocal state + debounce sync
4. Pattern action化は不要（local stateで対応）

### Target Data Flow (Post-React)
```
store.song (single source of truth)
    │
    ├─→ React components (useStore購読)
    │
    └─→ Audio engine (vanilla subscribe)
```

### Migration Order (Proposed)
1. PlayerView (controls) - 最もシンプル
2. SessionView (grid) - Canvas描画あり
3. SynthView/SamplerView - Pattern編集、最も複雑

---

## Architecture

### Store Structure (`src/store.ts`)

```typescript
interface AppState {
  song: Song;
  scene: { bpm, key, scale };
  playback: { isPlaying, scenePos, currentCells, beat };
  ui: { currentInstrument, patternVersions };
}
```

### Keep Outside Store
- VU meter (real-time audio callback)
- Canvas hover/click (view-local state)
- Synth/Sampler time (audio callback timing)

---

## Key Files

| File | Role |
|------|------|
| `src/store.ts` | Central Zustand store |
| `src/controller.ts` | View→Model bridge |
| `src/Session.ts` | Song管理 + syncSongToStore |
| `src/*View.ts` | Store subscribe (jQuery) |
