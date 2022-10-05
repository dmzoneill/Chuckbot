const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// imdb
// ####################################

class Imdb extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Imdb', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides url with preview to imdb movies"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['imdb (.*)']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Imdb']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase().startsWith('imdb')) {
      let search_term = this.message.body.substring(5);
      nameToImdb(search_term, function (err, res, inf) {
        MessageStrategy.typing(self.message);
        self.client.sendLinkWithAutoPreview(self.message.from, "https://www.imdb.com/title/" + res + "/");
      });
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Imdb
}