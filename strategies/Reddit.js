const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Reddit
// ####################################

class Reddit extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Reddit'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Reddit management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Reddit']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Reddit']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'Reddit') {
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Reddit
}
