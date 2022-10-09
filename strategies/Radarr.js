const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Radarr movie management 
// ####################################

class Radarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Radarr', {
      'enabled': true
    });
  }

  provides() {
    Radarr.self = this;

    return {
      help: 'Radarr search',
      provides: {
        'Radarr': {
          test: function (message) {
            return message.body.toLowerCase() === 'radarr';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Radarr.self.Radarr,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Radarr']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Radarr']['enabled'];
      }
    }
  }

  Radarr() {
    return false;
  }
}


module.exports = {
  MessageStrategy: Radarr
}
