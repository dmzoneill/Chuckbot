const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCPi  
// ####################################

class AYCPi extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('AYCPi', {
      'enabled': true
    });
  }

  provides() {
    AYCPi.self = this;

    return {
      help: 'Manages AYC RPi',
      provides: {
        'AYCPi': {
          test: function (message) {
            return message.body.toLowerCase() === 'aycpi';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: AYCPi.self.AYCPi,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['AYCPi']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['AYCPi']['enabled'];
      }
    }
  }

  AYCPi() {
    return false;
  }
}

module.exports = {
  MessageStrategy: AYCPi
}
