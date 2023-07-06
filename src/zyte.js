const puppeteer = require('zyte-smartproxy-puppeteer')
const dotenv = require('dotenv')
const os = require('os')

dotenv.config()

const isWin = os.platform() === 'win32' ? true : false;
const spm_apikey = process.env.ZYTE_API_KEY;
const executablePath = isWin ? './src/driver/chrome-win/chrome.exe' : './src/driver/chrome-linux/chrome'

const randomMsNumber = (Math.floor(Math.random() * 6) + 1) * 1000;

async function getBrowser() {
    return await puppeteer.launch({
        executablePath,
        spm_apikey,
        ignoreHTTPSErrors: true,
        headless: false,
    });
}

async function vote() {
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.waitForTimeout(randomMsNumber)
    console.log('Opening page ...')
    try {
        await page.goto('https://strawpoll.com/kjn18WY3AyQ', { timeout: 180000, waitUntil: 'domcontentloaded' });
        await page.waitForSelector('fieldset.strawpoll-options.text-lg div .strawpoll-option')
        await page.evaluate(function() {
            const options = document.querySelectorAll('fieldset.strawpoll-options.text-lg div .strawpoll-option')
            options[1].querySelector('input').click()
        })
        await page.waitForSelector('button.strawpoll-button-primary.button')
        await page.evaluate(function() {
            document.querySelector('button.strawpoll-button-primary.button').click()
        })
        await page.waitForSelector('.strawpoll-vote-success-modal')
        const response = await page.evaluate(function() {
            const ok = document.querySelector('#modal-title').textContent.match(/Vote com sucesso/gmi)
            return ok && ok.length
        })
        console.log('Vote Response', response)
        await browser.close()
    } catch(err) {
        console.log(err);
        await browser.close()
    }
}

vote()