import Jimp from 'jimp';

// パラメータの定義
const sourceX = 0;
const sourceY = 8;
const width = 16;
const height = 4;
const destX = 0;
const destY = 0;

// メイン処理
async function main() {
    try {
        // コマンドライン引数の取得
        const [, , input1Path, input2Path, outputPath] = process.argv;

        if (!input1Path || !input2Path || !outputPath) {
            console.error('Usage: node index.js input1.png input2.png output.png');
            process.exit(1);
        }

        // 画像の読み込み
        const [image1, image2] = await Promise.all([
            Jimp.read(input1Path),
            Jimp.read(input2Path)
        ]);

        // 範囲チェック
        if (sourceX < 0 || sourceY < 0 ||
            sourceX + width > image1.getWidth() ||
            sourceY + height > image1.getHeight()) {
            console.error('Error: コピー範囲が入力画像1の範囲外です');
            process.exit(1);
        }

        if (destX < 0 || destY < 0 ||
            destX + width > image2.getWidth() ||
            destY + height > image2.getHeight()) {
            console.error('Error: コピー範囲が入力画像2の範囲外です');
            process.exit(1);
        }

        // 画像の切り出しと上書き
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = image1.getPixelColor(sourceX + x, sourceY + y);
                image2.setPixelColor(color, destX + x, destY + y);
            }
        }

        // 結果の保存
        await image2.writeAsync(outputPath);
        console.log('処理が完了しました');

    } catch (error) {
        console.error('エラーが発生しました:', error.message);
        process.exit(1);
    }
}

main();