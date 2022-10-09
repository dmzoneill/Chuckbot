const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Amazon
// ####################################

class Amazon extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Amazon', {
      'enabled': true
    });
  }

  provides() {
    Amazon.self = this;

    return {
      help: 'Amazon previews',
      provides: {
        'Amazon': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*?\.amazon\..*?\/.*/));
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Checks amazon links and provide previews';
          },
          action: function Preview(message) {
            Amazon.self.Preview(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Amazon']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Amazon']['enabled'];
      }
    }
  }

  async Preview(message) {
    try {
      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://google.com/',
          'Pragma': 'no-cache',
          'Referer': 'https://google.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      };


      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();

      await page.goto(message.body);
      await page.setViewport({ width: 1366, height: 768 });

      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();

      MessageStrategy.typing(message);

      await bodyHandle.dispose();
      const calculatedVh = page.viewport().height;
      let vhIncrease = 0;
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh);
        }, calculatedVh);
        await Amazon.self.waitFor(500);
        vhIncrease = vhIncrease + calculatedVh;
      }

      MessageStrategy.typing(message);

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh });

      // Wait for a little bit more
      await Amazon.self.waitFor(500);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      MessageStrategy.typing(message);

      let title = await page.evaluate(() => {
        let desc = document.body.querySelector('#productTitle');
        if (desc) {
          return desc.innerText;
        }
        return null;
      });

      let image_url = await page.evaluate(() => {
        let image = document.body.querySelector('#landingImage');
        if (image) {
          return image.getAttribute("src")
        }
        return null;
      });

      if (image_url == null) {
        return [null, null];
      }
      else {
        MessageStrategy.typing(message);
        const responseImage = await axios(image_url, { responseType: 'arraybuffer', headers: config['headers'] });
        const image = await resizeImg(responseImage.data, { width: 200, format: "jpg" });
        const buffer64 = Buffer.from(image, 'binary').toString('base64');
        let data = "data:image/jpeg;base64," + buffer64;
        MessageStrategy.typing(message);
        MessageStrategy.client.sendLinkWithAutoPreview(message.from, message.body, title, data);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: Amazon
}