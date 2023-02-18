const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Amazon
// ####################################

class Amazon extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Amazon', {
      enabled: true
    })
  }

  provides () {
    Amazon.self = this

    return {
      help: 'Shows previews for Amazon products',
      provides: {
        Preview: {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*?\.amazon\..*?\/.*/))
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Checks amazon links and provide previews'
          },
          action: function Preview (message) {
            Amazon.self.Preview(message)
            return true
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Amazon.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Amazon.enabled
      }
    }
  }

  async Preview (message) {
    try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()

      await page.goto(message.body)
      await page.setViewport({ width: 1366, height: 768 })

      const bodyHandle = await page.$('body')
      const { height } = await bodyHandle.boundingBox()

      MessageStrategy.typing(message)

      await bodyHandle.dispose()
      const calculatedVh = page.viewport().height
      let vhIncrease = 0
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh)
        }, calculatedVh)
        await Amazon.self.waitFor(500)
        vhIncrease = vhIncrease + calculatedVh
      }

      MessageStrategy.typing(message)

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh })

      // Wait for a little bit more
      await Amazon.self.waitFor(500)

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0)
      })

      MessageStrategy.typing(message)

      const title = await page.evaluate(() => {
        const desc = document.body.querySelector('#productTitle')
        if (desc) {
          return desc.innerText
        }
        return null
      })

      const image_url = await page.evaluate(() => {
        const image = document.body.querySelector('#landingImage')
        if (image) {
          return image.getAttribute('src')
        }
        return null
      })

      if (image_url == null) {
        return [null, null]
      } else {
        MessageStrategy.typing(message)
        const responseImage = await axios(image_url, { responseType: 'arraybuffer', headers: MessageStrategy.browser_config.headers })
        const image = await resizeImg(responseImage.data, { width: 200, format: 'jpg' })
        const buffer64 = Buffer.from(image, 'binary').toString('base64')
        const data = 'data:image/jpeg;base64,' + buffer64
        MessageStrategy.typing(message)
        MessageStrategy.client.sendLinkWithAutoPreview(message.from, message.body, title, data)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Amazon
}
