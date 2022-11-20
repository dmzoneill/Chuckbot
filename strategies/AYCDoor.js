const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCDoor  
// ####################################

class AYCDoor extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('AYCDoor', {
      'enabled': true
    });
  }

  provides() {
    AYCDoor.self = this;

    return {
      help: 'Manages AYC Door',
      provides: {
        'Door': {
          test: function (message) {
            return message.body.toLowerCase() === 'door';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: AYCDoor.self.AYCDoor,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['AYCDoor']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['AYCDoor']['enabled'];
      }
    }
  }

  AYCDoor() {
    return false;
  }
}


module.exports = {
  MessageStrategy: AYCDoor
}
