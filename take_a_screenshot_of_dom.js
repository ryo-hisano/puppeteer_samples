const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const selectors = [
		'#yDmH0d > c-wiz > div > div.FVeGwb.CVnAc > div.ajwQHc.BL5WZb.RELBvb.fV8ehb > div > main > c-wiz > div.lBwEZb.BL5WZb.xP6mwf > div.NiLAwe.mi8Lec.gAl5If.sMVRZe.Oc0wGc.R7GTQ.keNKEd.j7vNaf.nID9nc > div',
		'#yDmH0d > c-wiz > div > div.FVeGwb.CVnAc > div.ajwQHc.BL5WZb.RELBvb.fV8ehb > div > aside > c-wiz > div.lBwEZb.BL5WZb.xP6mwf.zvAjsd > div:nth-child(2)'
	];

	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 2
	});

	await page.goto('https://news.google.com/?hl=ja&gl=JP&ceid=JP:ja', {
		waitUntil: ['load', 'networkidle0']
	});

	let domNum = 0;
	while (selectors.length) {
		const selector = selectors.shift();
		const element = await page.$(selector);

		if (!element) {
			continue;
		}

		const clip = await page.evaluate(el => {
			const {
				width,
				height,
				top: y,
				left: x
			} = el.getBoundingClientRect();
			return { width, height, x, y };
		}, element);

		const base64Data = await page.screenshot({
			clip,
			encoding: 'base64'
		});

		domNum++;

		fs.writeFileSync(domNum + '.png', base64Data, 'base64');
	}

	await browser.close();
})();