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
    return ['Hi'];
    // return {
    //   provides: {
    //     'Hi': {
    //       test: function(message) {
    //         return message.body.toLowerCase() === 'hi';
    //       },
    //       access: function(message, strategy, action) {
    //         return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name, action.name) == false;
    //       },
    //       help: function() {
    //         return 'Just a simple test function the returns hello when you say hi';
    //       },
    //       action: this.test,
    //     }
    //   },
    //   help: 'Provides a basic example of a strategy',
    //   access: function(message, strategy) {
    //     MessageStrategy.register(strategy.constructor.name);
    //     return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name) == false;
    //   }
    // }
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

  Hi(message) {
    console.log(message);
  }
}


module.exports = {
  MessageStrategy: Hi
}
