// NOT WORKING YET
const puppeteer = require('puppeteer');
(async () => {
    const proxyChain = require('proxy-chain');
    // change username & password
    const oldProxyUrl = ''; http://username:@proxy.crawlera.com:8011';
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

     const browser = await puppeteer.launch({
        executablePath: './src/driver/chrome-win/chrome.exe',
        ignoreHTTPSErrors: true,
        headless: false,
        args: [
            `--proxy-server=${newProxyUrl}`,
            '--ignore-certificate-errors',
        ]
     });
     const page = await browser.newPage({ ignoreHTTPSErrors: true });

     await page.setExtraHTTPHeaders({ 
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
		'upgrade-insecure-requests': '1', 
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
		'accept-encoding': 'gzip, deflate, br', 
		'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
	});
 
     console.log('Opening page ...');
     try {
         await page.goto('https://strawpoll.com/BJnX8L6vknv', { timeout: 180000, waitUntil: 'domcontentloaded' });
         await page.waitForSelector('fieldset.strawpoll-options.text-lg div .strawpoll-option')
         await page.evaluate(() => {
            const options = document.querySelectorAll('fieldset.strawpoll-options.text-lg div .strawpoll-option')
            options[1].querySelector('input').click()
         })
         await page.waitForSelector('button.strawpoll-button-primary.button')
         await page.evaluate(() => {
            document.querySelector('button.strawpoll-button-primary.button').click()
         })
     } catch(err) {
         console.log(err);
     }
})();