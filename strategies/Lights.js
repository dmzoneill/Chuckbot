const MessageStrategy = require("../MessageStrategy.js")


// ####################################
// Lights  
// ####################################

class Lights extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Lights'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Lights management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Lights']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Lights']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'Lights') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: Lights
}