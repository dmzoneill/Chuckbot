const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Reddit
// ####################################

class Reddit extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Reddit', {
      'enabled': true
    });
  }

  provides() {
    Reddit.self = this;

    return {
      help: 'Reddit previews',
      provides: {
        'Reddit': {
          test: function (message) {
            return message.body.toLowerCase() === 'reddit';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Reddit.self.Reddit,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Reddit']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Reddit']['enabled'];
      }
    }
  }

  Reddit() {
    return false;
  }
}


module.exports = {
  MessageStrategy: Reddit
}
