const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chuck jokes
// ####################################

class ChuckJokes extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)

  constructor () {
    super('ChuckJokes', {
      enabled: true
    })

    this.chuck_keywords = [
      'joke',
      'lol',
      'fyi',
      'prick',
      'dick',
      'lmao',
      'who',
      'cunt',
      'nice',
      'fuck',
      'haha',
      'feck',
      'cock',
      'langer',
      'arse',
      'slut',
      'bitch'
    ]
  }

  provides () {
    ChuckJokes.self = this

    return {
      help: 'Chuck will look for bads words and post a chuck norris joke',
      provides: {
        'chuck stfu': {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck stfu'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Disables chuck'
          },
          action: ChuckJokes.self.ChuckSTFU,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.ChuckJokes.enabled
          }
        },
        chuck: {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Enables chuck'
          },
          action: ChuckJokes.self.Chuck,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.ChuckJokes.enabled
          }
        },
        dojoke: {
          test: function (message) {
            ChuckJokes.self.Setup(message)
            return MessageStrategy.state.ChuckJokes.chats[message.chatId].enabled === true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Post the chuck quote'
          },
          action: ChuckJokes.self.DoJoke,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.ChuckJokes.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.ChuckJokes.enabled
      }
    }
  }

  get_joke () {
    const joke = request('GET', 'https://api.chucknorris.io/jokes/random', {
      headers: {
        Accept: 'text/plain'
      }
    })
    return joke.getBody()
  }

  Setup (message) {
    if (Object.keys(MessageStrategy.state.ChuckJokes).includes('chats') === false) {
      MessageStrategy.state.ChuckJokes.chats = {}
    }

    if (Object.keys(MessageStrategy.state.ChuckJokes.chats).includes(message.chatId) === false) {
      MessageStrategy.state.ChuckJokes.chats[message.chatId] = {}
      MessageStrategy.state.ChuckJokes.chats[message.chatId].enabled = false
    }
  }

  ChuckSTFU (message) {
    ChuckJokes.self.Setup(message)
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, 'Don\'t let anyone tell you you\'re not powerful.  You\'re the most powerful woman i know')
    MessageStrategy.state.ChuckJokes.chats[message.chatId].enabled = false
    return true
  }

  Chuck (message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, 'How many lesbians does it take to screw in a light bulb')
    MessageStrategy.state.ChuckJokes.chats[message.chatId].enabled = true
    return true
  }

  DoJoke (message) {
    ChuckJokes.self.chuck_keywords.forEach(async function (word) {
      try {
        if (message.body.toLowerCase().indexOf(word) > -1) {
          MessageStrategy.typing(message)
          MessageStrategy.client.sendText(message.from, ChuckJokes.self.get_joke())
          return true
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
}

module.exports = {
  MessageStrategy: ChuckJokes
}
