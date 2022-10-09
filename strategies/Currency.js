const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Currency
// ####################################

class Currency extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Currency', {
      'enabled': true
    });
  }

  provides() {
    Currency.self = this;

    return {
      help: 'Tries to provide currency exchange rates',
      provides: {
        'Currency': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('fiat');
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Currency.self.Currency,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Currency']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Currency']['enabled'];
      }
    }
  }

  Currency(message) {
    MessageStrategy.typing(message);
    (async () => {
      try {
        //self.client.sendText(self.message.from, googleCurrencyScraper.);
      }
      catch (err) {
        MessageStrategy.client.sendText(message.from, err);
      }
    })();
  }
}


module.exports = {
  MessageStrategy: Currency
}