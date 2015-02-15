# 開発日記

## 2015/02/16

今のSessionViewの方式は良くない。
song.tracks[0].clipsによって描画するComponentの種類が変化し、
状態を入力として表示が一意に定まるというImmutabilityの恩恵を得られない。
ということに↓の記事で気付いた
[http://ympbyc.hatenablog.com/entry/2015/02/15/%E9%96%A2%E6%95%B0%E5%9E%8BUI%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0:title]

あと、あるsongを編集中に別のsongをドラッグして結合するときに、ドラッグした場所にゴースト？を出すことが出来ない。

改善策としては、
  - Clip: clipのあるセル
  - Empty: sceneはあるがclipのないセル
  - Invisible: sceneまたはtrackのないセル (右: 最も右のtrackの右に1列存在 下: 表示できるだけ存在)
の3通りの描画を行うComponentを作って、現在のセルのComponentを全部統合する

Invisible、まだまだ先の機能だけど、やり方としては
  - 表示領域の高さを取得し、描画できるだけ追加する
  - 予め余裕を持って生成し、1階層上のラッパーで`overflow:hidden`して隠す (ちょっと見切れてても良い)
の2通りがある。
後者の方が良さそう。
