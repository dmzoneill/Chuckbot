const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Jacket search
// ####################################

class Jackett extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Jackett', {
      'enabled': true
    });
  }

  provides() {
    Jackett.self = this;

    return {
      help: 'Jackett seearch',
      provides: {
        'Jackett': {
          test: function (message) {
            return message.body.toLowerCase() === 'jackett';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Jackett.self.Jackett,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Jackett']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Jackett']['enabled'];
      }
    }
  }

  Jackett() {
    return false;
  }
}


module.exports = {
  MessageStrategy: Jackett
}
