const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCPi  
// ####################################

class AYCPi extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('AYCPi', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "AYCPi management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['AYCPi']
  }

  handleMessage(message) {
    if (MessageStrategy.state['AYCPi']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'AYCPi') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: AYCPi
}
