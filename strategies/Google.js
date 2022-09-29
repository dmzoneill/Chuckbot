const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// google bitch
// ####################################

class Google extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Google'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides google url for those too lazy to type it into google"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['google (.*)']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Google']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.toLowerCase().startsWith('google')) {
      let search_term = message.body.substring(7).trim();
      MessageStrategy.typing(self.message);
      self.client.sendLinkWithAutoPreview(message.from, "https://www.google.com/search?q=" + urlencode(search_term));
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Google
}