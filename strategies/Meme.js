const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Meme
// ####################################

class Meme extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Meme', {
      enabled: true
    })
  }

  provides (message) {
    Meme.self = this

    return {
      help: 'Gets a random meme',
      provides: {
        meme: {
          test: function (message) {
            return message.body.toLowerCase() === 'meme'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'gets the meme and posts it to the chat'
          },
          action: Meme.self.getMeme,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Meme.enabled
          }
        },
        'meme enable': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme enable'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'enables automatic memes in the chat'
          },
          action: Meme.self.enable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Meme.enabled
          }
        },
        'meme disable': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme disable'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'disables automatic memes in the chat'
          },
          action: Meme.self.disable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Meme.enabled
          }
        },
        '*': {
          test: function (message) {
            return true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Posts a meme'
          },
          action: function (message) {
            Meme.self.post(message)
            return false
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Meme.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Meme.enabled
      }
    }
  }

  async chatSetup (message) {
    try {
      if (message == null || message == undefined) {
        return false
      }

      if (Object.keys(message).indexOf('chatId') === -1) {
        return false
      }

      if (Object.keys(MessageStrategy.state.Meme).indexOf('chats') === -1) {
        MessageStrategy.state.Meme.chats = {}
      }

      if (Object.keys(MessageStrategy.state.Meme.chats).indexOf(message.chatId) === -1) {
        MessageStrategy.state.Meme.chats[message.chatId] = {}
      }

      if (Object.keys(MessageStrategy.state.Meme.chats[message.chatId]).indexOf('enabled') === -1) {
        MessageStrategy.state.Meme.chats[message.chatId].enabled = false
      }

      if (Object.keys(MessageStrategy.state.Meme.chats[message.chatId]).indexOf('frequency') === -1) {
        MessageStrategy.state.Meme.chats[message.chatId].frequency = (Math.floor(Date.now() / 1000)) + await Meme.self.randomIntFromInterval(100800, 120800)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async enable (message) {
    try {
      await Meme.self.chatSetup(message)
      MessageStrategy.state.Meme.chats[message.chatId].enabled = true
      MessageStrategy.client.sendText(message.from, 'Enabled')
    } catch (err) {
      console.log(err)
    }
  }

  async disable (message) {
    try {
      await Meme.self.chatSetup(message)
      MessageStrategy.state.Meme.chats[message.chatId].enabled = false
      MessageStrategy.client.sendText(message.from, 'Disabled')
    } catch (err) {
      console.log(err)
    }
  }

  async post (message) {
    await Meme.self.chatSetup(message)
    if (MessageStrategy.state.Meme.chats[message.chatId].enabled) {
      if (Math.floor(Date.now() / 1000) > MessageStrategy.state.Meme.chats[message.chatId].frequency) {
        Meme.self.getMeme(message)
        MessageStrategy.state.Meme.chats[message.chatId].frequency = (Math.floor(Date.now() / 1000)) + await Meme.self.randomIntFromInterval()
      }
    }
  }

  async getMeme (message) {
    const topics = [
      'me_irl',
      'WackyTicTacs',
      'memes',
      'AdviceAnimals',
      'funny',
      // 'ContagiousLaughter',
      'sarcasm',
      'humour',
      'funny',
      'ProgrammerHumor'
      // 'Jokes'
    ]

    let fail_count = 3

    while (true) {
      try {
        MessageStrategy.typing(message)
        const randomIndex = Math.floor(Math.random() * topics.length)
        const meme = request('GET', 'https://meme-api.com/gimme/' + topics[randomIndex], {
          headers: MessageStrategy.browser_config.headers
        })
        const json = JSON.parse(meme.getBody())
        MessageStrategy.typing(message)
        const image = await MessageStrategy.get_image(json.url)
        await MessageStrategy.client.sendImage(message.from, image, 'meme.jpg', json.postLink)
        return true
      } catch (err) {
        fail_count = fail_count - 1
        console.log(err)
        if (fail_count == 0) {
          return
        }
      }
    }
  }
}

module.exports = {
  MessageStrategy: Meme
}
