# pixelpatch

PNGファイルの特定領域を別のPNGファイルに上書きするシンプルなツールです。

## 機能

- PNG画像から指定した領域を切り出し
- 別のPNG画像の指定位置に上書き
- 画像サイズは任意（範囲チェック機能付き）

## インストール

```bash
git clone [repository-url]
cd pixelpatch
npm install
```

## 使用方法

```bash
node index.js input1.png input2.png output.png [sourceX] [sourceY] [width] [height] [destX] [destY]
```

### パラメータ

すべてのパラメータは0以上の整数である必要があります。

| パラメータ | デフォルト値 | 説明 |
|------------|--------------|------|
| input1.png | （必須）     | 切り出し元のPNG画像 |
| input2.png | （必須）     | 上書き先のPNG画像 |
| output.png | （必須）     | 出力先のパス |
| sourceX    | 0           | 切り出し開始X座標 |
| sourceY    | 8           | 切り出し開始Y座標 |
| width      | 16          | 切り出し幅 |
| height     | 4           | 切り出し高さ |
| destX      | 0           | 貼り付け先X座標 |
| destY      | 0           | 貼り付け先Y座標 |

### 例

デフォルト値を使用：
```bash
node index.js sprite1.png sprite2.png result.png
```

パラメータを指定：
```bash
node index.js sprite1.png sprite2.png result.png 10 20 32 32 5 5
```

この例では、sprite1.pngの(10,20)から32x32ピクセルの領域を切り出し、
sprite2.pngの(5,5)に上書きした結果がresult.pngとして保存されます。

## エラー処理

以下の場合にエラーメッセージを表示します：

- コマンドライン引数が不足している場合
- パラメータが不正な値の場合（負の数や数値以外）
- 指定した領域が入力画像1の範囲外の場合
- 指定した領域が入力画像2の範囲外の場合
- 画像の読み込みや保存に失敗した場合

## 依存パッケージ

- [jimp](https://github.com/oliver-moran/jimp) - Node.jsの画像処理ライブラリ

## ライセンス

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.