const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// hi
// ####################################

class Hi extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Hi', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "An example feature that just responds to hi"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['hi']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Hi']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'hi') {
      MessageStrategy.typing(this.message);
      this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Hi
}