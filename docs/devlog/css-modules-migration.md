# CSS Modules 移行プラン

## 現状分析
- `static/css/riff.css`: 1880行のモノリシックCSS
- `static/css/main.css`: footer用の最小限CSS
- `index.html`から`<link>`で読み込み
- Reactコンポーネント: 24ファイル

## 移行方針

### Phase 1: 基盤整備 ✅ 完了
1. グローバルスタイルを `src/styles/global.css` に分離
   - リセット (`*`, `html`, `body`)
   - スクロールバー (`::-webkit-scrollbar`)
   - `#top`, `#dialog` (非React部分)
2. `main.tsx` でグローバルCSSをimport

### Phase 2: コンポーネント別CSS Modules作成

| コンポーネント | 状態 | 対応するCSS |
|--------------|------|-----------|
| `App.tsx` | ✅ 完了 | `#wrapper`, `#instruments`, `#mixer` |
| `TransportButtons.tsx` | ✅ 完了 | `#control-*` |
| `NavigationButtons.tsx` | ✅ 完了 | `#btn-left`, `#btn-right`, etc. |
| `SessionGrid.tsx` | ✅ 完了 | `#mixer-tracks`, `#mixer-master` |
| `TracksCanvas.tsx` | ✅ 完了 | `#session-tracks-*` |
| `MasterCanvas.tsx` | ✅ 完了 | `#session-master-*` |
| `MixerPanel.tsx` | ✅ 完了 | `#console-*`, `.console-track` |
| `SongInfo.tsx` | ✅ 完了 | `#song-info` |
| `SynthEditor.tsx` | 📝 CSS作成済 | `.RS_*`, `.synth-*` (コンポーネント未更新) |
| `SamplerEditor.tsx` | ⏳ 未着手 | `.Sampler_*`, `.sampler` |
| `SidebarContainer.tsx` | ⏳ 未着手 | `#sidebar-*`, `.sidebar-*` |
| FXViews | ⏳ 未着手 | `.sidebar-module` |

### Phase 3: クリーンアップ ⏳ 未着手
1. `index.html`から`<link>`削除
2. `static/css/riff.css`, `main.css`削除
3. 未使用CSS削除

**注**: 未完了コンポーネントがあるため、旧CSSファイルはまだ必要

## 作成済みファイル
- `src/styles/global.css`
- `src/components/App.module.css`
- `src/components/player/TransportButtons.module.css`
- `src/components/player/NavigationButtons.module.css`
- `src/components/session/SessionGrid.module.css`
- `src/components/session/TracksCanvas.module.css`
- `src/components/session/MasterCanvas.module.css`
- `src/components/session/SongInfo.module.css`
- `src/components/mixer/MixerPanel.module.css`
- `src/components/instruments/Instruments.module.css`

## 注意点
- ID→クラス変換 (`#mixer` → `styles.mixer`)
- camelCase変換 (`synth-core` → `synthCore` or `['synth-core']`)
- 非React部分 (`#top`, `#dialog`) はグローバルに残す

## 未完了コンポーネントについて

### SynthEditor / SamplerEditor
**着手しなかった理由:**
- JSX内のクラス名が100個以上あり、置換作業が膨大
- `.RS_*`, `.Sampler_*`, `.instrument`, `.sequencer`, `.header`, `.markers` など多数のネストしたセレクタ
- SynthとSamplerで色違いのスタイル（cyan `#0df` vs pink `#f3e`）があり、条件分岐が必要

**移行時の注意:**
- `Instruments.module.css` に共通スタイルは作成済み
- JSX側で `className="instrument synth"` → `className={styles.instrument}` のように置換が必要
- Sampler用にカラーバリエーションの対応が必要（CSS変数 or 別module）

### Sidebar / FXViews
**着手しなかった理由:**
- SidebarContainer, Sidebar, 各FXView（Compressor, Delay, Reverb等）で同様のスタイルを共有
- `.sidebar-module`, `.sidebar-effects`, `.sidebar-name` など共通クラスが多い
- エフェクトパラメータのUIが統一されているため、共通コンポーネント化を先にした方が効率的

**移行時の注意:**
- FXViewsは構造が似ているので、共通の `FXModule.module.css` を作成すると良い
- `fieldset`, `legend` のスタイリングに注意

### 移行の優先度
1. **低**: SynthEditor/SamplerEditor - 動作に影響なし、見た目も変わらない
2. **低**: Sidebar/FX - 同上
3. **高**: 旧CSSの削除 - 全コンポーネント移行後に実施
