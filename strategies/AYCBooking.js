const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCBooking  
// ####################################

class AYCBooking extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['AYCBooking'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "AYCBooking management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['AYCBooking']
  }

  handleMessage(message) {
    if (MessageStrategy.state['AYCBooking']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'AYCBooking') {
      //MessageStrategy.typing(this.message);   
      //this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: AYCBooking
}
