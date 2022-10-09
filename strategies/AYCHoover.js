const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCHoover  
// ####################################

class AYCHoover extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('AYCHoover', {
      'enabled': true
    });
  }

  provides() {
    AYCHoover.self = this;

    return {
      help: 'Manages AYC Hoover',
      provides: {
        'Hoover': {
          test: function (message) {
            return message.body.toLowerCase() === 'aychoover';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: AYCHoover.self.AYCHoover,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['AYCHoover']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['AYCHoover']['enabled'];
      }
    }
  }

  AYCHoover() {
    return false;
  }
}


module.exports = {
  MessageStrategy: AYCHoover
}