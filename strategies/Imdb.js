const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// imdb
// ####################################

class Imdb extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Imdb', {
      enabled: true
    })
  }

  provides () {
    Imdb.self = this

    return {
      help: 'Provide information and links to IMDB titles',
      provides: {
        'imdb x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('imdb')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Gets a link to the IMDB page for a given title'
          },
          action: Imdb.self.Imdb,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Imdb.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Imdb.enabled
      }
    }
  }

  Imdb (message) {
    try {
      const search_term = message.body.substring(5)
      nameToImdb(search_term, function (err, res, inf) {
        if (err) return

        MessageStrategy.typing(message)
        MessageStrategy.client.sendLinkWithAutoPreview(message.from, 'https://www.imdb.com/title/' + res + '/')
      })
    } catch (err) {
      MessageStrategy.client.sendText(message.from, err)
    }
  }
}

module.exports = {
  MessageStrategy: Imdb
}
