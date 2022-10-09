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
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
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
        MessageStrategy.register(strategy.constructor.name);
        return true;
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
