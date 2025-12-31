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

| Component | Store Sync | Store Subscribe | Legacy Push | Status |
|-----------|:----------:|:---------------:|:-----------:|:------:|
| Player | ✅ | - | ✅ removed | ✅ |
| PlayerView | - | ✅ | - | ✅ |
| Session | ✅ | - | ✅ removed | ✅ |
| SessionView | - | ✅ scenePos/cells/beat | - | ✅ |
| Synth | - | ✅ Key/Scale | setPattern残存 | 🔶 |
| SynthView | - | ✅ currentInstrument | - | ✅ |
| Sampler | - | - | setPattern残存 | 🔶 |
| SamplerView | - | ✅ currentInstrument | - | ✅ |

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

### ✅ Step 3: Remove Legacy `this.model` References (完了)
**Goal**: View→Model直接参照をcontroller経由に置換

**Tasks**:
- [x] Controller layer作成 (`src/controller.ts`)
- [x] PlayerView: `this.model.*` → `controller.*`
- [x] SessionView: `this.model.*` → `controller.*`
- [x] SynthView: `this.model.*` → `controller.*` (pattern getters維持)
- [x] SamplerView: `this.model.*` → `controller.*` (pattern getters維持)
- [x] Instrument interface更新 (plusPattern/minusPattern追加)

**Architecture**:
```
View → controller.action() → Player/Session/Model
                          ↓
                    store.getState().action() → state更新
```

**Note**: Pattern gettersはdirect mutation用に維持。Step 4で対応。

### Step 4: Action-based Pattern Editing (保留)
**Goal**: パターン編集をStore action経由に

**Status**: 保留 - 以下の理由で後回し:
- Pattern mutationは高頻度で発生 (マウスドラッグ中など)
- 毎回immutable updateはパフォーマンス問題
- React化後もローカルstate + 保存時sync が推奨パターン

**代替アプローチ**:
- 編集中: 現行のdirect mutation維持
- 保存時: store.song にsync
- 表示: store.song から読み取り (React components)

**将来的なTasks** (必要に応じて):
- [ ] setNote/clearNote/sustainNote actions
- [ ] SynthView/SamplerView action経由に
- [ ] Pattern store subscription

### ✅ Step 5: Remove Legacy Model→View Push Calls (部分完了)
**Goal**: `this.view.drawXxx()`呼び出しを完全削除

**Completed Tasks**:
- [x] Player.moveRight/moveLeft - activate/deactivate削除 (store購読に移行)
- [x] Session.nextPattern/nextScene - drawScene削除 (store購読に移行)
- [x] SynthView/SamplerView - currentInstrument購読でactivate/deactivate自動化

**Completed Tasks** (continued):
- [x] Session.beat() - store.triggerBeat()経由に移行

**Remaining Tasks (保留)**:
- [ ] Synth.setPattern() - view.setPattern()呼び出し
- [ ] Sampler.setPattern() - view.setPattern()呼び出し
- [ ] Synth/Sampler - その他view push

**Remaining Tasks Status**: 保留 - 以下の理由で後回し:
- setPattern(): Pattern直接mutationと連動。React化時にlocal state + sync方式が適切
- 現行のView pushは動作に問題なし。React化時にcomponentで置き換え予定

### Step 6: Song完全Store管理
**Goal**: Song全体をStoreで管理、JSON.stringify可能に

**Tasks**:
- [ ] Store: `song` stateをimmutableに管理
- [ ] Session: `this.song` → `store.getState().song`
- [ ] 保存/読込: store経由
- [ ] Undo/Redo基盤 (optional)

---

## 残タスク (React化に向けて必須)

| # | Task | Effort | Status |
|---|------|--------|--------|
| 3 | this.model参照削除 | Medium | ✅ 完了 (controller経由) |
| 4 | Pattern action化 | High | 保留 (React化後) |
| 5 | 残りのpush削除 | Medium | 🔶 部分完了 (主要部分完了) |
| 6 | Song完全Store管理 | High | 未着手 |
| 7 | React化 | High | 未着手 |

**Current Status**:
- Controller layer完成、主要なView→Model参照をcontroller経由に
- Store購読によるactivate/deactivate/drawScene自動化完了
- 残りのview pushは保留（React化時にcomponentで置き換え）

**Goal**: React化時にstoreをそのまま使用可能な状態にする。

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
