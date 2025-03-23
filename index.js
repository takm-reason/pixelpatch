import Jimp from 'jimp';

async function main() {
    try {
        // コマンドライン引数の取得
        const [, , input1Path, input2Path, outputPath,
            sourceX = "0", sourceY = "8",
            width = "16", height = "4",
            destX = "0", destY = "0",
            rotate = "0"] = process.argv;

        if (!input1Path || !input2Path || !outputPath) {
            console.error('Usage: node index.js input1.png input2.png output.png [sourceX] [sourceY] [width] [height] [destX] [destY] [rotate]');
            console.error('Default values: sourceX=0, sourceY=8, width=16, height=4, destX=0, destY=0, rotate=0');
            console.error('rotate: 0=回転なし, 90=90度, 180=180度, 270=270度');
            process.exit(1);
        }

        // 数値に変換
        const params = {
            sourceX: parseInt(sourceX, 10),
            sourceY: parseInt(sourceY, 10),
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            destX: parseInt(destX, 10),
            destY: parseInt(destY, 10),
            rotate: parseInt(rotate, 10)
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

        // 回転角度の検証
        if (![0, 90, 180, 270].includes(params.rotate)) {
            console.error('Error: 回転角度は0, 90, 180, 270のいずれかである必要があります');
            process.exit(1);
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

        // 回転後のサイズを考慮
        const rotatedWidth = params.rotate === 90 || params.rotate === 270 ? params.height : params.width;
        const rotatedHeight = params.rotate === 90 || params.rotate === 270 ? params.width : params.height;

        if (params.destX + rotatedWidth > image2.getWidth() ||
            params.destY + rotatedHeight > image2.getHeight()) {
            console.error('Error: コピー範囲が入力画像2の範囲外です');
            process.exit(1);
        }

        // 切り出した部分を新しい画像として作成
        const crop = new Jimp(params.width, params.height);
        for (let y = 0; y < params.height; y++) {
            for (let x = 0; x < params.width; x++) {
                const color = image1.getPixelColor(params.sourceX + x, params.sourceY + y);
                crop.setPixelColor(color, x, y);
            }
        }

        // 回転処理
        switch (params.rotate) {
            case 90:
                crop.rotate(90);
                break;
            case 180:
                crop.rotate(180);
                break;
            case 270:
                crop.rotate(270);
                break;
        }

        // 回転後の画像を上書き
        const rotatedCrop = crop.bitmap;
        for (let y = 0; y < rotatedCrop.height; y++) {
            for (let x = 0; x < rotatedCrop.width; x++) {
                const idx = (y * rotatedCrop.width + x) << 2;
                const color = Jimp.rgbaToInt(
                    rotatedCrop.data[idx],
                    rotatedCrop.data[idx + 1],
                    rotatedCrop.data[idx + 2],
                    rotatedCrop.data[idx + 3]
                );
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