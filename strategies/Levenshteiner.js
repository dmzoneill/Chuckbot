const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Levenshteiner distance
// ####################################

class Levenshteiner extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Levenshteiner', {
      enabled: true
    })
  }

  provides () {
    Levenshteiner.self = this

    return {
      help: 'Provides the levenshtein distance between 2 strings',
      provides: {
        'levenshtein x y': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('levenshtein')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'provide 2 strings to show the distance'
          },
          action: Levenshteiner.self.Levenshteiner,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Levenshteiner.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Levenshteiner.enabled
      }
    }
  }

  Levenshteiner (message) {
    if (message.body.indexOf(' ') == -1) {
      return
    }

    const parts = message.body.split(' ')

    if (parts.length < 3) {
      return
    }

    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from,
      'levenshtein(' + parts[1] + ', ' + parts[2] + ') = ' + levenshtein(parts[1], parts[2]).toString())

    return true
  }
}

module.exports = {
  MessageStrategy: Levenshteiner
}
