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
  let images
  try {
    const browser = await puppeteer.launch(chromeOptions)
    const page = await browser.newPage()
    await page.goto('https://poshmark.com/login')
    const captchaPresent = await page.$('#g-recaptcha-response')
    if (captchaPresent) {
      console.log('captcha present, 21')
      const requestId = await initiateCaptchaRequest(key)

      await page.type(
        '.form-group #login_form_username_email',
        'kevinsims1@outlook.com'
      )
      await page.type('#login_form_password', 'Wakeland1!')

      const response = await pollForRequestResults(key, requestId)

      await page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
      )

      await page.click('.btn-primary')

      const share = await page.$('.sell')

      if (share) {
        page.click('.sell')
        console.log('sell btn, 81')

        await page.waitForSelector('input[type=file]')
        await page.waitFor(1000)

        // get the ElementHandle of the selector above
        const inputUploadHandle = await page.$('input[type=file]')

        if (inputUploadHandle) {
          await inputUploadHandle.uploadFile('public/hola.png')

          await page.waitForSelector('.form__actions > .btn--primary')
          await page.waitFor(1000)

          page.click('.form__actions > .btn--primary')
        }

        await page.$eval(
          '.listing-editor__title__text__suffix',
          (e) => (e.value = 'Ralph Lauren Hoodie')
        )

        await page.$eval(
          '.listing-editor__description__input',
          (e) => (e.value = 'Comfiest sweater ive ever owned')
        )

        await page.click('[data-et-name=category]')

        await page.$$eval('.dropdown__menu__item', (elements) => {
          const element = elements.find(
            (element) => element.innerHTML === '<a>Tops</a>'
          )
          element.click()
        })
      }

      res.status(200).json({ data: 'yes' })
    }

    //first attempt
    console.log('first attempt, 70')

    await page.type(
      '.form-group #login_form_username_email',
      'kevinsims1@outlook.com'
    )
    await page.type('#login_form_password', 'Wakeland1!')
    await page.click('.btn-primary')

    const share = await page.$('.sell')

    if (share) {
      page.click('.sell')
        console.log('sell btn, 81')

        await page.waitForSelector('input[type=file]')
        await page.waitFor(1000)

        // get the ElementHandle of the selector above
        const inputUploadHandle = await page.$('input[type=file]')

        if (inputUploadHandle) {
          await inputUploadHandle.uploadFile('public/hola.png')

          await page.waitForSelector('.form__actions > .btn--primary')
          await page.waitFor(1000)

          page.click('.form__actions > .btn--primary')
        }

        await page.$eval(
          '.listing-editor__title__text__suffix',
          (e) => (e.value = 'Ralph Lauren Hoodie')
        )

        await page.$eval(
          '.listing-editor__description__input',
          (e) => (e.value = 'Comfiest sweater ive ever owned')
        )

        await page.click('[data-et-name=category]')
          console.log('125')
        await page.$$eval('.dropdown__menu ws--nowrap > .dropdown__menu__item > dropdown__link', async (elements) => {
          
          const element = await elements.find(
            (element) => {
              console.log(element)
              element.innerHTML === 'Tops'
            }
          )
          element.click()
        })
    }

    //second request
    console.log('second attempt, 129')

    const requestId = await initiateCaptchaRequest(key)

    await page.type('#login_form_password', 'Wakeland1!')

    const response = await pollForRequestResults(key, requestId)

    await page.evaluate(
      `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
    )

    await page.click('.btn-primary')
    console.log('primary btn, 78')

    page.click('.sell')
    console.log('sell btn, 81')

    await page.waitForSelector('input[type=file]')
    await page.waitFor(1000)

    // get the ElementHandle of the selector above
    const inputUploadHandle = await page.$('input[type=file]')

    if (inputUploadHandle) {
      await inputUploadHandle.uploadFile('public/hola.png')

      await page.waitForSelector('.form__actions > .btn--primary')
      await page.waitFor(1000)

      page.click('.form__actions > .btn--primary')
    }

    await page.$eval(
      '.listing-editor__title__text__suffix',
      (e) => (e.value = 'Ralph Lauren Hoodie')
    )

    await page.$eval(
      '.listing-editor__description__input',
      (e) => (e.value = 'Comfiest sweater ive ever owned')
    )

    await page.click('[data-et-name=category]')

    await page.$$eval('.dropdown__menu__item', (elements) => {
      const element = elements.find(
        (element) => element.innerHTML === '<a>Tops</a>'
      )
      element.click()
    })

    // await postPosh(page)

    res.status(200).json({ data: 'yes' })
  } catch (err) {
    console.log(err)
    res.status(404).json(err)
  }
}

async function postPosh(page) {
  page.click('.sell')

  await page.waitForSelector('input[type=file]')
  await page.waitFor(1000)

  // get the ElementHandle of the selector above
  const inputUploadHandle = await page.$('input[type=file]')

  if (inputUploadHandle) {
    await inputUploadHandle.uploadFile('public/hola.png')

    page.click('.form__actions > .btn--primary')
  }

  await page.$eval(
    '.listing-editor__title__text__suffix',
    (e) => (e.value = 'Ralph Lauren Hoodie')
  )

  await page.$eval(
    '.listing-editor__description__input',
    (e) => (e.value = 'Comfiest sweater ive ever owned')
  )

  await page.click('[data-et-name=category]')

  await page.$$eval('.dropdown__menu__item', (elements) => {
    const element = elements.find(
      (element) => element.innerHTML === '<a>Tops</a>'
    )
    element.click()
  })
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
