const puppeteer = require('puppeteer');
const fs = require('fs');
const url = 'https://about.google/intl/ja_jp/';
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, {
		waitUntil: 'domcontentloaded'
	});
	await page.evaluate(url => {
		const head = document.getElementsByTagName('head')[0];
		head.insertAdjacentHTML(
			'afterbegin',
			'<base href="' + url + '" target="_self">'
		);
	}, url);
	const html = await page.content();
	await fs.writeFileSync('save.html', html);
	await browser.close();
})();
