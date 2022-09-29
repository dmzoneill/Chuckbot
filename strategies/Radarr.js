const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Radarr movie management 
// ####################################

class Radarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Radarr'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Radarr movie management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Radarr']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Radarr']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'Radarr') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Radarr
}
