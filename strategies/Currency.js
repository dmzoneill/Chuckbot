const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Currency
// ####################################

class Currency extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Currency', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Tries to provide currency exchange rates"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['fiat']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Currency']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase().startsWith('fiat')) {
      MessageStrategy.typing(self.message);
      (async () => {
        try {
          //self.client.sendText(self.message.from, googleCurrencyScraper.);
        }
        catch (err) {
          self.client.sendText(self.message.from, err);
        }
      })();
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Currency
}