const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// crypto - coin market cap
// ####################################

class Crypto extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static coinslugs = {}
  static coins = null
  static self = null
  static ccxtconfig = null

  constructor() {
    super('Crypto', {
      enabled: true
    })
    this.get_coins(this)
  }

  provides() {
    Crypto.self = this

    return {
      help: 'Stats and graphs for crypto',
      provides: {
        'coin exchanges': {
          test: function (message) {
            return message.body.toLowerCase() === 'coin exchanges'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows list of known exchanges'
          },
          action: Crypto.self.ExchangeList,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin exchange describe x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('coin exchange describe')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows exchange information'
          },
          action: Crypto.self.ExchangeDescribe,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin exchange symbols x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('coin exchange symbols')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows ticker for a symbol from a given exchange'
          },
          action: Crypto.self.ExchangeSymbols,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin exchange ticker x x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('coin exchange ticker')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows ticker for a symbol from a given exchange'
          },
          action: Crypto.self.ExchangeSymbolTicker,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin': {
          test: function (message) {
            return message.body.toLowerCase() === 'coin'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows top 50 coins'
          },
          action: function GetCoinMarketCap(message) {
            Crypto.self.GetCoinMarketCap(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin 0-9': {
          test: function (message) {
            return message.body.match(/^coin ([0-9]+)$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows X number of coins'
          },
          action: function GetCoinMarketCap(message) {
            Crypto.self.GetCoinMarketCap(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin name': {
          test: function (message) {
            return message.body.match(/^coin ([0-9a-z\-]+)$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows graph for a given coin'
          },
          action: function GetGraph(message) {
            Crypto.self.get_graph(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin name duration': {
          test: function (message) {
            return message.body.match(/^coin ([0-9a-z\-]+) ([173])(d|m|y)$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows graph for a given coin with a time frame 1d/7d/1m/3m/1y'
          },
          action: function GetGraphDated(message) {
            Crypto.self.get_graph(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Crypto.enabled
      }
    }
  }

  async ExchangeList(message) {
    try {
      let exchanges = ccxt.exchanges

      let msg = '```'
      for (let p = 0; p < exchanges.length - 1; p += 2) {
        msg += exchanges[p].padEnd(22, ' ')
        msg += exchanges[p + 1].padEnd(22, ' ')
        msg += '\n'

        let exchange = new ccxt[exchanges[p]]()
        exchange = new ccxt[exchanges[p + 1]]()

        if (p > 0 && p % 20 == 0) {
          msg = msg.trim()
          msg += '```'
          MessageStrategy.client.sendText(message.from, msg)
          msg = "```"
        }
      }
      msg = msg.trim()
      msg += '```'
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async ExchangeDescribe(message) {
    try {
      const parts = message.body.split(' ')
      let exchanges = ccxt.exchanges

      if (parts.length != 3) {
        console.log("bad request")
        return
      }

      if (exchanges.indexOf(parts[2].toLowerCase()) == -1) {
        console.log("bad exchange")
        return
      }

      let exchange = new ccxt[parts[2].toLowerCase()]({ verbose: true })

      MessageStrategy.client.sendText(message.from, JSON.stringify(exchange.describe(), null, 4))
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async ExchangeSymbols(message) {
    try {
      if (Crypto.ccxtconfig == null) {
        Crypto.ccxtconfig = JSON.parse(fs.readFileSync('strategies/config/cctx.json', { encoding: 'utf8', flag: 'r' }));
      }

      const parts = message.body.split(' ')
      let exchanges = ccxt.exchanges

      if (exchanges.indexOf(parts[3].toLowerCase()) == -1) {
        MessageStrategy.client.sendText(message.from, "No such exchange")
        console.log("No such exchange")
        return
      }

      if (Object.keys(Crypto.ccxtconfig).indexOf(parts[3].toLowerCase()) == -1) {
        MessageStrategy.client.sendText(message.from, "Exchange not configured")
        console.log("Exchange not configured")
      }

      let config = {
        apiKey: Crypto.ccxtconfig[parts[3].toLowerCase()].creds.apiKey,
        secret: Crypto.ccxtconfig[parts[3].toLowerCase()].creds.secret,
        verbose: true
      }

      let exchange = new ccxt[parts[3].toLowerCase()](config)
      let markets = await exchange.loadMarkets()

      let keys = Object.keys(markets).sort()
      let msg = "```"
      for (let p = 0; p < keys.length; p++) {
        msg += markets[keys[p]]['info']['symbol'] + "\n"
        if (p > 1 && p % 15 == 0) {
          msg += "```"
          MessageStrategy.client.sendText(message.from, msg)
          msg = "```"
        }
      }
      msg += "```"

      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async ExchangeSymbolTicker(message) {
    // JavaScript
    try {
      if (Crypto.ccxtconfig == null) {
        Crypto.ccxtconfig = JSON.parse(fs.readFileSync('strategies/config/cctx.json', { encoding: 'utf8', flag: 'r' }));
      }

      const parts = message.body.split(' ')
      let exchanges = ccxt.exchanges

      if (exchanges.indexOf(parts[3].toLowerCase()) == -1) {
        MessageStrategy.client.sendText(message.from, "No such exchange")
        console.log("No such exchange")
        return
      }

      if (Object.keys(Crypto.ccxtconfig).indexOf(parts[3].toLowerCase()) == -1) {
        MessageStrategy.client.sendText(message.from, "Exchange not configured")
        console.log("Exchange not configured")
      }

      let config = {
        apiKey: Crypto.ccxtconfig[parts[3].toLowerCase()].creds.apiKey,
        secret: Crypto.ccxtconfig[parts[3].toLowerCase()].creds.secret,
        verbose: false
      }

      let exchange = new ccxt[parts[3].toLowerCase()](config)
      await exchange.loadMarkets()
      console.log(Object.keys(exchange.markets))
      console.log(exchange.markets['ETH/BTC'])
      const index = 4 // [ timestamp, open, high, low, close, volume ]
      const ohlcv = await exchange.fetchOHLCV('BTC/USD', '1h')
      const lastPrice = ohlcv[ohlcv.length - 1][index]
      const series = ohlcv.map(x => x[index])
      const bitcoinRate = '₿ = $' + lastPrice
      const period = '1hr'
      const chart = asciichart.plot(series.slice(-25), { height: 12, padding: '         ' })
      MessageStrategy.client.sendText(message.from, 
        "```" + 
        chart + "\n\n" + 
        bitcoinRate + "\n\n" + 
        period +
        "```")

    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  get_coin_value(slug) {
    for (let i = 0; i < Crypto.coins.length; i++) {
      if (Crypto.coins[i].slug === slug) {
        return parseFloat(Crypto.coins[i].quote.USD.price).toFixed(3)
      }
    }
    return '0'
  }

  get_coin(slug) {
    for (let i = 0; i < Crypto.coins.length; i++) {
      if (Crypto.coins[i].slug === slug) {
        return Crypto.coins[i]
      }
    }
    return {}
  }

  async get_coins(message) {
    const apiKey = fs.readFileSync('strategies/config/coincap-api.key').toString().trim()
    const client = new CoinMarketCap(apiKey)

    client.getTickers(
      {
        convert: 'USD',
        limit: 1000
      }
    ).then((value) => {
      const coins = value.data
      Crypto.coins = coins
      for (let i = 0; i < coins.length; i++) {
        Crypto.coinslugs[coins[i].symbol] = coins[i].slug
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async GetCoinMarketCap(message) {
    await this.get_coins(this)

    const apiKey = fs.readFileSync('strategies/config/coincap-api.key').toString().trim()
    const client = new CoinMarketCap(apiKey)

    MessageStrategy.typing(message)

    let getAmount = 50
    if (message.body.indexOf(' ') > -1) {
      const parts = message.body.split(' ')
      getAmount = parseInt(parts[1])
    }

    client.getTickers(
      {
        convert: 'USD',
        limit: getAmount
      }
    ).then(async (value) => {
      const coins = value.data
      Crypto.coins = coins

      let msg = '```'
      msg += 'Coin       Price       24hr %\n\n'
      for (let i = 0; i < coins.length; i++) {
        Crypto.coinslugs[coins[i].symbol] = coins[i].slug

        const symbol = coins[i].symbol
        const symboltotal = 8 - symbol.length
        const symbolpadding = ' '.repeat(symboltotal)

        const price = parseFloat(coins[i].quote.USD.price).toFixed(3)
        const pricetotal = 10 - price.toString().length
        const pricepadding = ' '.repeat(pricetotal)

        let percent_change_1h = parseFloat(coins[i].quote.USD.percent_change_1h).toFixed(3).toString()
        percent_change_1h = percent_change_1h.startsWith('-') ? percent_change_1h : '+' + percent_change_1h
        let percent_change_24h = parseFloat(coins[i].quote.USD.percent_change_24h).toFixed(3).toString()
        percent_change_24h = percent_change_24h.startsWith('-') ? percent_change_24h : '+' + percent_change_24h
        // const change = '' + percent_change_1h + '%    ' + percent_change_24h + '%'

        msg += symbol + symbolpadding + ' : $' + price + pricepadding + percent_change_24h + '\n'
        if (i % 5 === 4) msg += '\n'
        if (i % 25 === 24) {
          MessageStrategy.typing(message)
          MessageStrategy.client.sendText(message.from, msg.trim() + '```')
          await Crypto.self.waitFor(500)
          msg = '```'
        }
      }

      if (msg.length > 3) {
        MessageStrategy.client.sendText(message.from, msg.trim() + '```')
      }
    }).catch(err => {
      console.log(err)
      MessageStrategy.client.sendText(message.from, err)
      console.log(err.stack)
    })
  }

  async get_graph(message) {
    await this.get_coins(this)

    const parts = message.body.split(' ')
    let coin = parts[1]
    let period = parts.length > 2 ? parts[2] : '1'
    period = (period === '1d' || period === '7d' || period === '1m' || period === '3m' || period === '1y') ? period : '1d'

    const slugkeys = Object.keys(Crypto.coinslugs)
    const slugvalues = Object.values(Crypto.coinslugs)

    if (slugkeys.includes(coin.toUpperCase()) === false && slugvalues.includes(coin.toLowerCase()) === false) {
      try {
        MessageStrategy.typing(message)
        let msg = '```'
        msg += 'Symbol    Slug\n\n'
        let i = 0
        slugkeys.every(key => {
          const total = 10 - key.length
          const padding = ' '.repeat(total)
          msg += key + padding + '' + Crypto.coinslugs[key] + '\n'
          if (i % 5 === 4) msg += '\n'
          i += 1
          if (i > 50) return false
        })
        msg += '```'
        MessageStrategy.client.sendText(message.from, 'Available coins\n\n' + msg)
      } catch (err) {
        console.log(err)
      }
      return
    }

    try {
      MessageStrategy.typing(message)

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()

      const symbol = coin.toUpperCase()
      coin = slugkeys.includes(symbol) ? Crypto.coinslugs[symbol] : coin.toLowerCase()

      await page.goto('https://coinmarketcap.com/currencies/' + coin + '/')
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
        await Crypto.self.waitFor(300)
        vhIncrease = vhIncrease + calculatedVh
      }

      MessageStrategy.typing(message)

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh })

      // Wait for a little bit more
      await Crypto.self.waitFor(1500)

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0)
      })

      const button = await page.waitForSelector('#cmc-cookie-policy-banner > div.cmc-cookie-policy-banner__close')
      if (button) {
        await button.click()
      }

      const paths = {
        '1d': '//*[@id="react-tabs-0"]',
        '7d': '//*[@id="react-tabs-2"]',
        '1m': '//*[@id="react-tabs-4"]',
        '3m': '//*[@id="react-tabs-6"]',
        '1y': '//*[@id="react-tabs-8"]'
      }

      if (period !== '1d') {
        await Crypto.self.waitFor(1500)
        const days = await page.waitForXPath(paths[period])
        if (days) {
          await days.click()
          await Crypto.self.waitFor(1500)
        }
      }

      MessageStrategy.typing(message)

      // const doItLate = await page.waitForXPath('/html/body/div[3]/div/div/div/div/button[2]');
      // await doItLate.click();

      // await page.waitForXPath('/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[9]/div/div[2]')
      await page.waitForXPath('//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div')
      const xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]'
      await page.waitForXPath(xpath)
      // wait for the selector to load
      const element = await page.$x(xpath)
      const sha1d = crypto.createHash('sha1').digest('hex')
      // const text = await page.evaluate(element => element.textContent, element[0])

      await element[0].screenshot({ path: sha1d + '.png' })
      await browser.close()

      if (!fs.existsSync(sha1d + '.png')) {
        MessageStrategy.client.sendText(message.from, 'Problem, try again')
        return
      }

      MessageStrategy.typing(message)
      const coindetails = Crypto.self.get_coin(coin)
      let coinMsg = ''

      const objfiat = Object.keys(coindetails.quote).includes('USD') ? coindetails.quote.USD : coindetails.quote.USD
      const objCrypto = Object.keys(coindetails.quote).includes('USD') ? '$' : '€'

      if (period === '7') {
        coinMsg += '*' + coindetails.name + '* 🪙 '
        coinMsg += '*' + parseFloat(objfiat.percent_change_7d).toFixed(3).toString() + '%* (7d)'
        coinMsg += objfiat.percent_change_7d > 0 ? '🔺\n' : '🔻\n'
        coinMsg += '\n'
        coinMsg += '```'
        coinMsg += 'Symbol           : ' + coindetails.symbol + '\n'
        coinMsg += 'Slug             : ' + coindetails.slug + '\n'
        coinMsg += 'Max supply       : ' + coindetails.max_supply + '\n'
        coinMsg += 'Supply           : ' + coindetails.circulating_supply + '\n'
        coinMsg += '\n'
        coinMsg += 'Price            : ' + objCrypto + Crypto.self.get_coin_value(coin) + '\n'
        coinMsg += 'Market Cap       : ' + objCrypto + Math.round(objfiat.market_cap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '\n'
        coinMsg += 'Market Dominance : ' + parseFloat(objfiat.market_cap_dominance).toFixed(3).toString() + '%'
      } else {
        coinMsg += '*' + coindetails.name + '* 🪙 '
        coinMsg += '*' + parseFloat(objfiat.percent_change_24h).toFixed(3).toString() + '%* (24hr)'
        coinMsg += objfiat.percent_change_24h > 0 ? '🔺\n' : '🔻\n'
        coinMsg += '\n'
        coinMsg += '```'
        coinMsg += 'Symbol           : ' + coindetails.symbol + '\n'
        coinMsg += 'Slug             : ' + coindetails.slug + '\n'
        coinMsg += 'Max supply       : ' + coindetails.max_supply + '\n'
        coinMsg += 'Supply           : ' + coindetails.circulating_supply + '\n'
        coinMsg += '\n'
        coinMsg += 'Price            : ' + objCrypto + Crypto.self.get_coin_value(coin) + '\n'
        coinMsg += 'Volume 24h       : ' + Math.round(objfiat.volume_24h).toString() + '\n'
        coinMsg += 'Market Cap       : ' + objCrypto + Math.round(objfiat.market_cap).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '\n'
        coinMsg += 'Market Dominance : ' + parseFloat(objfiat.market_cap_dominance).toFixed(3).toString() + '%'
      }
      coinMsg += '```'

      await MessageStrategy.client.sendImage(
        message.from,
        sha1d + '.png',
        '',
        coinMsg)

      if (fs.existsSync(sha1d + '.png')) {
        fs.unlinkSync(sha1d + '.png')
      }
    } catch (err) {
      console.log(err)
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@')
      MessageStrategy.client.sendText(message.from, err)
    }
  }
}

module.exports = {
  MessageStrategy: Crypto
}
