const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Deluge
// ####################################

class Deluge extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  // static deluge = require('deluge')("http://192.168.0.30:8112/json", "1");

  // static callback = function(error, result) {
  //   if(error) {
  //       console.error(error);
  //       return;
  //   }
  // }

  constructor() {
    super();
    MessageStrategy.state['Deluge'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Deluge management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Deluge']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Deluge']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'deluge') {
      // MessageStrategy.typing(this.message); 
      // Deluge.deluge.getHosts(Deluge.callback);
      // deluge.connect(callback)
      // this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Deluge
}
