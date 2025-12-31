# Zustand State Management Migration Plan

## Overview

### Why Zustand
- SongをPOJOで一元管理可能
- `subscribeWithSelector`で部分購読
- `JSON.stringify(store.getState().song)`で即serialize
- React不要（vanilla JS対応）

### Target Data Flow
```
User Input → Store Action → State更新 ─┬→ View購読 → DOM
                                       └→ Audio購読 → WebAudio
```

---

## Progress Summary

### ✅ Completed

| Phase | Task | Commit |
|-------|------|--------|
| 1 | Zustand install & store.ts作成 | ✅ |
| 1 | subscribeWithSelector middleware | ✅ |
| 2 | Player → Store sync (BPM/Key/Scale/isPlaying) | ✅ |
| 2 | PlayerView ← Store subscribe | ✅ |
| 3 | Synth ← Store subscribe (Key/Scale) | ✅ |
| 4 | Session → Store sync (scenePos/currentCells) | ✅ |
| 4 | SessionView ← Store subscribe (scenePos/currentCells) | ✅ |
| 5 | SynthView ← Store subscribe (currentInstrument) | ✅ |
| 5 | SamplerView ← Store subscribe (currentInstrument) | ✅ |
| 5 | Player direct activate/deactivate removed | ✅ |

### 🔶 In Progress

| Component | Store Sync | Store Subscribe | Legacy Push |
|-----------|:----------:|:---------------:|:-----------:|
| Player | ✅ | - | ✅ removed |
| PlayerView | - | ✅ | 残存 |
| Session | ✅ | - | ✅ drawScene removed |
| SessionView | - | ✅ scenePos/cells | - |
| Synth | - | ✅ Key/Scale | - |
| SynthView | - | ✅ currentInstrument | pattern editing直接 |
| Sampler | - | - | - |
| SamplerView | - | ✅ currentInstrument | pattern editing直接 |

---

## Next Steps (Priority Order)

### Step 1: SessionView Subscribe Implementation
**Goal**: SessionがpushするdrawScene/beat呼び出しをStore購読に置換

**Tasks**:
- [ ] Store selectors追加: `selectScenePos`, `selectCurrentCells`
- [ ] SessionView.subscribeStore()実装
- [ ] scenePos変更時に`drawScene()`自動呼び出し
- [ ] currentCells変更時に`beat()`自動呼び出し
- [ ] Session内の`this.view.drawScene()`呼び出し削除

**Files**:
- `src/store.ts` - selectors追加
- `src/SessionView.ts` - subscribeStore()追加
- `src/Session.ts` - view push削除

### Step 2: SynthView/SamplerView Subscribe
**Goal**: Key/Scale以外のStore購読を追加

**Tasks**:
- [ ] Pattern変更時の再描画をStore経由に
- [ ] Store selectors追加: `selectCurrentPattern(trackIdx)`
- [ ] SynthView/SamplerView.subscribeStore()拡張

**Complexity**: High - pattern編集はtrack/cell indexのコンテキスト必要

### Step 3: Remove Legacy `this.model` References
**Goal**: View→Model直接参照を段階的にStore経由に置換

**Tasks**:
- [ ] PlayerView: `this.model.*` → `store.getState().*`
- [ ] SessionView: `this.model.*` → `store.getState().*`
- [ ] SynthView: `this.model.*` → `store.getState().*`
- [ ] SamplerView: `this.model.*` → `store.getState().*`

### Step 4: Action-based Pattern Editing
**Goal**: パターン編集をStore action経由に

**Tasks**:
- [ ] `setNote(trackIdx, cellIdx, noteData)` action追加
- [ ] `clearNote(trackIdx, cellIdx)` action追加
- [ ] SynthView/SamplerViewのマウスイベントをaction呼び出しに

### Step 5: Remove Legacy Model→View Push Calls
**Goal**: `this.view.drawXxx()`呼び出しを完全削除

**Tasks**:
- [ ] Player内のview push削除
- [ ] Session内のview push削除
- [ ] Synth内のview push削除
- [ ] Sampler内のview push削除

---

## Architecture Details

### Store Structure (Current)

```typescript
interface AppState {
  // Song Data
  song: Song;

  // Scene State
  scene: {
    bpm: number;
    key: string;
    scale: string;
    scenePos: number;
    currentCells: (number | undefined)[];
  };

  // Playback State
  playback: {
    isPlaying: boolean;
    time: number;
    isLoop: boolean;
  };

  // UI State
  ui: {
    currentInstrument: number;
  };

  // Actions
  setBPM: (bpm: number) => void;
  setKey: (key: string) => void;
  setScale: (scale: string) => void;
  setPlaying: (isPlaying: boolean) => void;
  setScenePos: (pos: number) => void;
  setCurrentCells: (cells: (number | undefined)[]) => void;
  setSong: (song: Song) => void;
}
```

### State Categories

#### A. Persistent Data (Song) → Store管理
- `Session.song`: 楽曲データ全体

#### B. Playback State → Store管理
| Location | State | Store |
|----------|-------|:-----:|
| `Player` | `is_playing`, `time` | ✅ |
| `Session` | `scene_pos`, `current_cells[]` | ✅ |
| `Synth/Sampler` | `time`, `is_on` | ❌ |

#### C. UI State → View-local維持
| View | State | Reason |
|------|-------|--------|
| `SessionView` | `hover_pos`, `click_pos` | 高頻度更新 |
| `SynthView` | `page`, `hover_pos`, `offset` | View固有 |
| `MixerView` | VUメーター | リアルタイム |

---

## Design Decisions

### Keep Direct (Store外)
- VU meter data (real-time audio analysis)
- Canvas hover/click coordinates (view-local)
- Animation frame timing
- `time` in Synth/Sampler (audio callback timing)

### Concerns & Mitigations

| Concern | Mitigation |
|---------|------------|
| Real-time Performance | オーディオ関連は直接コールバック維持 |
| UI State Overhead | hover等はView-local維持 |
| Circular Dependencies | Store経由で解消 |

---

## File Reference

### Modified Files
- `src/store.ts` - Central store
- `src/Player.ts` - Store sync
- `src/PlayerView.ts` - Store subscribe
- `src/Session.ts` - Store sync
- `src/Synth.ts` - Store subscribe

### To Be Modified
- `src/SessionView.ts` - Store subscribe追加
- `src/Synth/SynthView.ts` - Store subscribe拡張
- `src/Sampler/SamplerView.ts` - Store subscribe追加
