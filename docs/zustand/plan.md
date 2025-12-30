# Zustand State Management Migration Plan

## Why Zustand

- SongをPOJOで一元管理可能
- `subscribeWithSelector`で部分購読
- `JSON.stringify(store.getState().song)`で即serialize
- React不要（vanilla JS対応）

## Data Flow

```
User Input → Store Action → State更新 ─┬→ View購読 → DOM
                                       └→ Audio購読 → WebAudio
```

## Current State Analysis

### State Categories

#### A. Persistent Data (Song)
- `Session.song`: 楽曲データ全体

#### B. Playback State
| Location | State |
|----------|-------|
| `Player` | `is_playing`, `time`, `duration`, `current_instrument` |
| `Session` | `scene_pos`, `current_cells[]`, `next_scene_pos`, `is_loop` |
| `Synth/Sampler` | `time`, `is_on`, `is_sustaining` |

#### C. UI State (View-local)
| View | State |
|------|-------|
| `SessionView` | `select_pos`, `hover_pos`, `click_pos`, `is_clicked` |
| `SynthView` | `page`, `hover_pos`, `is_panel_opened`, `is_fx_view`, `offset` |
| `PlayerView` | `current_instrument`, `is_mixer` |
| `MixerView` | VUメーターのリアルタイムデータ |

### Current Coupling Pattern

```
Model ←→ View（双方向直接参照）
  - Model: this.view = new View(this)
  - View: this.model.property / this.model.method()
```

## Target Architecture

### Store Structure

```typescript
interface AppState {
  // Persistent
  song: Song;

  // Playback
  playback: {
    isPlaying: boolean;
    time: number;
    duration: number;
    scenePos: number;
    currentCells: (number | undefined)[];
    isLoop: boolean;
  };

  // UI (optional - may keep view-local)
  ui: {
    currentInstrument: number;
    isMixer: boolean;
  };

  // Actions
  setSong: (song: Song) => void;
  updateScene: (scenePos: number) => void;
  // ...
}
```

### Separation Steps

1. **Insert Store Layer**
   ```
   Model → Store → View（購読）
   View → Store Action → Model
   ```

2. **Remove Direct References**
   - `this.model.xxx` → `store.getState().xxx`
   - `this.model.method()` → `store.getState().action()`

3. **Remove Push Calls from Model**
   - `this.view.drawXxx()` → Store更新 → View購読で自動再描画

## Migration Phases

### Phase 1: Store Foundation
- [x] Install zustand
- [x] Create store with Song + Playback state
- [x] Add subscribeWithSelector middleware

### Phase 2: PlayerView Migration (Simplest)
- [x] Subscribe to playback state (isPlaying, BPM, Key, Scale)
- [x] Player syncs state to store
- [ ] Remove remaining `this.model` read references (future)

### Phase 3: AudioGraph Integration
- [x] Synth subscribes to Key/Scale from store
- [x] SynthCore oscillator frequencies update on Key change
- [x] Scale array and view update on Scale change
- [ ] Remove Player → Instrument push calls (future optimization)

### Phase 4: SessionView Migration
- [ ] Subscribe to song.tracks, currentCells
- [ ] Convert cuePattern/editPattern to actions
- [ ] Handle scene switching

### Phase 5: SynthView/SamplerView Migration
- [ ] Subscribe to pattern data
- [ ] Convert note editing to actions
- [ ] Handle page/scroll state

## Concerns & Mitigations

### 1. Real-time Performance
- VUメーター、playhead描画は高頻度更新（requestAnimationFrame）
- **Mitigation**: オーディオ関連は別チャネル（直接コールバック）で維持

### 2. UI State Overhead
- `hover_pos`等は毎フレーム更新 → Store経由は過剰
- **Mitigation**: View-local stateとして残す

### 3. Action Boilerplate
- 現状`this.model.cuePattern(x, y)`が直接呼び出し
- **Mitigation**: immerミドルウェア + シンプルなアクション

### 4. Circular Dependencies
- `SessionView` → `this.model.player.sidebar.show()`のようなチェーン
- **Mitigation**: Store経由で解消、移行中は段階的に対応

## Out of Scope (Keep Direct)

- VU meter data (real-time audio analysis)
- Canvas hover/click coordinates (view-local)
- Animation frame timing
