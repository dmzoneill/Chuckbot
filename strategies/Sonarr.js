const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Sonarr 
// ####################################

class Sonarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Sonarr'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Sonarr series management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Sonarr']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Sonarr']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'Sonarr') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Sonarr
}
