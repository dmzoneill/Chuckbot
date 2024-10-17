const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Stock - yahoo stock market
// ####################################

class Stock extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static symbols = []

  constructor () {
    super('Stock', {
      enabled: true
    })
  }

  provides () {
    Stock.self = this

    return {
      help: 'Stats and graphs for Stock',
      provides: {
        'stock search symbol': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('stock search')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Searches for a symbol'
          },
          action: Stock.self.SearchStock,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Stock.enabled
          }
        },
        'stock symbol': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('stock')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows a specific symbol'
          },
          action: Stock.self.GetStock,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Stock.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.News.enabled
      }
    }
  }

  async LoadSymbols () {
    const rawdata = fs.readFileSync('strategies/symbols/symbols.txt')
    Stock.symbols = JSON.parse(rawdata)
  }

  async PostStockInfo (message, symbol, exchange, type = '', period = '1d', extra = false, stats = false) {
    try {
      MessageStrategy.typing(message)

      Stock.self.browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'], headless: true })
      Stock.self.context = await Stock.self.browser.createIncognitoBrowserContext()
      Stock.self.page = await Stock.self.context.newPage()

      const url = 'https://www.tradingview.com/symbols/' + symbol + '/?exchange=' + exchange
      if (type != '') {
        // url += "&type=" + type
      }

      console.log(url)

      await Stock.self.page.goto(url)
      await Stock.self.page.setViewport({ width: 1024, height: 1650 })

      const bodyHandle = await Stock.self.page.$('body')
      MessageStrategy.typing(message)
      await bodyHandle.dispose()
      await Stock.self.waitFor(500)

      // const button = await Stock.self.page.waitForXPath('//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[1]/div[2]/div/div/div/div/article/button')

      // if (button) {
      //   await button.click()
      // }

      const paths = {
        '1d': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[1]',
        '7d': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[2]',
        '1m': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[3]',
        '6m': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[4]',
        ytd: '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[5]',
        '1y': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[6]',
        '5y': '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[7]',
        at: '//*[@id="js-category-content"]/div[2]/div/section/div[1]/div[2]/div[2]/div/div[2]/button[8]'
      }

      console.log(paths[period])

      if (period !== '1d') {
        await Stock.self.waitFor(500)
        const days = await Stock.self.page.waitForXPath(paths[period])
        if (days) {
          await days.click()
          await Stock.self.waitFor(500)
        }
      }

      await Stock.self.SendScreenshot(message, '//*[@id="js-category-content"]/div[2]/div/section/div[1]')

      const technicals_button = await Stock.self.page.waitForXPath("//a[text()[contains(.,'Technicals')]]")

      if (technicals_button) {
        await technicals_button.click()
      }

      await Stock.self.waitFor(500)
      await Stock.self.page.$('body')

      if (extra) {
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[3]/div[1]')
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[3]/div[2]')
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[3]/div[3]')
      }

      if (stats) {
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[5]/div[1]')
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[5]/div[2]')
        await Stock.self.SendScreenshot(message, '//*[@id="technicals-root"]/div/div[7]')
      }
      await Stock.self.browser.close()
    } catch (err) {
      console.log(err)
      // MessageStrategy.client.sendText(message.from, err)
    }
  }

  async SendScreenshot (message, xpath) {
    MessageStrategy.typing(message)

    const sha1d = crypto.createHash('sha1').digest('hex')

    const element = await Stock.self.page.$x(xpath)
    console.log(element)
    await element[0].screenshot({ path: sha1d + '.png' })

    await MessageStrategy.client.sendImage(
      message.from,
      sha1d + '.png',
      '',
      '')

    if (fs.existsSync(sha1d + '.png')) {
      fs.unlinkSync(sha1d + '.png')
    }
  }

  async SearchSymbol (message, symbol) {
    const res = []
    let parts = []

    if (symbol.indexOf(' ') > -1) {
      parts = symbol.split(' ')
      parts[0] = parts[0].toUpperCase()
      parts[1] = parts[1].toUpperCase()

      const periods = ['1d', '7d', '1m', '6m', 'ytd', '1y', '5y', 'at']
      const extras = ['extra']
      const stats = ['stats']

      let allparts = periods.concat(extras)
      allparts = allparts.concat(stats)

      if (parts.length == 4) {
        if (periods.indexOf(parts[3]) > -1) {
          parts.pop()
        }
        if (extras.indexOf(parts[3]) > -1) {
          parts.pop()
        }
        if (stats.indexOf(parts[3]) > -1) {
          parts.pop()
        }
      }

      if (parts.length == 3) {
        if (periods.indexOf(parts[2]) > -1) {
          parts.pop()
        }
        if (extras.indexOf(parts[2]) > -1) {
          parts.pop()
        }
        if (stats.indexOf(parts[2]) > -1) {
          parts.pop()
        }
      }

      if (parts.length == 2) {
        if (allparts.indexOf(parts[1].toLowerCase()) > -1) {
          MessageStrategy.client.sendText(message.from, 'No exchange provided, expected format e.g:\n\ncoin gold capitalcom 1y extra stats')
          return []
        }

        for (let i = 0; i < Stock.symbols.length; i++) {
          if (parts[0] == Stock.symbols[i].symbol.toUpperCase() &&
            parts[1] == Stock.symbols[i].exchange.toUpperCase()) {
            res.push(Stock.symbols[i])
          }
        }
      } else {
        parts[2] = parts[2].toUpperCase()

        for (let i = 0; i < Stock.symbols.length; i++) {
          if (parts[0] == Stock.symbols[i].symbol.toUpperCase() &&
            parts[1] == Stock.symbols[i].exchange.toUpperCase() &&
            parts[2] == Stock.symbols[i].type.toUpperCase()) {
            res.push(Stock.symbols[i])
          }
        }
      }
    } else {
      for (let i = 0; i < Stock.symbols.length; i++) {
        if (symbol.toUpperCase().trim() == Stock.symbols[i].symbol) {
          res.push(Stock.symbols[i])
        }
      }
    }

    return res
  }

  async GetStock (message) {
    try {
      const req = message.body.trim().substring(6).trim()

      if (Stock.symbols.length == 0) {
        await Stock.self.LoadSymbols()
        if (Stock.symbols.length == 0) {
          MessageStrategy.client.sendText(message.from, 'Unable to load symbols')
          return
        }
      }

      const symbols = await Stock.self.SearchSymbol(message, req)

      if (symbols.length == 0) {
        MessageStrategy.client.sendText(message.from, 'Trying searech with:\n\nstock search xxx')
        return
      }

      if (symbols.length == 1) {
        let period = '1d'
        let extra = false
        let stat = false
        let type = symbols[0].type
        const parts = req.split(' ')

        const periods = ['1d', '7d', '1m', '6m', 'ytd', '1y', '5y', 'at']
        const types = ['fund', 'stock', 'forex', 'spot', 'swap', 'futures', 'index', 'cfd', 'fundamental', 'economic', 'dr', 'bond']
        const extras = ['extra']
        const stats = ['stats']

        period = periods.indexOf(parts[2]) > -1 ? parts[2] : period
        period = periods.indexOf(parts[3]) > -1 ? parts[3] : period
        period = periods.indexOf(parts[4]) > -1 ? parts[4] : period
        period = periods.indexOf(parts[5]) > -1 ? parts[5] : period

        extra = extras.indexOf(parts[2]) > -1 ? true : extra
        extra = extras.indexOf(parts[3]) > -1 ? true : extra
        extra = extras.indexOf(parts[4]) > -1 ? true : extra
        extra = extras.indexOf(parts[5]) > -1 ? true : extra

        stat = stats.indexOf(parts[2]) > -1 ? true : stat
        stat = stats.indexOf(parts[3]) > -1 ? true : stat
        stat = stats.indexOf(parts[4]) > -1 ? true : stat
        stat = stats.indexOf(parts[5]) > -1 ? true : stat

        type = types.indexOf(parts[2]) > -1 ? parts[2] : type
        type = types.indexOf(parts[3]) > -1 ? parts[3] : type
        type = types.indexOf(parts[4]) > -1 ? parts[4] : type
        type = types.indexOf(parts[5]) > -1 ? parts[5] : type

        await Stock.self.PostStockInfo(message, symbols[0].symbol, symbols[0].exchange, type, period, extra, stat)
        return
      }

      if (symbols.length > 1) {
        let msg = '```'
        for (let p = 0; p < symbols.length; p++) {
          msg += symbols[p].symbol.padEnd(15, ' ')
          msg += symbols[p].exchange.padEnd(15, ' ')
          msg += symbols[p].type.padEnd(15, ' ')
          msg += '\n'
        }
        msg = msg.trim()
        if (msg == '') {
          MessageStrategy.client.sendText(message.from, 'Nothing found')
        }
        msg += '```'
        MessageStrategy.client.sendText(message.from, msg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async SearchStock (message) {
    try {
      const req = message.body.trim().substring('stock search'.length).trim()
      const symbols = []

      if (Stock.symbols.length == 0) {
        await Stock.self.LoadSymbols()
        if (Stock.symbols.length == 0) {
          MessageStrategy.client.sendText(message.from, 'Unable to load symbols')
          return
        }
      }

      for (let i = 0; i < Stock.symbols.length; i++) {
        if (Stock.symbols[i].description.toLowerCase().indexOf(req.toLowerCase()) > -1) {
          symbols.push(Stock.symbols[i])
        }
      }

      symbols.sort(function (a, b) {
        return a.symbol.localeCompare(b.symbol)
      })

      let msg = '```'
      for (let p = 0; p < symbols.length; p++) {
        msg += symbols[p].symbol.padEnd(15, ' ')
        msg += symbols[p].exchange.padEnd(15, ' ')
        msg += symbols[p].type.padEnd(15, ' ')
        msg += '\n'
      }
      msg = msg.trim()
      if (msg == '') {
        MessageStrategy.client.sendText(message.from, 'Nothing found')
      }
      msg += '```'
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Stock
}
