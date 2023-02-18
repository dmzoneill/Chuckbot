const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Radarr movie management
// ####################################

class Radarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Radarr', {
      enabled: true
    })
  }

  provides () {
    Radarr.self = this

    return {
      help: 'Radarr search',
      provides: {
        radarr: {
          test: function (message) {
            return message.body.toLowerCase() === 'radarr'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: Radarr.self.Radarr,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Radarr.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Radarr.enabled
      }
    }
  }

  Radarr () {
    return false
  }
}

module.exports = {
  MessageStrategy: Radarr
}
