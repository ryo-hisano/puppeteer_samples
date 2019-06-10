const puppeteer = require('puppeteer');
const fs = require('fs');
const config_file = 'config.txt';
let msg = '';
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://www.google.co.jp/', {
		waitUntil: 'domcontentloaded'
	});

	// config_fileの変更を監視
	await fs.watch(
		config_file,
		{
			recursive: true
		},
		function(type, filename) {
			// ファイル内容が変わったイベントでないなら無視
			if (type !== 'change') {
				return;
			}

			// config_fileの変更時のみ
			if (filename === config_file && type === 'change') {
				// config_fileの内容を読み取り
				const msg2 = fs.readFileSync(config_file, {
					encoding: 'utf-8'
				});
				// 直前のファイル内容と異なったら実行
				if (msg2 !== msg) {
					msg = msg2;
					trySearch(msg);
				}
			}
		}
	);

	// 指定のクエリでGoogle検索し、結果を検索クエリ名.pngでスクリーンショット保存
	async function trySearch(msg) {
		console.log(msg);
		await page.evaluate(msg => {
			document.querySelector('#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input').value = msg;
			document.querySelector('#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input.gNO89b').click();
		}, msg);
		await page.waitForNavigation();
		await page.screenshot({ path: msg + '.png', fullPage: true });
		await browser.close();
		process.exit(1);
	}
})();
