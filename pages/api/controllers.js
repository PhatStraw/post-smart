const puppeteer = require('puppeteer')
const request = require('request-promise-native')
const promise = require('promise-poller')
const poll = promise.default

const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 10,
}

const key = 'aeb6076754a2494d821ff6e683aa10d2'

export default async (req, res) => {
  try {
    const browser = await puppeteer.launch(chromeOptions)
    const page = await browser.newPage()
    await page.goto('https://poshmark.com/login')
    const cap = await page.$('.g-recaptcha-con')
    const res1 = await page.$('#g-recaptcha-response')
    if (res1) {
      const requestId = await initiateCaptchaRequest(key)
      console.log('Request id', requestId)
      await page.type(
        '.form-group #login_form_username_email',
        'kevinsims1@outlook.com'
      )
      await page.type('#login_form_password', 'Wakeland1!')

      const response = await pollForRequestResults(key, requestId)
      console.log('26')
      await page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
      )
      console.log('30')
      await page.click('.btn-primary')
      const share = await page.$(
        '.sell'
      )

      if (share) {
        await page.click('.sell')
      }
      res.status(200).json({ data: 'yes' })
    }
    //first attempt
    await page.type(
      '.form-group #login_form_username_email',
      'kevinsims1@outlook.com'
    )
    await page.type('#login_form_password', 'Wakeland1!')
    await page.click('.btn-primary')

    const share = await page.$('.sell')

    if (share) {
      await page.click('.sell')
      
    }

    //second request
    const requestId = await initiateCaptchaRequest(key)

    await page.type('#login_form_password', 'Wakeland1!')

    const response = await pollForRequestResults(key, requestId)

    await page.evaluate(
      `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
    )

    await page.click('.btn-primary')

    page.click('.sell')

    res.status(200).json({ data: 'yes' })
  } catch (err) {
    console.log(err)
    res.status(404).json(err)
  }
}

async function initiateCaptchaRequest(apiKey) {
  const formData = {
    method: 'userrecaptcha',
    key, // your 2Captcha API Key
    googlekey: '6Lc6GRkTAAAAAK0RWM_CD7tUAGopvrq_JHRrwDbD',
    pageurl: 'https://poshmark.com/login',
    json: 1,
  }
  const response = await request.post('http://2captcha.com/in.php', {
    form: formData,
  })
  return JSON.parse(response).request
}

async function pollForRequestResults(
  key,
  id,
  retries = 100,
  interval = 1500,
  delay = 15000
) {
  await timeout(delay)
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries,
  })
}

function requestCaptchaResults(apiKey, requestId) {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`
  return async function () {
    return new Promise(async function (resolve, reject) {
      const rawResponse = await request.get(url)
      const resp = JSON.parse(rawResponse)
      if (resp.status === 0) return reject(resp.request)
      resolve(resp.request)
    })
  }
}

const timeout = (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis))
