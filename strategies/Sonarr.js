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
        'Sonarr': {
          test: function (message) {
            return message.body.toLowerCase() === 'sonarr';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Sonarr.self.Sonarr,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Sonarr']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
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
