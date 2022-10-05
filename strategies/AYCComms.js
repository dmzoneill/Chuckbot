const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCComms  
// ####################################

class AYCComms extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('AYCComms', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "AYCComms management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['AYCComms', 'AYCComms call (\d+) (.*)', 'AYCComms msg (\d+) (.*)']
  }

  handleMessage(message) {
    if (MessageStrategy.state['AYCComms']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'AYCComms') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: AYCComms
}