const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chuck
// ####################################

class Chuck extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static apikey = null
  static gptapi = null

  constructor() {
    super('Chuck', {
      enabled: true
    })
    this.setup()
  }

  async setup() {
    Chuck.apikey = fs.readFileSync('strategies/config/chatgpt.key').toString().trim()

    const { ChatGPTAPI } = await import('chatgpt')

    Chuck.gptapi = new ChatGPTAPI({
      apiKey: Chuck.apikey
    })
  }

  handleEvent(message) {
    // Chuck.self = this;

    // if (message['event_type'] === 'onAddedToGroup') {
    //   console.log("pre added");
    //   Chuck.self.addedToGroup(message);
    // }
  }

  provides() {
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
        '*': {
          test: function (message) {
            return true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Converse with chuck'
          },
          action: function (message) {
            Chuck.self.Converse(message);
            return false;
          },
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

  HelpMenu() {
    let help = ''

    Object.keys(MessageStrategy.strategies).sort().forEach(key => {
      try {
        help += '\n'
        help += 'help ' + key.toLowerCase() + '\n'

        const actions = MessageStrategy.strategies[key].provides()
        if (actions === undefined || actions === undefined) {
          return
        }
        const provides = actions.provides
        if (provides === undefined || provides === undefined) {
          return
        }

        const keys = Object.keys(provides)
        for (let y = 0; y < keys.length; y++) {
          if (provides[keys[y]].interactive) {
            help += keys[y] + '\n'
          }
        }

        help += ''
      } catch (e) {

      }
    })

    return help
  }

  async Help(message) {
    try {
      let question = message.body.substr('chuck help'.length)
      question = question + ', using the following menu system\n\n' + Chuck.self.HelpMenu()
      const res = await Chuck.gptapi.sendMessage(question)
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  is_help_command(message) {
    try {
      let strat_keys = Object.keys(MessageStrategy.strategies).sort()
      for (let h = 0; h < strat_keys.length; h++) {
        try {
          if (strat_keys[h] == "Chuck") continue;
          const actions = MessageStrategy.strategies[strat_keys[h]].provides()
          const provides = actions.provides
          const keys = Object.keys(provides)
          for (let y = 0; y < keys.length; y++) {
            if (provides[keys[y]].interactive == false) continue;
            if (provides[keys[y]].test(message)) {
              return true
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
    catch (err) {
      return false
    }
    return false
  }

  async Converse(message) {
    try {
      if (Chuck.self.is_help_command(message)) {
        return;
      }

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

      let the_msg = message.body;

      if (message.body.toLowerCase().startsWith("chuck") == false && message.body.toLowerCase().indexOf(" chuck") == -1) {
        return;
      }
      if (message.body.toLowerCase().startsWith("chuck")) {
        the_msg = "Chatgpt " + the_msg.substr(6)
      }
      if (message.body.toLowerCase().indexOf(" chuck") == -1) {
        the_msg = the_msg.replace(/ chuck/gi, ' chatgpt')
      }

      const res = await Chuck.gptapi.sendMessage(the_msg + ' ' + requester, options)
      let resp = res.text.replace(/chatgpt/gi, 'chuck')

      if (res.conversationId != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      }

      if (res.id != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, resp)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async NewConversation(message) {
    try {
      if (!('chats' in MessageStrategy.state.Chuck)) {
        MessageStrategy.state.Chuck.chats = {}
      }

      if (!(message.chatId in MessageStrategy.state.Chuck.chats)) {
        MessageStrategy.state.Chuck.chats[message.chatId] = {}
      }

      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = null
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = null

      let question = 'I want to ask you questions about the following menu system \n\n' + Chuck.self.HelpMenu()
      question += '\n\nEach entry is a command, and i will ask you about commands on the list and their usage.'
      question += '\n\nThe questions will have the name or phone number at the end of the question.  You can use their name in the response.'
      let res = await Chuck.gptapi.sendMessage(question)

      const options = {}
      options.parentMessageId = res.id
      options.conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

      let requester = message.sender.pushname === undefined ? '' : message.sender.pushname
      requester = requester.indexOf(" ") > -1 ? requester.split(" ")[0] : requester

      res = await Chuck.gptapi.sendMessage('Lets start a new conversation. ' + requester, options)
      let resp = res.text.replace(/chatgpt/gi, 'chuck');

      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, resp)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  SetMyName(message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  SetMyStatus(message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  setPresence(message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  setProfilePic(message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, '👋 Hello!!!')
    return true
  }

  addedToGroup(message) {
    MessageStrategy.typing(message)
    MessageStrategy.client.sendText(message.from, 'Hey 👋, I\'m Chuck.  You can interact with me by saying \'help\'')
  }
}

module.exports = {
  MessageStrategy: Chuck
}
