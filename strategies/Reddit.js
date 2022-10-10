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
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Reddit.self.Reddit,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Reddit']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
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
