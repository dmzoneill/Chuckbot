const MessageStrategy = require('../MessageStrategy.js')

// ###################################
// Chuck
// ###################################

class Chuck extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static apikey = null
  static gptapi = null
  static number = '353852619862@c.us'
  static lastInteracted = {}
  static pickedVideos = []

  constructor () {
    super('Chuck', {
      enabled: true
    })
    this.setup()
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
        'chuck groups': {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck groups'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'List groups chuck is in'
          },
          action: Chuck.self.ListGroups,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck banned': {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck banned'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'List groups chuck is banned from'
          },
          action: Chuck.self.ListBannedGroups,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck leave *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck leave')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Ask chuck to leave a group'
          },
          action: Chuck.self.LeaveGroup,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck ban *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck ban')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Ban chuck from a group'
          },
          action: Chuck.self.BanGroup,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck unban *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck unban')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Unban chuck from a group'
          },
          action: Chuck.self.UnBanGroup,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck gptbanlist *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck gptbanlist')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Unban a user from interacting with gpt'
          },
          action: Chuck.self.GPTBanList,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck gptban *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck gptban')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Ban a user from interacting with gpt'
          },
          action: Chuck.self.GPTBan,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck gptunban *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck gptunban')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Unban a user from interacting with gpt'
          },
          action: Chuck.self.GPTUnBan,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck persona delete': {
          test: function (message) {
            return message.body.toLowerCase() === 'chuck persona delete'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Delete chucks persona'
          },
          action: Chuck.self.PersonaDelete,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck persona name *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck persona name')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Change chucks persona name'
          },
          action: Chuck.self.PersonaName,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck persona *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck persona')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Change chucks persona'
          },
          action: Chuck.self.Persona,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chuck.enabled
          }
        },
        'chuck media *': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('chuck media')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Change chucks media preferences'
          },
          action: Chuck.self.Media,
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
            Chuck.self.Converse(message)
            return false
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

  async setup () {
    // eslint-disable-next-line no-undef
    Chuck.apikey = fs.readFileSync('strategies/config/chatgpt.key').toString().trim()

    const { ChatGPTAPI } = await import('chatgpt')

    Chuck.gptapi = new ChatGPTAPI({
      apiKey: Chuck.apikey,
      debug: true,
      completionParams: {
        model: 'gpt-4'
      }
    })
  }

  is_help_command (message) {
    try {
      const stratKeys = Object.keys(MessageStrategy.strategies).sort()
      for (let h = 0; h < stratKeys.length; h++) {
        try {
          if (stratKeys[h] === 'Chuck') continue
          const actions = MessageStrategy.strategies[stratKeys[h]].provides()
          const provides = actions.provides
          const keys = Object.keys(provides)
          for (let y = 0; y < keys.length; y++) {
            if (provides[keys[y]].interactive === false) continue
            if (provides[keys[y]].test(message)) {
              return true
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    } catch (err) {
      return false
    }
    return false
  }

  get_help_menu () {
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

  setup_state () {
    if (Object.keys(MessageStrategy.state).indexOf('Chuck') === -1) {
      MessageStrategy.state.Chuck = {}
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('AllowedGroups') === -1) {
      MessageStrategy.state.Chuck.AllowedGroups = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('BannedGroups') === -1) {
      MessageStrategy.state.Chuck.BannedGroups = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTBannedUsers') === -1) {
      MessageStrategy.state.Chuck.GPTBannedUsers = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTUserUsage') === -1) {
      MessageStrategy.state.Chuck.GPTUserUsage = {}
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('ChatPersonas') === -1) {
      MessageStrategy.state.Chuck.ChatPersonas = {}
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('ChatPersonasMedia') === -1) {
      MessageStrategy.state.Chuck.ChatPersonasMedia = {}
    }
  }

  handleEvent (message) {
    Chuck.self = this
    Chuck.self.setup_state()

    if (message.event_type === 'onAddedToGroup') {
      Chuck.self.addedToGroup(message)
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
    if (Chuck.self.isPersonaMode(message)) {
      Chuck.self.NewConversation(message)
      return
    }
    Chuck.self.leave_banned_groups()
    MessageStrategy.client.sendText(message.event.id, 'Hey, this is Chuck!\n\nYou can chat with me by saying "chuck" anywhere in your message.\n\nIf you need help, simply say "Chuck how do i use the help commands" or similar.\n\nI also speak 150 languages.')
    return true
  }

  isPersonaMode (message) {
    try {
      let name
      if ('event' in message) {
        if (message.event_type === 'onAddedToGroup') {
          name = message.event.contact.id.toLowerCase()
        }
      } else {
        name = message.chat.contact.id.toLowerCase()
      }

      Chuck.self.setup_state()
      for (const key in MessageStrategy.state.Chuck.ChatPersonas) {
        const check = key.toLowerCase()
        if (check === name) {
          return true
        }
      }
      return false
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async Persona (message) {
    try {
      if (message.body.toLowerCase().trim() === 'chuck persona') {
        MessageStrategy.client.sendText(message.from, MessageStrategy.state.Chuck.ChatPersonas[message.from].desc)
        return
      }
      MessageStrategy.state.Chuck.ChatPersonas[message.from].desc = message.body.substring('chuck persona'.length)
    } catch (e) {
      console.log(e)
    }
  }

  async PersonaName (message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() === 'chuck persona name') {
        MessageStrategy.client.sendText(message.from, MessageStrategy.state.Chuck.ChatPersonas[message.from].name)
        return
      }

      if (!(message.from in MessageStrategy.state.Chuck.ChatPersonas)) {
        MessageStrategy.state.Chuck.ChatPersonas[message.from] = {}
      }

      MessageStrategy.state.Chuck.ChatPersonas[message.from].name = message.body.substring('chuck persona name'.length)
    } catch (e) {
      console.log(e)
    }
  }

  async PersonaDelete (message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() === 'chuck persona delete') {
        delete MessageStrategy.state.Chuck.ChatPersonas[message.from]
      }
    } catch (e) {
      console.log(e)
    }
  }

  async Media (message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() === 'chuck media') {
        MessageStrategy.client.sendText(message.from, MessageStrategy.state.Chuck.ChatPersonasMedia[message.from])
        return
      }
      MessageStrategy.state.Chuck.ChatPersonasMedia[message.from] = message.body.substring('chuck persona'.length - 1).split(',')
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async leave_group (groupId) {
    try {
      MessageStrategy.client.sendText(groupId, 'Look at you! with your fucking 48% body fat! And you, you scrawny little bastard! Fuck you guys!')
      Chuck.self.waitFor(1000)
      MessageStrategy.client.leaveGroup(groupId)
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async leave_banned_groups (message) {
    try {
      Chuck.self.setup_state()
      for (let h = 0; h < MessageStrategy.state.Chuck.BannedGroups.length; h++) {
        Chuck.self.leave_group(MessageStrategy.state.Chuck.BannedGroups[h])
      }
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async LeaveGroup (message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() === 'chuck leave') {
        Chuck.self.leave_group(message.chatId)
      } else {
        const groups = await MessageStrategy.client.getAllGroups()
        const id = parseInt(message.body.substring(12).trim())
        Chuck.self.leave_group(groups[id].id)
      }
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTBan (message) {
    try {
      Chuck.self.setup_state()
      const filter = message.body.toLowerCase().substring('chuck gptban'.length).trim()
      if (MessageStrategy.state.Chuck.GPTBannedUsers.indexOf(filter) === -1) {
        MessageStrategy.state.Chuck.GPTBannedUsers.push(filter)
        MessageStrategy.client.sendText(message.from, 'banned')
      }
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTUnBan (message) {
    try {
      Chuck.self.setup_state()
      const id = parseInt(message.body.substring('chuck gptunban'.length).trim())
      MessageStrategy.state.Chuck.GPTBannedUsers.splice(id, 1)
      MessageStrategy.client.sendText(message.from, 'Unbanned')
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTBanList (message) {
    try {
      Chuck.self.setup_state()
      MessageStrategy.client.sendText(message.from, JSON.stringify(MessageStrategy.state.Chuck.GPTBannedUsers, null, 2))
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async BanGroup (message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() === 'chuck ban') {
        if (MessageStrategy.state.Chuck.BannedGroups.indexOf(message.chatId) === -1) {
          MessageStrategy.state.Chuck.BannedGroups.push(message.chatId)
        }
        Chuck.self.leave_banned_groups()
      } else {
        const groups = await MessageStrategy.client.getAllGroups()
        const id = parseInt(message.body.substring(10).trim())
        if (MessageStrategy.state.Chuck.BannedGroups.indexOf(groups[id].id) === -1) {
          MessageStrategy.state.Chuck.BannedGroups.push(groups[id].id)
        }
        Chuck.self.leave_banned_groups()
      }
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async UnBanGroup (message) {
    try {
      Chuck.self.setup_state()
      const id = parseInt(message.body.substring('chuck unban'.length).trim())
      MessageStrategy.state.Chuck.BannedGroups.splice(id, 1)
      MessageStrategy.client.sendText(message.from, 'Unbanned')
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async ListBannedGroups (message) {
    try {
      Chuck.self.setup_state()
      const groups = MessageStrategy.state.Chuck.BannedGroups

      if (groups.length === 0) {
        MessageStrategy.client.sendText(message.from, '0 banned groups')
        return
      }

      let msg = ''

      for (let y = 0; y < groups.length; y++) {
        msg += y.toString().padStart(2, ' ') + ' ' + groups[y] + '\n'
      }

      MessageStrategy.client.sendText(message.from, '``` ' + msg.trim() + '```')
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async ListGroups (message) {
    try {
      Chuck.self.setup_state()
      const groups = await MessageStrategy.client.getAllGroups()

      let msg = ''

      for (let y = 0; y < groups.length; y++) {
        const group = groups[y]
        const name = Object.keys(group).indexOf('formattedTitle') > -1 ? group.formattedTitle : group.id
        msg += y.toString().padStart(2, ' ') + ' ' + name + '\n'
      }

      MessageStrategy.client.sendText(message.from, '``` ' + msg.trim() + '```')
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async Help (message) {
    try {
      let question = message.body.substr('chuck help'.length)
      question = question + ', using the following menu system\n\n' + Chuck.self.get_help_menu()
      const res = await Chuck.gptapi.sendMessage(question)
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }

  async get_current_usage (user) {
    let totalUsage = 0
    const usage = Object.keys(MessageStrategy.state.Chuck.GPTUserUsage[user])
    for (let h = 0; h < usage.length; h++) {
      if (parseInt(usage[h]) > Math.floor(Date.now() / 1000) - 86400) {
        totalUsage += MessageStrategy.state.Chuck.GPTUserUsage[user][usage[h]]
      }
    }
    for (let h = 0; h < usage.length; h++) {
      if (parseInt(usage[h]) < Math.floor(Date.now() / 1000) - 86400) {
        delete MessageStrategy.state.Chuck.GPTUserUsage[user][usage[h]]
      }
    }
    return totalUsage
  }

  async Converse (message) {
    try {
      if (Chuck.self.is_help_command(message)) {
        console.log('Chuck help skip')
        return
      }

      const options = {}
      if (!('chats' in MessageStrategy.state.Chuck)) {
        MessageStrategy.state.Chuck.chats = {}
      }

      if (!(message.chatId in MessageStrategy.state.Chuck.chats)) {
        MessageStrategy.state.Chuck.chats[message.chatId] = {}
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = null
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = null

        if (Chuck.self.isPersonaMode(message)) {
          Chuck.self.NewConversation(message)
        }
      }

      if (MessageStrategy.state.Chuck.chats[message.chatId].conversationId !== null) {
        options.conversationId = MessageStrategy.state.Chuck.chats[message.chatId].conversationId
      }

      if (MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId !== null) {
        options.parentMessageId = MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId
      }

      if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTUserUsage') === -1) {
        MessageStrategy.state.Chuck.GPTUserUsage = {}
      }

      const requester = message.sender.pushname === undefined ? '' : message.sender.pushname

      if (('type' in message) === false) {
        return
      }

      if (Chuck.self.isPersonaMode(message)) {
        options.systemMessage = MessageStrategy.state.Chuck.ChatPersonas[message.chatId].desc

        const tenMinutesAgo = Date.now() - 1 * 60 * 1000

        for (const key in Chuck.lastInteracted) {
          if (Chuck.lastInteracted[key] < tenMinutesAgo) {
            delete Chuck.lastInteracted[key]
          }
        }

        let isNameInSentence
        const recentlyInteractedWithAuthor = (message.author in Chuck.lastInteracted)
        const respondWithQuote = Math.random() < 0.5
        const randomRespond = Math.random() < 0.10
        const randomRespondWithMedia = Math.random() < 0.3
        const iWasQuoted = 'quotedMsg' in message && message.quotedMsg.author === Chuck.number

        if (randomRespondWithMedia && randomRespond && !recentlyInteractedWithAuthor) {
          if (MessageStrategy.state.Chuck.ChatPersonasMedia[message.from] === undefined) {
            MessageStrategy.state.Chuck.ChatPersonasMedia[message.from] = []
          }
          if (MessageStrategy.state.Chuck.ChatPersonasMedia[message.from].length > 0) {
            const array = MessageStrategy.state.Chuck.ChatPersonasMedia[message.from]
            const randomWord = array[Math.floor(Math.random() * array.length)]
            // eslint-disable-next-line no-undef
            usetube.searchVideo(randomWord).then(results => {
              results.videos.sort(() => Math.random() - 0.5)
              for (const video of results.videos) {
                if (!Chuck.pickedVideos.includes(video.id)) {
                  Chuck.pickedVideos.push(video.id)
                  MessageStrategy.client.sendYoutubeLink(message.from, 'https://www.youtube.com/watch?v=' + video.id, video.title)
                  break
                }
              }
            }).catch(console.error)
          }
          if (Math.random() < 0.7) {
            return
          }
        }

        if (message.type === 'chat') {
          const name = MessageStrategy.state.Chuck.ChatPersonas[message.chatId].name.trim().toLowerCase()
          isNameInSentence = (sentence, name) => {
            const words = sentence.toLowerCase().match(/\b\w+\b/g) // Match words with word boundaries
            return words.includes(name)
          }
          isNameInSentence = isNameInSentence(message.body, name)
          if (message.body.length < 8 && !iWasQuoted && !isNameInSentence) {
            return
          }
        }

        if (!recentlyInteractedWithAuthor && !iWasQuoted && !randomRespond && !isNameInSentence) {
          return
        }

        Chuck.lastInteracted[message.author] = Date.now()

        if (message.type !== 'chat') {
          console.log('Chuck not a chat skip')
          return
        }

        const res = await Chuck.gptapi.sendMessage(message.body, options)
        const resp = res.text

        if (res.conversationId !== null) {
          MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
        }

        if (res.id !== null) {
          MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id
        }

        const keywords = ['as an AI', 'openai', 'gpt', 'language model', 'artificial intelligence', 'chatbot']
        const lowerCaseResp = resp.toLowerCase()

        if (keywords.some(keyword => lowerCaseResp.indexOf(keyword) > -1)) {
          console.log('Chuck said something about ai skip')
          return
        }

        MessageStrategy.typing(message)
        if (respondWithQuote) {
          MessageStrategy.client.reply(message.from, resp, message.id, true)
        } else {
          MessageStrategy.client.sendText(message.from, resp)
        }

        return
      }

      if (message.type !== 'chat') {
        console.log('Chuck not a chat skip')
        return
      }

      let theMsg = message.body

      if (message.isGroupMsg) {
        if (message.body.toLowerCase().startsWith('chuck') === false && message.body.toLowerCase().indexOf(' chuck') === -1) {
          return
        }
      }

      if (message.body.toLowerCase().startsWith('chuck')) {
        theMsg = 'Chatgpt ' + theMsg.substr(6)
      }

      if (message.body.toLowerCase().indexOf(' chuck') === -1) {
        theMsg = theMsg.replace(/ chuck/gi, ' chatgpt')
      }

      const banned = MessageStrategy.state.Chuck.GPTBannedUsers

      for (let y = 0; y < banned.length; y++) {
        if (message.sender.id.indexOf(banned[y]) > -1) {
          MessageStrategy.client.sendText(message.from, 'Banned')
          return
        }
      }

      if (Object.keys(MessageStrategy.state.Chuck.GPTUserUsage).indexOf(message.sender.id) === -1) {
        MessageStrategy.state.Chuck.GPTUserUsage[message.sender.id] = {}
      }

      const currentUserUsage = await Chuck.self.get_current_usage(message.sender.id)

      if (currentUserUsage > 40000) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'You have a rolling 24hr quota of 40000 credits, relax a while')
        return
      }

      const res = await Chuck.gptapi.sendMessage(theMsg + ' ' + requester, options)
      let resp = res.text.replace(/chatgpt/gi, 'chuck')
      resp = res.text.replace(/openai/gi, 'dave')

      if (res.detail.usage.total_tokens !== undefined) {
        MessageStrategy.state.Chuck.GPTUserUsage[message.sender.id][Math.floor(Date.now() / 1000)] = res.detail.usage.total_tokens
      }

      if (res.conversationId !== null) {
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      }

      if (res.id !== null) {
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, resp)
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
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

      let prompt

      if (Chuck.self.isPersonaMode(message) && MessageStrategy.state.Chuck.ChatPersonas[message.from] !== undefined) {
        prompt = MessageStrategy.state.Chuck.ChatPersonas[message.from].desc
      } else {
        prompt = 'I will ask you questions.  Each question has a name or phone number at the end of the question.  Please use that in the response'
      }

      // let question = 'I want to ask you questions about the following menu system \n\n' + Chuck.self.get_help_menu()
      // question += '\n\nEach entry is a command, and i will ask you about commands on the list and their usage.'
      // question += '\n\nThe questions will have the name or phone number at the end of the question.  You can use their name in the response.'
      // let res = await Chuck.gptapi.sendMessage(question)

      let res = await Chuck.gptapi.sendMessage(prompt)

      const options = {}
      options.parentMessageId = res.id
      options.conversationId = res.conversationId
      options.systemMessage = prompt
      MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

      if (!Chuck.self.isPersonaMode(message)) {
        let requester = message.sender.pushname === undefined ? '' : message.sender.pushname
        requester = requester.indexOf(' ') > -1 ? requester.split(' ')[0] : requester

        res = await Chuck.gptapi.sendMessage('Lets start a new conversation. ' + requester, options)
        let resp = res.text.replace(/chatgpt/gi, 'chuck')
        resp = res.text.replace(/openai/gi, 'dave')

        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id

        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, resp)
      }
    } catch (e) {
      console.log(e)
      // MessageStrategy.client.sendText(message.from, e)
    }
  }
}

module.exports = {
  MessageStrategy: Chuck
}
