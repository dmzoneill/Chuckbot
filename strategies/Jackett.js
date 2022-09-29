const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Jacket search
// ####################################

class Jackett extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Jackett'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Jackett search"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['jackett']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Jackett']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'jackett') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Jackett
}
