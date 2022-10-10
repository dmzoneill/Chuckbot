const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Sonarr 
// ####################################

class Sonarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Sonarr', {
      'enabled': true
    });
  }

  provides() {
    Sonarr.self = this;

    return {
      help: 'Manages sonarr',
      provides: {
        'sonarr': {
          test: function (message) {
            return message.body.toLowerCase() === 'sonarr';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Sonarr.self.Sonarr,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Sonarr']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Sonarr']['enabled'];
      }
    }
  }

  Sonarr(message) {    
    return false;
  }
}


module.exports = {
  MessageStrategy: Sonarr
}
