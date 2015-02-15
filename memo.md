# 初期化の流れ

- Songを取得
  - URLから or Default
- Tracksを準備
  - Track, Device, FXの順番
  - connectする
  - clipsをロード
- Scenesを初期化
- 最後に currentTrack, currentScene をロード


# 各Classの役割

## Track
- Device, FXを持つ
- Gain, Panを管理


## Device
-


## Note
- PlainObjectで良い
- 時間をどう表す？
  - onとoffを別のイベントとすると、一つのノートの管理が煩雑になる (し、重そう)
- フィールド
  - NoteNumber: 音程 (MIDIに準拠)
  - Time: Clip内の絶対時間 (単位: pulse)
  - Duration: 長さ (単位: pulse)
  - DeltaTime: そのClip内の次のNoteまでの時間  (単位: pulse)
    - 挿入時に前後のNoteと計算

# 再生方法

- JSのレイテンシを見込み、ちょっと未来に音を鳴らす
  - osc.start(ctx.currentTime + latency) みたいにする
- loopの間隔はmsec決め打ち
  - 拍を基準にするとBPMでブレる
  - 100msecくらいで良い？

- 手順
  - 小節の頭では次のSceneを読み込む
  - 小節終わったらposをリセット
  - a
    ```python
    barDuration   = pulse * ppq * 4 * pulseTime
    sceneDuration = barDuration * sceneLength
    if pos > puls

    ```

  - 現在のSceneの各Clipについて
    ```python
    for clip in scene.clips:
      i = 0  
      while i < len(clip):
        if clip.isLoop:
          a
        else:

        ...

    ```


# アーキテクチャ

- フレームワーク使ってない
  - 候補1: Backbone
    - あんまり多機能である必要なし
    - Backbone、Modelは全てJSONに置き換えられる事前提だったり、謎の制約がある
    - もっと、なんか動いてるみたいな概念を上手くやりたい
  - 候補2: flux
    - DOMにたいするイベントはComponentで、他のロジックはStoreに全部入れるという雑な設計
    - DOMじゃない概念を上手くやりたい
  - 結局独自の仕組みに
    - fluxの拡張みたいな感じ
    - ComponentからのイベントのみFluxみたいに
    - Model同士のやりとりとかは普通に

- 概要
  - Model
    - ModelはSongに保存されるもののみ
    - Modelの生成はStoreに任せる
      - Model内では他のModel生成しない
  - Service
    - シーケンサーやプレイヤーなど、DOMと結びつかないけど裏でなんか動いてるやつ
      - AngularのServiceに近い
    - クリップボードもどき
    - キーバインド



# View
## SessionView
- curerntClip, currentScene, currentTrackは別々に管理する
- SessionView
  - setTrack, setClip, setScene は別々のイベントで
  - あとで複雑になったり重かったら検討する
