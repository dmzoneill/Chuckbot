const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chuck
// ####################################

class Chuck extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static apikey = null
  static gptapi = null

  constructor () {
    super('Chuck', {
      enabled: true
    })
    this.setup()
  }

  async setup () {
    Chuck.apikey = fs.readFileSync('strategies/config/chatgpt.key').toString().trim()

    const { ChatGPTAPI } = await import('chatgpt')

    Chuck.gptapi = new ChatGPTAPI({
      apiKey: Chuck.apikey
    })
  }

  handleEvent (message) {
    // Chuck.self = this;

    // if (message['event_type'] === 'onAddedToGroup') {
    //   console.log("pre added");
    //   Chuck.self.addedToGroup(message);
    // }
  }

  provides () {
    Chuck.self = this

    return {
      help: 'A message strategy to manage chuck',
      provides: {
        'chuck name': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck name')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'chuck name xxxx to change his name'
          },
          action: Chuck.self.SetMyName,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck new': {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck new'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Start a new conversation'
          },
          action: Chuck.self.NewConversation,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck help *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck help')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Converse with about the functionality'
          },
          action: Chuck.self.Help,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
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
          action: Chuck.self.Converse,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Chuck.enabled
      }
    }
  }

  helpMenu () {
    let help = ''

    Object.keys(MessageStrategy.strategies).sort().forEach(key => {
      try {
        help += '*' + key + '*\n'
        help += '  | - help ' + key.toLowerCase() + '\n'

        const actions = MessageStrategy.strategies[key].provides()
        if (actions === undefined || actions === undefined) {
          console.log(key + ' undefined')
        }
        const provides = actions.provides
        if (provides === undefined || provides === undefined) {
          console.log(key + ' undefined')
        }

        const keys = Object.keys(provides)
        for (let y = 0; y < keys.length; y++) {
          if (provides[keys[y]].interactive) {
            help += '  | - ' + keys[y] + '\n'
          }
        }

        help += ''
      } catch (e) {

      }
    })

    return help
  }

  async Help (message) {
    try {
      let question = message.body.substr('chuck help'.length)
      question = question + ', using the following menu system\n\n' + Chuck.self.helpMenu()
      const res = await Chuck.gptapi.sendMessage(question)
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async Converse (message) {
    try {
      const options = {}
      if (!('chats' in MessageStrategy.state.Chuck)) {
        MessageStrategy.state.Chuck.chats = {}
      }

      if (!(message.chatId in MessageStrategy.state.Chuck.chats)) {
        MessageStrategy.state.Chuck.chats[message.chatId] = {}
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = null
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = null
      }

      if (MessageStrategy.state.Chuck.chats[message.chatId].conversationId != null) {
        options.conversationId = MessageStrategy.state.Chuck.chats[message.chatId].conversationId
      }

      if (MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId != null) {
        options.parentMessageId = MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId
      }

      const requester = message.sender.pushname === undefined ? '' : message.sender.pushname

      const res = await Chuck.gptapi.sendMessage(message.body.substr(7) + '(' + requester + ')', options)

      if (res.conversationId != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      }

      if (res.id != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id
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
      if (!('chats' in MessageStrategy.state.Chuck)) {
        MessageStrategy.state.Chuck.chats = {}
      }

      if (!(message.chatId in MessageStrategy.state.Chuck.chats)) {
        MessageStrategy.state.Chuck.chats[message.chatId] = {}
      }

      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = null
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = null

      let question = 'I want to ask you questions about the following menu system \n\n' + Chuck.self.helpMenu()
      question += '\n\nEach entry is a command, and i will ask you about commands on the list and their usage.'
      question += '\n\nThe questions will have the name or phone number at the end of the question in brackets.  You can use their name in the response.'
      let res = await Chuck.gptapi.sendMessage(question)

      const options = {}
      options.parentMessageId = res.id
      options.conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

      const requester = message.sender.pushname === undefined ? '' : message.sender.pushname

      res = await Chuck.gptapi.sendMessage('Lets start a new conversation (' + requester + ')', options)

      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  SetMyName (message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  SetMyStatus (message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  setPresence (message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  setProfilePic (message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  addedToGroup (message) {
    console.log('added')
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, 'Hey 👋, I\'m Chuck.  You can interact with me by saying \'help\'')
  }
}

module.exports = {
  MessageStrategy: Chuck
}
