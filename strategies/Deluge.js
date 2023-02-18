const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Deluge
// ####################################

class Deluge extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  // static deluge = require('deluge')("http://192.168.0.30:8112/json", "1");

  // static callback = function(error, result) {
  //   if(error) {
  //       console.error(error);
  //       return;
  //   }
  // }

  constructor () {
    super('Deluge', {
      enabled: true
    })
  }

  provides () {
    Deluge.self = this

    return {
      help: 'Manages deluge',
      provides: {
        deluge: {
          test: function (message) {
            return message.body.toLowerCase() === 'deluge'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: Deluge.self.Deluge,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Deluge.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Deluge.enabled
      }
    }
  }

  Deluge () {
    return false
  }
}

module.exports = {
  MessageStrategy: Deluge
}
