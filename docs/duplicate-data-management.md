# データの二重管理問題

## 概要

このドキュメントでは、コードベース内でデータが複数箇所で管理されている問題箇所をリストアップします。

---

## 1. Player: bpm/key/scale と scene の二重管理 ✅ 解決済み

**ファイル**: `src/Player.ts`

**解決方法**: `scene` を単一ソースとし、`bpm`/`key`/`scale` を getter に変更

```typescript
export class Player {
  scene: Scene; // ← 単一ソース

  get bpm(): number {
    return this.scene.bpm;
  }

  get key(): NoteKey {
    return this.scene.key as NoteKey;
  }

  get scale(): NoteScale {
    return this.scene.scale as NoteScale;
  }
}
```

---

## 2. Synth: pattern と pattern_obj の二重管理 ✅ 解決済み

**ファイル**: `src/Synth.ts`

**解決方法**: `pattern_obj` を単一ソースとし、`pattern`/`pattern_name` を getter/setter に変更

```typescript
class Synth {
  pattern_obj: SynthPatternObject; // ← 単一ソース

  get pattern(): SynthPattern {
    return this.pattern_obj.pattern;
  }

  set pattern(value: SynthPattern) {
    this.pattern_obj.pattern = value;
  }

  get pattern_name(): string {
    return this.pattern_obj.name;
  }

  set pattern_name(value: string) {
    this.pattern_obj.name = value;
  }
}
```

---

## 3. Synth と SynthView: pattern の二重管理 ✅ 解決済み

**ファイル**:

- `src/Synth.ts`
- `src/Synth/SynthView.ts`

**解決方法**: View は Model.pattern を直接参照し、独自の pattern を持たない

```typescript
// SynthView.ts
export class SynthView {
  get pattern(): SynthPattern {
    return this.model.pattern;
  }

  get pattern_obj(): SynthPatternObject {
    return this.model.pattern_obj;
  }
}
```

---

## 4. Sampler と SamplerView: pattern の二重管理 ✅ 解決済み

**ファイル**:

- `src/Sampler.ts`
- `src/Sampler/SamplerView.ts`

**解決方法**: Synth/SynthView と同様に修正

```typescript
// Sampler.ts
class Sampler {
  pattern_obj: SamplerPatternObject; // ← 単一ソース

  get pattern(): SamplerPattern {
    return this.pattern_obj.pattern;
  }

  get pattern_name(): string {
    return this.pattern_obj.name;
  }
}

// SamplerView.ts
class SamplerView {
  get pattern(): SamplerPattern {
    return this.model.pattern;
  }

  get pattern_obj(): SamplerPatternObject {
    return this.model.pattern_obj;
  }
}
```

---

## 5. Player と Session: scene_length の二重管理 ✅ 解決済み

**ファイル**:

- `src/Player.ts`
- `src/Session.ts`

**解決方法**: Player.scene_length を単一ソースとし、Session は getter/setter で参照

```typescript
// Session.ts
class Session {
  get scene_length(): number {
    return this.player.scene_length;
  }

  set scene_length(value: number) {
    this.player.scene_length = value;
  }
}
```

---

## 6. Synth と SynthCore: scale の参照保持 ✅ 解決済み

**ファイル**:

- `src/Synth.ts`
- `src/Synth/SynthCore.ts`

**解決方法**: SynthCore.scale を getter にして parent.scale を参照

```typescript
// SynthCore.ts
export class SynthCore {
  get scale(): number[] {
    return this.parent.scale;
  }
}
```

---

## ステータス

| 優先度 | 問題                            | ステータス  |
| ------ | ------------------------------- | ----------- |
| 高     | 2. Synth: pattern/pattern_obj   | ✅ 解決済み |
| 高     | 3. Synth/SynthView: pattern     | ✅ 解決済み |
| 中     | 1. Player: bpm/key/scale/scene  | ✅ 解決済み |
| 中     | 5. Player/Session: scene_length | ✅ 解決済み |
| 低     | 4. Sampler/SamplerView          | ✅ 解決済み |
| 低     | 6. Synth/SynthCore: scale       | ✅ 解決済み |

**すべての問題が解決済みです。**
