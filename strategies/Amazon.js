const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Amazon
// ####################################

class Amazon extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Amazon', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Logs media to disk"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Amazon']
  }

  async postAmazonPreview(self) {
    try {
      console.log("1");

      console.log(self.message.body);

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

      console.log("2");

      await page.goto(self.message.body);
      await page.setViewport({ width: 1366, height: 768 });

      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();

      MessageStrategy.typing(self.message);

      await bodyHandle.dispose();
      const calculatedVh = page.viewport().height;
      let vhIncrease = 0;
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh);
        }, calculatedVh);
        await self.waitFor(500);
        vhIncrease = vhIncrease + calculatedVh;
      }

      MessageStrategy.typing(self.message);

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh });

      // Wait for a little bit more
      await self.waitFor(500);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      MessageStrategy.typing(self.message);

      console.log("3");

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

      console.log(title);
      console.log(image_url);

      if (image_url == null) {
        return [null, null];
      }
      else {
        MessageStrategy.typing(self.message);
        const responseImage = await axios(image_url, { responseType: 'arraybuffer', headers: config['headers'] });
        const image = await resizeImg(responseImage.data, { width: 200, format: "jpg" });
        const buffer64 = Buffer.from(image, 'binary').toString('base64');
        let data = "data:image/jpeg;base64," + buffer64;
        MessageStrategy.typing(self.message);
        self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, title, data);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Amazon']['enabled'] == false) return;
    this.message = message;

    if (this.message.body.match(new RegExp(/^https:\/\/.*?\.amazon\..*?\/.*/))) {
      this.postAmazonPreview(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Amazon
}