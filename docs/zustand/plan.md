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

### ✅ Step 1: SessionView Subscribe Implementation (完了)
**Goal**: SessionがpushするdrawScene/beat呼び出しをStore購読に置換

**Tasks**:
- [x] Store selectors追加: `selectScenePos`, `selectCurrentCells`
- [x] SessionView.subscribeStore()実装
- [x] scenePos変更時に`drawScene()`自動呼び出し
- [x] Session内の`this.view.drawScene()`呼び出し削除
- [ ] currentCells変更時に`beat()`自動呼び出し (未実装 - beatは別機構)

### ✅ Step 2: SynthView/SamplerView Subscribe (部分完了)
**Goal**: currentInstrument購読でactivate/deactivate

**Tasks**:
- [x] `selectCurrentInstrument` selector追加
- [x] SynthView.subscribeStore() - currentInstrument購読
- [x] SamplerView.subscribeStore() - currentInstrument購読
- [x] Player.moveRight/moveLeft - 直接呼び出し削除
- [ ] Pattern変更時の再描画をStore経由に (複雑 - 保留)

**Note**: Pattern編集は直接mutations維持。Store経由は複雑すぎる。

### Step 3: Remove Legacy `this.model` References
**Goal**: View→Model直接参照を段階的にStore経由に置換

**Priority**: Medium - 動作に問題なければ後回し可

**Tasks**:
- [ ] PlayerView: `this.model.*` → `store.getState().*`
- [ ] SessionView: `this.model.*` → `store.getState().*`
- [ ] SynthView: `this.model.*` → `store.getState().*`
- [ ] SamplerView: `this.model.*` → `store.getState().*`

### Step 4: Action-based Pattern Editing
**Goal**: パターン編集をStore action経由に

**Priority**: Low - 大規模リファクタリング必要

**Tasks**:
- [ ] `setNote(trackIdx, cellIdx, noteData)` action追加
- [ ] `clearNote(trackIdx, cellIdx)` action追加
- [ ] SynthView/SamplerViewのマウスイベントをaction呼び出しに

**Blocker**: Pattern編集はtrack/cell indexのコンテキスト必要。現状の直接mutationで問題なし。

### Step 5: Remove Legacy Model→View Push Calls
**Goal**: `this.view.drawXxx()`呼び出しを完全削除

**Priority**: Low - Store購読で代替可能な箇所のみ

**Tasks**:
- [x] Player.moveRight/moveLeft - activate/deactivate削除
- [x] Session.nextPattern/nextScene - drawScene削除
- [ ] Session.beat() - view.beat()呼び出し (リアルタイム - Store不向き)
- [ ] Synth/Sampler - view.setPattern()等 (pattern sync必要)

---

## 残タスク優先度

| Priority | Task | Effort |
|----------|------|--------|
| Low | Step 3: this.model参照削除 | Medium |
| Low | Step 4: Pattern action化 | High |
| - | Step 5: 残りのpush削除 | pattern sync依存 |

**現状で十分動作**。追加の移行は必要に応じて実施。

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
