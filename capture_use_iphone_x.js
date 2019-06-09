const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const ua = devices['iPhone X'];
	await page.emulate(ua);
	await page.goto('https://www.yahoo.co.jp/');
	await page.screenshot({ path: 'yahoo.png', fullPage: true });
	await browser.close();
})();