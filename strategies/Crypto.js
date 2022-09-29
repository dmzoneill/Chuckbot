const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// crypto - coin market cap
// ####################################

class Crypto extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static coinslugs = [];
  static coins = null;

  constructor() {
    super();
    MessageStrategy.state['Crypto'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Downloads the top 30 coins from coin market cap and provides images and other states"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['coin', 'coin ([a-zA-Z0-9]+)']
  }

  get_coin_value(slug) {
    for (var i = 0; i < Crypto.coins.length; i++) {
      if (Crypto.coins[i]['slug'] == slug) {
        return parseFloat(Crypto.coins[i]['quote']['EUR']['price']).toFixed(2)
      }
    }
    return "0";
  }

  get_coin(slug) {
    for (var i = 0; i < Crypto.coins.length; i++) {
      if (Crypto.coins[i]['slug'] == slug) {
        return Crypto.coins[i];
      }
    }
    return {};
  }

  async cmp(self) {
    const apiKey = fs.readFileSync("strategies/config/coincap-api.key").toString().trim();
    const client = new CoinMarketCap(apiKey);

    MessageStrategy.typing(self.message);

    client.getTickers(
      {
        convert: 'EUR',
        limit: 30
      }
    ).then((value) => {
      Crypto.coinslugs = [];
      let coins = value['data'];
      Crypto.coins = coins;

      let msg = "```";
      for (var i = 0; i < coins.length; i++) {
        Crypto.coinslugs.push(coins[i]['slug']);
        var symbol = coins[i]['symbol'];
        var total = 5 - symbol.length;
        var padding = ' '.repeat(total)
        var price = parseFloat(coins[i]['quote']['EUR']['price']).toFixed(2);
        msg += symbol + padding + " : €" + price + "\n";
        if (i % 5 == 4) msg += "\n";
      }

      self.client.sendText(self.message.from, msg.trim() + "```");
    }).catch(err => {
      console.log(err);
      self.client.sendText(self.message.from, err);
    });
  }

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  async get_graph(self, message) {
    let coin = message.body.split(" ")[1];

    if (!Crypto.coinslugs.includes(coin)) {
      MessageStrategy.typing(self.message);
      self.client.sendText(message.from, "Available coins\n\n" + Crypto.coinslugs.join("\n"));
      return;
    }

    (async () => {
      try {
        MessageStrategy.typing(self.message);

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://coinmarketcap.com/currencies/' + coin + '/');
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
          await this.waitFor(300);
          vhIncrease = vhIncrease + calculatedVh;
        }

        MessageStrategy.typing(self.message);

        // Setting the viewport to the full height might reveal extra elements
        await page.setViewport({ width: 1366, height: calculatedVh });

        // Wait for a little bit more
        await this.waitFor(1500);

        // Scroll back to the top of the page by using evaluate again.
        await page.evaluate(_ => {
          window.scrollTo(0, 0);
        });

        const button = await page.waitForSelector("#cmc-cookie-policy-banner > div.cmc-cookie-policy-banner__close");
        if (button) {
          await button.click();
        }

        MessageStrategy.typing(self.message);

        await page.waitForXPath('/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[9]/div/div[2]')
        let xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]';
        await page.waitForXPath(xpath);
        // wait for the selector to load
        let element = await page.$x(xpath);
        let sha = crypto.createHash('sha1').digest('hex');
        let text = await page.evaluate(element => element.textContent, element[0]);
        await element[0].screenshot({ path: sha + '.png' });
        await browser.close();

        if (!fs.existsSync(sha + '.png')) {
          self.client.sendText(message.from, "Problem, try again");
          return;
        }

        MessageStrategy.typing(self.message);
        let coindetails = self.get_coin(coin);
        let coin_msg = "";
        coin_msg += "*" + coindetails.name + "* 🪙 ";
        coin_msg += "*" + parseFloat(coindetails.quote.EUR.percent_change_24h).toFixed(2).toString() + "%* (24hr)";
        coin_msg += coindetails.quote.EUR.percent_change_24h > 0 ? "🔺\n" : "🔻\n";
        coin_msg += "\n";
        coin_msg += "```";
        coin_msg += "Symbol           : " + coindetails.symbol + "\n";
        coin_msg += "Slug             : " + coindetails.slug + "\n";
        coin_msg += "Max supply       : " + coindetails.max_supply + "\n";
        coin_msg += "Supply           : " + coindetails.circulating_supply + "\n";
        coin_msg += "\n";
        coin_msg += "Price 🇪🇺        : €" + self.get_coin_value(coin) + "\n";
        coin_msg += "Volume 24h       : " + Math.round(coindetails.quote.EUR.volume_24h).toString() + "\n";
        coin_msg += "Market Cap       : €" + Math.round(coindetails.quote.EUR.market_cap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n";
        coin_msg += "Market Dominance : " + parseFloat(coindetails.quote.EUR.market_cap_dominance).toFixed(2).toString() + "%";
        coin_msg += "```";

        await self.client.sendImage(
          message.from,
          sha + '.png',
          "",
          coin_msg);

        if (fs.existsSync(sha + '.png')) {
          fs.unlinkSync(sha + '.png');
        }

      } catch (err) {
        console.log(err);
        self.client.sendText(message.from, err);
      }
    })();
  }

  handleMessage(message) {
    if (MessageStrategy.state['Crypto']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'coin') {
      this.cmp(this);
      return true;
    }

    if (this.message.body.match(/^coin ([0-9a-z\-]+)$/i) != null) {
      this.get_graph(this, this.message);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Crypto
}