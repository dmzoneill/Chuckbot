const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chatgpt
// ####################################

class Chatgpt extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static apikey = null
  static gptapi = null

  constructor () {
    super('Chatgpt', {
      enabled: true
    })

    this.setup()
  }

  async setup () {
    Chatgpt.apikey = fs.readFileSync('strategies/config/chatgpt.key').toString().trim()

    const { ChatGPTAPI } = await import('chatgpt')

    Chatgpt.gptapi = new ChatGPTAPI({
      apiKey: Chatgpt.apikey
    })
  }

  provides () {
    Chatgpt.self = this

    return {
      help: 'Provides a basic interface to chatgpt',
      provides: {
        'chuck new': {
          test: function (message) {
            return message.body.toLowerCase() == 'chuck new'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Start a new conversation'
          },
          action: Chatgpt.self.NewConversation,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chatgpt.enabled
          }
        },
        'chuck *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Converse with chuck'
          },
          action: Chatgpt.self.Converse,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chatgpt.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Chatgpt.enabled
      }
    }
  }

  async Converse (message) {
    try {
      const options = {}

      if (!('chats' in MessageStrategy.state.Chatgpt)) {
        MessageStrategy.state.Chatgpt.chats = {}
      }

      if (!(message.id in MessageStrategy.state.Chatgpt.chats)) {
        MessageStrategy.state.Chatgpt.chats[message.id] = {}
        MessageStrategy.state.Chatgpt.chats[message.id].conversationId = null
        MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId = null
      }

      if (MessageStrategy.state.Chatgpt.chats[message.id].conversationId != null) {
        options.conversationId = MessageStrategy.state.Chatgpt.chats[message.id].conversationId
      }

      if (MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId != null) {
        options.parentMessageId = MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId
      }

      const res = await Chatgpt.gptapi.sendMessage(message.body.substr(7), options)

      if (res.conversationId != null) {
        MessageStrategy.state.Chatgpt.chats[message.id].conversationId = res.conversationId
      }

      if (res.parentMessageId != null) {
        MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId = res.parentMessageId
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async NewConversation (message) {
    try {
      if (!('chats' in MessageStrategy.state.Chatgpt)) {
        MessageStrategy.state.Chatgpt.chats = {}
      }

      if (!(message.id in MessageStrategy.state.Chatgpt.chats)) {
        MessageStrategy.state.Chatgpt.chats[message.id] = {}
        MessageStrategy.state.Chatgpt.chats[message.id].conversationId = null
        MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId = null
      }

      MessageStrategy.state.Chatgpt.chats[message.id].conversationId = null
      MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId = null

      const res = await Chatgpt.gptapi.sendMessage('Lets start a new conversation')

      if (res.conversationId != null) {
        MessageStrategy.state.Chatgpt.chats[message.id].conversationId = res.conversationId
      }

      if (res.parentMessageId != null) {
        MessageStrategy.state.Chatgpt.chats[message.id].parentMessageId = res.parentMessageId
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }
}

module.exports = {
  MessageStrategy: Chatgpt
}
