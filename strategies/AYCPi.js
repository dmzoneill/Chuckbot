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
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: AYCPi.self.AYCPi,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['AYCPi']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
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
