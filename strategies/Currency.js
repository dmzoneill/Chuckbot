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
        currency: {
          test: function (message) {
            return message.body.toLowerCase().startsWith('fiat')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'prints currency exchange rates'
          },
          action: Currency.self.Currency,
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

  Currency (message) {
    MessageStrategy.typing(message);
    (async () => {
      try {
        // self.client.sendText(self.message.from, googleCurrencyScraper.);
      } catch (err) {
        MessageStrategy.client.sendText(message.from, err)
      }
    })()
  }
}

module.exports = {
  MessageStrategy: Currency
}
