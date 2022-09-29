const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// hyperlink previews 
// ####################################

class HyperLink extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['HyperLink'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  async postOGPreview(self) {
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
      await self.waitFor(300);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      MessageStrategy.typing(self.message);

      let data = await page.evaluate(() => document.querySelector('head').innerHTML);

      let re1a = /<meta.*?content="(.*?)".*?property=\"og:image\".*?>/i;
      let match1a = re1a.exec(data);

      let re1b = /<meta.*?property=\"og:image\".*?content="(.*?)".*?>/i;
      let match1b = re1b.exec(data);

      let re2a = /<meta.*?content="(.*?)".*?property=\"og:description\".*?>/i;
      let match2a = re2a.exec(data);

      let re2b = /<meta.*?property=\"og:description\".*?content="(.*?)".*?>/i;
      let match2b = re2b.exec(data);

      let imageurl = match1a == null ? match1b[1] : match1a[1];
      let descurl = match2a == null ? match2b[1] : match2a[1];

      const responseImage = await axios(imageurl, { responseType: 'arraybuffer', headers: config['headers'] });
      const image = await resizeImg(responseImage.data, { width: 120, format: "jpg" });
      const buffer64 = Buffer.from(image, 'binary').toString('base64');

      MessageStrategy.typing(self.message);

      data = "data:image/jpeg;base64," + buffer64;
      self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, descurl, data);
    }
    catch (err) {
      MessageStrategy.typing(this.message);
      MessageStrategy.client.sendLinkWithAutoPreview(this.message.from, this.message.body);
      console.log(err);
    }
  }


  handleMessage(message) {
    if (MessageStrategy.state['HyperLink']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.match(new RegExp(/^(http|https):\/\/.*/))) {

      if (this.message.body.indexOf('tiktok') > -1) return;
      if (this.message.body.indexOf('yout') > -1) return;
      if (this.message.body.indexOf('facebook') > -1) return;

      if ("thumbnail" in this.message) {
        return;
      }

      this.postOGPreview(this);

      return true;
    }
    
    return false;
  }
}


module.exports = {
  MessageStrategy: HyperLink
}