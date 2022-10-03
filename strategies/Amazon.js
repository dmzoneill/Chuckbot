const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Amazon
// ####################################

class Amazon extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Amazon'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Logs media to disk"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Amazon']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Amazon']['enabled'] == false) return;

    this.message = message;

    return false;
  }
}


module.exports = {
  MessageStrategy: Amazon
}