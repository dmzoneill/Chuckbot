const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Currency
// ####################################

class Currency extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Currency', {
      enabled: true
    })
  }

  provides () {
    Currency.self = this

    return {
      help: 'Provides currency exchange rates',
      provides: {
        'currency x': {
          test: function (message) {
            return message.body.match(/^currency ([A-Z]{3})$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'prints exchange rate between 2 currencies'
          },
          action: Currency.self.CurrencyConvert,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Currency.enabled
          }
        },
        'currency x y': {
          test: function (message) {
            return message.body.match(/^currency ([A-Z]{3}) ([A-Z]{3}.?)+$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'prints exchange rate between 2 currencies'
          },
          action: Currency.self.CurrencyConvert,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Currency.enabled
          }
        },
        'currency list': {
          test: function (message) {
            return message.body.toLowerCase() == 'currency list'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'prints list of supported currencies'
          },
          action: Currency.self.CurrencyList,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Currency.enabled
          }
        },
        currency: {
          test: function (message) {
            return message.body.toLowerCase() == 'currency'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'prints currency exchange rates'
          },
          action: Currency.self.CurrencyList,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Currency.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Currency.enabled
      }
    }
  }

  async CurrencyConvert (message) {
    try {
      MessageStrategy.typing(message)
      let parts = message.body.trim().split(' ')
      const GoogleCurrencyScraper = (await import('google-currency-scraper')).default
      const { CurrencyCode } = await import('google-currency-scraper')

      if (parts.length == 2) {
        parts = [...parts, ...Object.keys(CurrencyCode)]
      }

      let msg = '```    1 ' + parts[1] + '\n=============== \n'

      const res = []

      for (let k = 2; k < parts.length; k++) {
        try {
          const currency = await GoogleCurrencyScraper({
            from: parts[1].toUpperCase(),
            to: parts[k].toUpperCase()
          })

          const the_rate = currency.rate.toString()
          const decimalParts = the_rate.includes('.') == false ? [the_rate, 0] : the_rate.split('.')
          res.push(decimalParts[0].padStart(5, ' ') + '.' + decimalParts[0].padEnd(5, '0') + ' ' + parts[k] + '\n')
        } catch (err) {
          console.log(err)
        }
      }

      for (let k = 0; k < res.length; k++) {
        try {
          msg += res[k]
          if (k % 12 == 0) {
            msg += '```'
            MessageStrategy.client.sendText(message.from, msg)
            if (k < res.length - 1) {
              msg = '```    1 ' + parts[1] + '\n=============== \n'
            }
          }
        } catch (err) {
          console.log(err)
        }
      }

      msg += '```'

      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      console.log(err)
    }
  }

  async CurrencyList (message) {
    try {
      MessageStrategy.typing(message)
      const { CurrencyCode } = await import('google-currency-scraper')

      let msg = '```'
      const list = Object.keys(CurrencyCode)
      for (let y = 0; y < list.length; y += 4) {
        let next = y < list.length ? list[y] : ''
        msg += next.padEnd(5, ' ')
        next = y + 1 < list.length ? list[y + 1] : ''
        msg += next.padEnd(5, ' ')
        next = y + 2 < list.length ? list[y + 2] : ''
        msg += next.padEnd(5, ' ')
        next = y + 3 < list.length ? list[y + 3] : ''
        msg += next.padEnd(5, ' ') + '\n'
        if (y > 0 && y % 30 == 0) {
          msg += '```'
          MessageStrategy.client.sendText(message.from, msg)
          msg = '```'
        }
      }

      msg += '```'
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Currency
}
