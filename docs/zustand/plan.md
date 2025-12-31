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

## Current Status

| Step | Task | Status |
|------|------|:------:|
| 1-2 | Store作成 & Player/Session sync | ✅ |
| 3 | Controller layer (this.model削除) | ✅ |
| 4 | Pattern action化 | 保留 |
| 5 | Model→View push削除 | 🔶 主要部分完了 |
| 6 | Song Store同期 | 🔶 syncSongToStore完了 |
| 7 | React化 | 未着手 |

### Component Status

| Component | Store Sync | Store Subscribe | Status |
|-----------|:----------:|:---------------:|:------:|
| Player | ✅ BPM/Key/Scale/isPlaying | - | ✅ |
| PlayerView | - | ✅ isPlaying/BPM | ✅ |
| Session | ✅ scenePos/cells + syncSong | - | ✅ |
| SessionView | - | ✅ scenePos/cells/beat | ✅ |
| Synth | ✅ patternRefresh | ✅ Key/Scale | 🔶 |
| SynthView | - | ✅ currentInstrument/pattern | ✅ |
| Sampler | ✅ patternRefresh | - | 🔶 |
| SamplerView | - | ✅ currentInstrument/pattern | ✅ |

---

## Remaining Tasks

### 保留中 (React化時に対応)

1. **Pattern action化** - 高頻度mutation、React化後にlocal state + sync で対応
2. **残りのview push** - play/stop/redraw等はReact componentで置き換え
3. **Song完全Store管理** - `store.song`をsingle source of truthに

### React化に向けて

現在の設計:
```
Session.song (runtime) ──sync──→ store.song (React読み取り用)
```

React化後:
```
store.song (single source of truth) ←→ React components
```

---

## Architecture

### Store Structure

```typescript
interface AppState {
  song: Song;
  scene: { bpm, key, scale };
  playback: { isPlaying, scenePos, currentCells, beat };
  ui: { currentInstrument, patternVersions };
}
```

### Keep Outside Store
- VU meter (real-time audio)
- Canvas hover/click (view-local)
- Synth/Sampler time (audio callback)

---

## Key Files

| File | Role |
|------|------|
| `src/store.ts` | Central store |
| `src/controller.ts` | View→Model bridge |
| `src/Session.ts` | Song管理 + syncSongToStore |
| `src/*View.ts` | Store subscribe |
