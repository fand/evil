# データの二重管理問題

## 概要

このドキュメントでは、コードベース内でデータが複数箇所で管理されている問題箇所をリストアップします。

---

## 1. Player: bpm/key/scale と scene の二重管理

**ファイル**: `src/Player.ts:26-32`

**現状**:
```typescript
export class Player {
  bpm: number = 120;           // ← 個別プロパティ
  key: NoteKey = 'A';          // ← 個別プロパティ
  scale: NoteScale = 'Major';  // ← 個別プロパティ
  scene: Scene;                // ← scene.bpm, scene.key, scene.scale も保持
}
```

**問題点**:
- `this.bpm` と `this.scene.bpm` が同じ値を保持
- `setBPM()`, `setKey()`, `setScale()` で両方を更新する必要がある

**同期コード例** (`Player.ts:58-63`):
```typescript
setBPM(bpm: number) {
  this.bpm = bpm;
  this.scene.bpm = this.bpm;  // ← 両方更新
  // ...
}
```

**改善案**: `scene` を単一ソースにし、`bpm`/`key`/`scale` を getter に変更

---

## 2. Synth: pattern と pattern_obj の二重管理

**ファイル**: `src/Synth.ts:32-34`

**現状**:
```typescript
export class Synth {
  pattern_name: string;        // ← 個別プロパティ
  pattern: PatternNote[];      // ← 個別プロパティ
  pattern_obj: PatternObject;  // ← pattern_obj.name, pattern_obj.pattern も保持
}
```

**問題点**:
- `this.pattern` と `this.pattern_obj.pattern` が同じ配列を指すべき
- `this.pattern_name` と `this.pattern_obj.name` が同じ値を保持すべき
- `setPattern()`, `clearPattern()`, `getPattern()` で同期が必要

**同期コード例** (`Synth.ts:190-193`):
```typescript
setPattern(pattern_obj: PatternObject) {
  this.pattern_obj = JSON.parse(JSON.stringify(pattern_obj));
  this.pattern = this.pattern_obj.pattern;
  this.pattern_name = this.pattern_obj.name;
}
```

**改善案**: `pattern_obj` を単一ソースにし、`pattern`/`pattern_name` を getter に変更

---

## 3. Synth と SynthView: pattern の二重管理

**ファイル**:
- `src/Synth.ts:33` - Synth.pattern
- `src/Synth/SynthView.ts:75-76` - SynthView.pattern, pattern_obj

**現状**:
```typescript
// Synth.ts
export class Synth {
  pattern: PatternNote[];
}

// SynthView.ts
export class SynthView {
  pattern: PatternNote[];      // ← Model と同じデータを保持
  pattern_obj: PatternObject;
}
```

**問題点**:
- View が Model と同じパターンデータを独自に保持
- 編集時に両方を更新する必要がある
- `addNote()`, `removeNote()`, `sustainNote()` で View → Model の同期が必要

**同期コード例** (`SynthView.ts:436-450`):
```typescript
addNote(x: number, y: number) {
  // View の pattern を更新
  this.pattern[x][y] = { note: y, ... };
  // Model に同期
  this.model.addNote(x, y);
}
```

**改善案**: View は Model.pattern を直接参照し、独自の pattern を持たない

---

## 4. Sampler と SamplerView: pattern の二重管理

**ファイル**:
- `src/Sampler.ts:22-24`
- `src/Sampler/SamplerView.ts`

**現状**: Synth/SynthView と同じ構造の問題

**改善案**: Synth/SynthView と同様に修正

---

## 5. Player と Session: scene_length の二重管理

**ファイル**:
- `src/Player.ts:40` - Player.scene_length
- `src/Session.ts:20, 363` - Session.scene_length

**現状**:
```typescript
// Player.ts
export class Player {
  scene_length: number = 32;
}

// Session.ts
class Session {
  scene_length: number;
}
```

**問題点**:
- 両方が独立して `scene_length` を保持
- `nextScene()` で Session が更新後、`player.setSceneLength()` で Player に同期

**同期コード例** (`Session.ts:126`):
```typescript
nextScene() {
  // ...
  this.scene_length = Math.max(this.scene_length, pat.pattern.length);
  this.player.setSceneLength(this.scene_length);  // ← 同期
}
```

**改善案**: Player.scene_length を単一ソースにし、Session は player.scene_length を参照

---

## 6. Synth と SynthCore: scale の参照保持

**ファイル**:
- `src/Synth.ts:37` - Synth.scale
- `src/Synth/SynthCore.ts:358` - SynthCore.scale

**現状**:
```typescript
// Synth.ts
export class Synth {
  scale: NoteScale;
}

// SynthCore.ts - 初期化時に Synth.scale を受け取り保持
export class SynthCore {
  scale: NoteScale;
}
```

**問題点**:
- SynthCore が初期化時に scale を受け取り独自に保持
- Synth.setScale() で Synth.scale が更新されるとき、SynthCore.scale も更新が必要

**改善案**: SynthCore は Synth への参照を持ち、必要時に synth.scale を参照

---

## 優先度

| 優先度 | 問題 | 理由 |
|--------|------|------|
| 高 | 2. Synth: pattern/pattern_obj | 頻繁に操作される中核データ |
| 高 | 3. Synth/SynthView: pattern | MVC の責務分離に関わる |
| 中 | 1. Player: bpm/key/scale/scene | 比較的単純な修正 |
| 中 | 5. Player/Session: scene_length | 比較的単純な修正 |
| 低 | 4. Sampler/SamplerView | Synth の修正後に同様に対応 |
| 低 | 6. Synth/SynthCore: scale | 影響範囲が限定的 |
