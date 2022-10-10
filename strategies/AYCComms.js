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
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: AYCComms.self.AYCComms,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['AYCComms']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
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