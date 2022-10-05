const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCHoover  
// ####################################

class AYCHoover extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('AYCHoover', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "AYCHoover management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['AYCHoover']
  }

  handleMessage(message) {
    if (MessageStrategy.state['AYCHoover']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'AYCHoover') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: AYCHoover
}