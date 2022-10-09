const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCComms  
// ####################################

class AYCComms extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('AYCComms', {
      'enabled': true
    });
  }

  provides() {
    AYCComms.self = this;

    return {
      help: 'Manages AYC Communications',
      provides: {
        'Comms': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayccomms';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: AYCComms.self.AYCComms,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['AYCComms']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['AYCComms']['enabled'];
      }
    }
  }

  AYCComms() {
    return false;
  }
}

module.exports = {
  MessageStrategy: AYCComms
}