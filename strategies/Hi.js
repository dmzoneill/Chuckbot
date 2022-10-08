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

  provides() {
    return {
      provides: {
        'Hi': {
          test: function(message) {
            return message.body.toLowerCase() === 'hi';
          },
          access: function(message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name) == false;
          },
          help: function() {
            return 'Just a simple test function the returns hello when you say hi';
          },
          action: this.Hi,
          enabled: function() {
            return MessageStrategy.state['Hi']['enabled'];
          }
        }
      },
      help: 'Provides a basic example of a strategy',
      access: function(message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name) == false;
      },
      enabled: function() {
        return MessageStrategy.state['Hi']['enabled'];
      }
    }
  }

  Hi() {
      MessageStrategy.typing(this.message);
      this.client.sendText(this.message.from, '👋 Hello!!!');
      return true;
  }
}


module.exports = {
  MessageStrategy: Hi
}
