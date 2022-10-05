const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// crypto - coin market cap
// ####################################

class Crypto extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static coinslugs = {};
  static coins = null;

  constructor() {
    super('Crypto', {
      'enabled': true
    });
    this.get_coins(this);
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Downloads the top 30 coins from coin market cap and provides images and other states"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['coin', 'coin ([a-zA-Z0-9]+)', 'coin ([0-9a-z\-]+) ([137])(d|m|y)']
  }

  get_coin_value(slug) {
    for (var i = 0; i < Crypto.coins.length; i++) {
      if (Crypto.coins[i]['slug'] == slug) {
        return parseFloat(Crypto.coins[i]['quote']['EUR']['price']).toFixed(3)
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

  async get_coins(self) {
    const apiKey = fs.readFileSync("strategies/config/coincap-api.key").toString().trim();
    const client = new CoinMarketCap(apiKey);

    client.getTickers(
      {
        convert: 'EUR',
        limit: 1000
      }
    ).then((value) => {
      let coins = value['data'];
      Crypto.coins = coins;
      for (var i = 0; i < coins.length; i++) {
        Crypto.coinslugs[coins[i]['symbol']] = coins[i]['slug'];
      }
    }).catch(err => {
      console.log(err);
    });
  }

  async cmp(self) {
    const apiKey = fs.readFileSync("strategies/config/coincap-api.key").toString().trim();
    const client = new CoinMarketCap(apiKey);

    MessageStrategy.typing(self.message);

    let getAmount = 50;
    if(this.message.body.indexOf(" ") > -1) {
      let parts = this.message.body.split(" ");
      getAmount = parseInt(parts[1]);
    }

    client.getTickers(
      {
        convert: 'EUR',
        limit: getAmount
      }
    ).then(async (value) => {
      let coins = value['data'];
      Crypto.coins = coins;

      let msg = "```";
      msg += "Coin       Price       24hr %\n\n";
      for (var i = 0; i < coins.length; i++) {
        Crypto.coinslugs[coins[i]['symbol']] = coins[i]['slug'];

        var symbol = coins[i]['symbol'];
        var symboltotal = 8 - symbol.length;
        var symbolpadding = ' '.repeat(symboltotal);

        var price = parseFloat(coins[i]['quote']['EUR']['price']).toFixed(3);
        var pricetotal = 10 - price.toString().length;
        var pricepadding = ' '.repeat(pricetotal);

        var percent_change_1h = parseFloat(coins[i]['quote']['EUR']['percent_change_1h']).toFixed(3).toString();
        percent_change_1h = percent_change_1h.startsWith("-") ? percent_change_1h : "+" + percent_change_1h;
        var percent_change_24h = parseFloat(coins[i]['quote']['EUR']['percent_change_24h']).toFixed(3).toString();
        percent_change_24h = percent_change_24h.startsWith("-") ? percent_change_24h : "+" + percent_change_24h;
        var change = "" + percent_change_1h + "%    " + percent_change_24h + "%";

        msg += symbol + symbolpadding + " : €" + price + pricepadding + percent_change_24h + "\n";
        if (i % 5 == 4) msg += "\n";
        if (i % 25 == 24) { 
          MessageStrategy.typing(self.message);
          self.client.sendText(self.message.from, msg.trim() + "```");
          await self.waitFor(500);
          msg = "```";
        }
      }

      if(msg.length > 3) {
        self.client.sendText(self.message.from, msg.trim() + "```");
      }
    }).catch(err => {
      console.log(err);
      self.client.sendText(self.message.from, err);
      console.log(err.stack)
    });
  }

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  async get_graph(self, message) {
    let parts = message.body.split(" ");
    let coin = parts[1];
    let period = parts.length > 2 ? parts[2] : "1";
    period = (period == "1d" || period == "7d" || period == "1m" || period == "3m" || period == "1y") ? period : "1d";

    let slugkeys = Object.keys(Crypto.coinslugs);
    let slugvalues = Object.values(Crypto.coinslugs);

    if (slugkeys.includes(coin.toUpperCase()) == false && slugvalues.includes(coin.toLowerCase()) == false) {
      try {
        MessageStrategy.typing(self.message);
        let msg = "```";
        msg += "Symbol    Slug\n\n";
        let i = 0;
        slugkeys.every(key => {
          var total = 10 - key.length;
          var padding = ' '.repeat(total);
          msg += key + padding + "" + Crypto.coinslugs[key] + "\n";
          if (i % 5 == 4) msg += "\n";
          i += 1;
          if(i>50) return false;
        });
        msg += "```";
        self.client.sendText(message.from, "Available coins\n\n" + msg);
      }
      catch (err) {
        console.log(err);
      }
      return;
    }

    try {
      MessageStrategy.typing(self.message);

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();

      var symbol = coin.toUpperCase();
      coin = slugkeys.includes(symbol) ? Crypto.coinslugs[symbol] : coin.toLowerCase();

      console.log(coin);

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

      let paths = {
        "1d" : "/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[1]",
        "7d" : "/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[2]",
        "1m" : "/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[3]",
        "3m" : "/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[4]",
        "1y" : "/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[5]"
      }

      if (period != "1d") {
        const days = await page.waitForXPath(paths[period]);
        if (days) {
          await days.click();
        }
      }

      MessageStrategy.typing(self.message);

      await page.waitForXPath('/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[9]/div/div[2]')
      let xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]';
      await page.waitForXPath(xpath);
      // wait for the selector to load
      let element = await page.$x(xpath);
      let sha1d = crypto.createHash('sha1').digest('hex');
      let text = await page.evaluate(element => element.textContent, element[0]);
      await element[0].screenshot({ path: sha1d + '.png' });
      await browser.close();

      if (!fs.existsSync(sha1d + '.png')) {
        self.client.sendText(message.from, "Problem, try again");
        return;
      }

      MessageStrategy.typing(self.message);
      let coindetails = self.get_coin(coin);
      let coin_msg = "";

      let objfiat = Object.keys(coindetails.quote).includes('EUR') ? coindetails.quote.EUR : coindetails.quote.USD;
      let objcurrency = Object.keys(coindetails.quote).includes('EUR') ? "€" : "$";

      if(period == "7") {
        coin_msg += "*" + coindetails.name + "* 🪙 ";
        coin_msg += "*" + parseFloat(objfiat.percent_change_7d).toFixed(3).toString() + "%* (7d)";
        coin_msg += objfiat.percent_change_7d > 0 ? "🔺\n" : "🔻\n";
        coin_msg += "\n";
        coin_msg += "```";
        coin_msg += "Symbol           : " + coindetails.symbol + "\n";
        coin_msg += "Slug             : " + coindetails.slug + "\n";
        coin_msg += "Max supply       : " + coindetails.max_supply + "\n";
        coin_msg += "Supply           : " + coindetails.circulating_supply + "\n";
        coin_msg += "\n";
        coin_msg += "Price            : " + objcurrency + self.get_coin_value(coin) + "\n";
        coin_msg += "Market Cap       : " + objcurrency + Math.round(objfiat.market_cap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n";
        coin_msg += "Market Dominance : " + parseFloat(objfiat.market_cap_dominance).toFixed(3).toString() + "%";
      }
      else {
        coin_msg += "*" + coindetails.name + "* 🪙 ";
        coin_msg += "*" + parseFloat(objfiat.percent_change_24h).toFixed(3).toString() + "%* (24hr)";
        coin_msg += objfiat.percent_change_24h > 0 ? "🔺\n" : "🔻\n";
        coin_msg += "\n";
        coin_msg += "```";
        coin_msg += "Symbol           : " + coindetails.symbol + "\n";
        coin_msg += "Slug             : " + coindetails.slug + "\n";
        coin_msg += "Max supply       : " + coindetails.max_supply + "\n";
        coin_msg += "Supply           : " + coindetails.circulating_supply + "\n";
        coin_msg += "\n";
        coin_msg += "Price            : " + objcurrency + self.get_coin_value(coin) + "\n";
        coin_msg += "Volume 24h       : " + Math.round(objfiat.volume_24h).toString() + "\n";
        coin_msg += "Market Cap       : " + objcurrency + Math.round(objfiat.market_cap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n";
        coin_msg += "Market Dominance : " + parseFloat(objfiat.market_cap_dominance).toFixed(3).toString() + "%";
      }
      coin_msg += "```";

      await self.client.sendImage(
        message.from,
        sha1d + '.png',
        "",
        coin_msg);

      if (fs.existsSync(sha1d + '.png')) {
        fs.unlinkSync(sha1d + '.png');
      }

    } catch (err) {
      console.log(err);
      self.client.sendText(message.from, err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Crypto']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'coin') {
      this.cmp(this);
      return true;
    }

    if (this.message.body.match(/^coin ([0-9]+)$/i) != null) {
      this.cmp(this);
      return true;
    }

    if (this.message.body.match(/^coin ([0-9a-zA-Z\-]+)$/i) != null) {
      this.get_graph(this, this.message);
      return true;
    }

    if (this.message.body.match(/^coin ([0-9a-z\-]+) ([173])(d|m|y)$/i) != null) {
      this.get_graph(this, this.message);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Crypto
}