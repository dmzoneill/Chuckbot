const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// hi
// ####################################

class Hi extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Hi', {
      'enabled': true
    });
  }

  provides() {
    Hi.self = this;

    return {
      help: 'Provides a basic example of a strategy',
      provides: {
        'Hi': {
          test: function (message) {
            return message.body.toLowerCase() === 'hi';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Just a simple test function the returns hello when you say hi';
          },
          action: Hi.self.Hello,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Hi']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Hi']['enabled'];
      }
    }
  }

  Hello(message) {
    MessageStrategy.typing(message);
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!');
    return true;
  }
}


module.exports = {
  MessageStrategy: Hi
}
