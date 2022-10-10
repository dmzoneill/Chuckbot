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
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: AYCHeaters.self.AYCHeaters,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['AYCHeaters']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
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