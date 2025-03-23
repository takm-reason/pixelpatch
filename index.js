import Jimp from 'jimp';

async function main() {
    try {
        // コマンドライン引数の取得
        const [, , input1Path, input2Path, outputPath,
            sourceX = "0", sourceY = "8",
            width = "16", height = "4",
            destX = "0", destY = "0"] = process.argv;

        if (!input1Path || !input2Path || !outputPath) {
            console.error('Usage: node index.js input1.png input2.png output.png [sourceX] [sourceY] [width] [height] [destX] [destY]');
            console.error('Default values: sourceX=0, sourceY=8, width=16, height=4, destX=0, destY=0');
            process.exit(1);
        }

        // 数値に変換
        const params = {
            sourceX: parseInt(sourceX, 10),
            sourceY: parseInt(sourceY, 10),
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            destX: parseInt(destX, 10),
            destY: parseInt(destY, 10)
        };

        // パラメータのバリデーション
        for (const [key, value] of Object.entries(params)) {
            if (isNaN(value)) {
                console.error(`Error: ${key}は有効な数値である必要があります`);
                process.exit(1);
            }
            if (value < 0) {
                console.error(`Error: ${key}は0以上である必要があります`);
                process.exit(1);
            }
        }

        // 画像の読み込み
        const [image1, image2] = await Promise.all([
            Jimp.read(input1Path),
            Jimp.read(input2Path)
        ]);

        // 範囲チェック
        if (params.sourceX + params.width > image1.getWidth() ||
            params.sourceY + params.height > image1.getHeight()) {
            console.error('Error: コピー範囲が入力画像1の範囲外です');
            process.exit(1);
        }

        if (params.destX + params.width > image2.getWidth() ||
            params.destY + params.height > image2.getHeight()) {
            console.error('Error: コピー範囲が入力画像2の範囲外です');
            process.exit(1);
        }

        // 画像の切り出しと上書き
        for (let y = 0; y < params.height; y++) {
            for (let x = 0; x < params.width; x++) {
                const color = image1.getPixelColor(params.sourceX + x, params.sourceY + y);
                image2.setPixelColor(color, params.destX + x, params.destY + y);
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