const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCHeaters  
// ####################################

class AYCHeaters extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('AYCHeaters', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "AYCHeaters management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['AYCHeaters']
  }

  handleMessage(message) {
    if (MessageStrategy.state['AYCHeaters']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'AYCHeaters') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: AYCHeaters
}