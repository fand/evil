# TODO

## Phase 1: 緊急対応

- [x] songs.js バグ修正 (err変数スコープ外)
- [x] users.js バグ修正 (同上 + nullチェック)
- [x] user.js `new Buffer()` → `Buffer.from()`
- [x] middleware.js nullチェック追加
- [x] Express非推奨パターン修正 (`res.send(404)` → `res.status(404).send()`)
- [x] npm audit fix (セキュリティ脆弱性対応)
  - 78件の脆弱性の大半はdev deps (gulp, browserify等) 由来
  - Vite移行で解消予定
  - passport等の本番用はPhase 3で対応

## Phase 2: 大規模改修 (既知)

- [x] CoffeeScript → TypeScript移行
- [ ] Vite移行 (Gulp + Browserify + Watchify廃止)
- [ ] React移行

## Phase 3: 追加改修

- [ ] Passport v0.2 → v0.7 更新
- [ ] ESLint/Prettier導入
- [ ] テストフレームワーク刷新 (Vitest/Jest)
- [ ] 未使用依存関係削除 (jade, connect, gulp-uglify)
- [ ] lodash v3 → v4

## Phase 4: ポリッシュ

- [ ] ドキュメント整備
- [ ] CI/CD導入
- [ ] MongoDB廃止
