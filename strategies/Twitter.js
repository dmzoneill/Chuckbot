const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// twitter previews 
// ####################################

class Twitter extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Twitter'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects twitter urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  async postTwitterPreview(self, config) {
    try {
      MessageStrategy.typing(self.message);

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
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
        await self.waitFor(300);
        vhIncrease = vhIncrease + calculatedVh;
      }

      MessageStrategy.typing(self.message);

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh });

      // Wait for a little bit more
      await self.waitFor(1500);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      MessageStrategy.typing(self.message);

      let data = await page.evaluate(() => document.querySelector('head').innerHTML);

      let re1 = /"og:description" data-rh="true"><meta content="(.*?)" property="og:image"/i;
      let match1 = re1.exec(data);

      let re2 = /property="og:title" data-rh="true"><meta content="(.*?)" property="og:description" data-rh="true">/i;
      let match2 = re2.exec(data);

      const responseImage = await axios(match1[1], { responseType: 'arraybuffer', headers: config['headers'] });
      const image = await resizeImg(responseImage.data, { width: 120, format: "jpg" });
      const buffer64 = Buffer.from(image, 'binary').toString('base64');

      MessageStrategy.typing(self.message);

      data = "data:image/jpeg;base64," + buffer64;
      self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, match2[1], data);
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Twitter']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.match(new RegExp(/^https:\/\/.*?twitter.com\/.*/))) {
      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://twitter.com/',
          'Pragma': 'no-cache',
          'Referer': 'https://twitter.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      };

      this.postTwitterPreview(self, config);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Twitter
}