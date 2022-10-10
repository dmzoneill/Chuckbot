const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// AYCBooking  
// ####################################

class AYCBooking extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('AYCBooking', {
      'enabled': true
    });
  }

  provides() {
    AYCBooking.self = this;

    return {
      help: 'Manages AYC bookings',
      provides: {
        'Booking': {
          test: function (message) {
            return message.body.toLowerCase() === 'aycbooking';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: AYCBooking.self.AYCBooking,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['AYCBooking']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['AYCBooking']['enabled'];
      }
    }
  }

  AYCBooking() {
    return false;
  }
}


module.exports = {
  MessageStrategy: AYCBooking
}
