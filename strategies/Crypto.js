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
        'coin functions': {
          test: function (message) {
            return message.body.toLowerCase() === 'coin functions'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows list of technical analysis functions'
          },
          action: Crypto.self.TAFunctionList,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin function explain x': {
          test: function (message) {
            return message.body.match(/^coin function explain ([a-zA-Z0-9]+)$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows a description of a technical analysis function'
          },
          action: Crypto.self.TAFunctionDescription,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin function explain': {
          test: function (message) {
            return message.body.match(/^coin function explain$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Explains all functions'
          },
          action: Crypto.self.TAFunctionDescriptionAll,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin analyze function pair interval exchange': {
          test: function (message) {
            return message.body.match(/^coin analyze ([a-zA-Z0-9]+) ([a-zA-Z0-9]+\/[a-zA-Z0-9]+) ([0-9]+[y|M|w|m|h|d|s])$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Does a technical analysys of a pair'
          },
          action: Crypto.self.TAAnalyzeFunc,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Crypto.enabled
          }
        },
        'coin analyze pair interval exchange': {
          test: function (message) {
            return message.body.match(/^coin analyze ([a-zA-Z0-9]+\/[a-zA-Z0-9]+) ([0-9]+[y|M|w|m|h|d|s])$/i) !== null
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Does a technical analysys of a pair'
          },
          action: Crypto.self.TAAnalyze,
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

  async TAFunctionDescription(message) {
    try {
      let func = message.body.substring(13).trim().toUpperCase()
      console.log(func)
      let function_desc = talib.explain(func);
      MessageStrategy.client.sendText(message.from, JSON.stringify(function_desc, null, 2))
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async TAFunctionDescriptionAll(message) {
    try {
      let functions = talib.functions;
      for (let i in functions) {
        let function_desc = talib.explain(functions[i].name);
        console.log(function_desc)
      }
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async TAFunctionList(message) {
    try {
      let functions = talib.functions;
      let msg = "```"
      let p = 0
      for (let i in functions) {
        console.log(JSON.stringify(functions[i]))
        let name = functions[i].name
        let hint = functions[i].hint
        let group = functions[i].group

        if (name == undefined || group == undefined || hint == undefined) {
          continue
        }

        msg += name + "\n"
        msg += "  " + hint + "\n"
        msg += "  " + group + "\n"
        if (p > 0 && p % 8 == 0) {
          msg += "```"
          MessageStrategy.client.sendText(message.from, msg)
          msg = "```"
        }
        p++
      }
      msg += "```"
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async get_market_data(pair, interval = "1h", source_exchange = "binance") {
    let config = {
      apiKey: Crypto.ccxtconfig[source_exchange].creds.apiKey,
      secret: Crypto.ccxtconfig[source_exchange].creds.secret,
      verbose: false
    }

    let exchange = new ccxt[source_exchange](config)
    await exchange.loadMarkets()
    const ohlcv = await exchange.fetchOHLCV(pair, interval)

    let oh_open = ohlcv.map(a => a[1]); // [ timestamp, open, high, low, close, volume ]
    let oh_close = ohlcv.map(a => a[4]); // [ timestamp, open, high, low, close, volume ]
    let oh_high = ohlcv.map(a => a[2]); // [ timestamp, open, high, low, close, volume ]
    let oh_low = ohlcv.map(a => a[3]); // [ timestamp, open, high, low, close, volume ]
    let oh_volume = ohlcv.map(a => a[5]); // [ timestamp, open, high, low, close, volume ]

    // market data as arrays
    var marketData = { open: oh_open, close: oh_close, high: oh_high, low: oh_low, volume: oh_volume };

    return marketData
  }

  async TAAnalyzeFunc(message) {
    try {

      if (Crypto.ccxtconfig == null) {
        Crypto.ccxtconfig = JSON.parse(fs.readFileSync('strategies/config/cctx.json', { encoding: 'utf8', flag: 'r' }));
      }

      const parts = message.body.split(' ')
      let tafunc = parts[2].toUpperCase()
      let tapair = parts[3].toUpperCase()
      let tainterval = parts[4].toLowerCase()
      let function_desc = talib.explain(tafunc);

      const marketData = Object.keys(message).indexOf('marketData') > -1 ? message.marketData : await Crypto.self.get_market_data(tapair, tainterval)

      console.log(tafunc)
      console.log(JSON.stringify(function_desc['inputs'], null, 2))
      console.log(JSON.stringify(function_desc['optInputs'], null, 2))
      console.log(JSON.stringify(function_desc['outputs'], null, 2))

      let options = {}

      options = {
        name: tafunc,
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        optInTimePeriod: 14
      }

      if (tafunc == "SMA") {
        options = {
          name: tafunc,
          startIdx: 0,
          endIdx: marketData.close.length - 1,
          inReal: marketData.close,
          optInTimePeriod: 180
        }
      }

      if (tafunc == "EMA") {
        options = {
          name: tafunc,
          startIdx: 0,
          endIdx: marketData.close.length - 1,
          inReal: marketData.close,
          optInTimePeriod: 180
        }
      }

      if (tafunc == "STOCH") {
        options = {
          name: tafunc,
          inPriceHLC: marketData.close,
          high: marketData.high,
          low: marketData.low,
          close: marketData.close
        }
      }

      if (tafunc == "STOCHF") {
        options = {
          name: tafunc,
          startIdx: 0,
          endIdx: marketData.close.length - 1,
          inReal: marketData.close,
          optInTimePeriod: 180,
          high: marketData.high,
          low: marketData.low,
          close: marketData.close
        }
      }

      if (tafunc == "STOCHRSI") {
        options = {
          name: tafunc,
          startIdx: 0,
          endIdx: marketData.close.length - 1,
          inReal: marketData.close,
          optInTimePeriod: 180,
          high: marketData.high,
          low: marketData.low,
          close: marketData.close
        }
      }

      // Calculate the ADX values using Ta-Lib
      const taValues = talib.execute(options).result.outReal;

      console.log(JSON.stringify(taValues, null, 2))

      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables);

      let interval = tainterval.indexOf("y") > -1 ? "Year" : ""
      interval = tainterval.indexOf("M") > -1 ? "Month" : interval
      interval = tainterval.indexOf("w") > -1 ? "Week" : interval
      interval = tainterval.indexOf("d") > -1 ? "Day" : interval
      interval = tainterval.indexOf("h") > -1 ? "Hour" : interval
      interval = tainterval.indexOf("m") > -1 ? "Minute" : interval
      interval = tainterval.indexOf("s") > -1 ? "Second" : interval

      // Create a new Chart.js chart
      const canvas = createCanvas(800, 600);
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: marketData.close.map((value, index) => `${interval} ${marketData.close.length - index}`),
          datasets: [
            {
              label: tafunc,
              data: taValues,
              borderColor: 'blue',
              fill: false
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

      // Export the chart as a PNG image
      const imageBuffer = canvas.toBuffer('image/png');

      MessageStrategy.client.sendImage(message.chatId, imageBuffer, 'filename.jpeg', '')

      return marketData
    } catch (err) {
      console.log(err.stack);
      MessageStrategy.client.sendText(message.from, err)
    }
  }

  async TAAnalyze(message) {
    try {

      const parts = message.body.split(' ')
      let tapair = parts[2].toUpperCase()
      let tainterval = parts[3].toLowerCase()

      let functions = talib.functions;
      let msg = ""
      let marketData = undefined
      for (let i in functions) {
        if (functions[i].group == "Math Transform" || functions[i].group == undefined || functions[i].group == "Price Transform") {
          console.log("Skip " + functions[i].name)
          continue
        }
        try {
          let msg = {
            body: "coin analyze " + functions[i].name + " " + tapair + " " + tainterval,
            chatId: message.chatId,
            from: message.from
          }
          if (marketData != undefined) {
            msg['marketData'] = marketData
          }
          marketData = await Crypto.self.TAAnalyzeFunc(msg)
        } catch (err) {
          console.log(err)
        }
      }

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

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] , headless:true})
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

      // const button = await page.waitForSelector('#cmc-cookie-policy-banner > div.cmc-cookie-policy-banner__close')
      // if (button) {
      //   await button.click()
      // }

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

      const acceptCookie = await page.waitForXPath('//*[@id="onetrust-accept-btn-handler"]');
      await acceptCookie.click();

      let selected = false

      while(selected == false) {
        try {
          const xpath = '//*[@id="section-coin-chart"]'
          await page.waitForXPath(xpath, {timeout: 1000})
          selected = xpath
          break
        }
        catch(err) {}
        try {
          const xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div'
          await page.waitForXPath(xpath, {timeout: 1000})          
          selected = xpath
          break
        }
        catch(err) {}
      }

      const element = await page.$x(selected)
      const sha1d = crypto.createHash('sha1').digest('hex')

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
