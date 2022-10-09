const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCHeaters  
// ####################################

class AYCHeaters extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('AYCHeaters', {
      'enabled': true
    });
  }

  provides() {
    AYCHeaters.self = this;

    return {
      help: 'Manages AYC Heaters',
      provides: {
        'Heaters': {
          test: function (message) {
            return message.body.toLowerCase() === 'aycheaters';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: AYCHeaters.self.AYCHeaters,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['AYCHeaters']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['AYCHeaters']['enabled'];
      }
    }
  }

  AYCHeaters() {
    return false;
  }
}

module.exports = {
  MessageStrategy: AYCHeaters
}