# Legacy Server API Reference

Express + MongoDB serverの仕様書（アーカイブ用）

## Endpoints

### Songs API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/songs` | 曲一覧取得 |
| POST | `/api/songs` | 曲作成 (CSRF) |
| GET | `/api/songs/:song_id` | 曲取得 |
| PUT | `/api/songs/:song_id` | 曲更新 (CSRF) |

### Pages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/:song_id` | 曲ページ表示 |
| GET | `/*` | メインページ |
| POST | `/*` | 曲作成 (CSRF) |
| GET | `/ie` | IE用ページ (dev only) |
| GET | `/mobile` | モバイル用ページ (dev only) |
| GET | `/test` | テストページ (dev only) |

## Models

### Song

```javascript
{
  _id: String,        // UUID (auto-generated)
  title: String,      // default: 'Untitled'
  creator: String,    // default: 'Anonymous'
  user_id: ObjectId,  // optional
  json: String        // required - 曲データJSON
}
```

### User

```javascript
{
  name: String,
  email: String,          // lowercase, unique
  role: String,           // default: 'user'
  hashedPassword: String,
  provider: String,       // 'github' | 'twitter' | 'facebook' | 'google' | null
  salt: String,
  facebook: Object,
  twitter: Object,
  github: Object,
  google: Object
}
```

## Notes

- セッション管理: connect-mongo (MongoStore)
- 認証: Passport.js
- CSRF保護: csurf middleware
