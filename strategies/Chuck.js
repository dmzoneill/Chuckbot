const MessageStrategy = require('../MessageStrategy.js')

// ###################################
// Chuck
// ###################################

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
        'chuck groups': {
          test: function (message) {
            return message.body.toLowerCase() == 'chuck groups'
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
            return message.body.toLowerCase() == 'chuck banned'
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

  async setup() {
    Chuck.apikey = fs.readFileSync('strategies/config/chatgpt.key').toString().trim()

    const { ChatGPTAPI } = await import('chatgpt')

    Chuck.gptapi = new ChatGPTAPI({
      apiKey: Chuck.apikey,
      debug: true,
      // completionParams: {
      //   model: 'gpt-4'
      // }
    })
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

  get_help_menu() {
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

  setup_state() {
    if (Object.keys(MessageStrategy.state).indexOf('Chuck') == -1) {
      MessageStrategy.state['Chuck'] = {}
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('AllowedGroups') == -1) {
      MessageStrategy.state.Chuck['AllowedGroups'] = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('BannedGroups') == -1) {
      MessageStrategy.state.Chuck['BannedGroups'] = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTBannedUsers') == -1) {
      MessageStrategy.state.Chuck['GPTBannedUsers'] = []
    }
    if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTUserUsage') == -1) {
      MessageStrategy.state.Chuck['GPTUserUsage'] = {}
    }
  }

  handleEvent(message) {
    Chuck.self = this;
    Chuck.self.setup_state()

    console.log("========================")
    console.log(message['event_type'])
    console.log("========================")

    if (message['event_type'] === 'onAddedToGroup') {
      console.log("pre added");
      Chuck.self.addedToGroup(message);
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
    console.log(message)
    Chuck.self.leave_banned_groups()
    MessageStrategy.client.sendText(message.event.id, 'Hey, this is Chuck!\n\nYou can chat with me by saying "chuck" anywhere in your message.\n\nIf you need help, simply say "Chuck how do i use the help commands" or similar.\n\nI also speak 150 languages.')
    return true
  }

  async leave_group(group_id) {
    try {
      MessageStrategy.client.sendText(group_id, 'Look at you! with your fucking 48% body fat! And you, you scrawny little bastard! Fuck you guys!')
      Chuck.self.waitFor(1000)
      MessageStrategy.client.leaveGroup(group_id)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async leave_banned_groups() {
    try {
      Chuck.self.setup_state()
      for (let h = 0; h < MessageStrategy.state.Chuck.BannedGroups.length; h++) {
        Chuck.self.leave_group(MessageStrategy.state.Chuck.BannedGroups[h])
      }
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async LeaveGroup(message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() == "chuck leave") {
        Chuck.self.leave_group(message.chatId)
      } else {
        let groups = await MessageStrategy.client.getAllGroups()
        let id = parseInt(message.body.substring(12).trim())
        Chuck.self.leave_group(groups[id]['id'])
      }
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTBan(message) {
    try {
      Chuck.self.setup_state()
      let filter = message.body.toLowerCase().substring("chuck gptban".length).trim()
      if (MessageStrategy.state.Chuck.GPTBannedUsers.indexOf(filter) == -1) {
        MessageStrategy.state.Chuck.GPTBannedUsers.push(filter)
        MessageStrategy.client.sendText(message.from, "banned")
      }
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTUnBan(message) {
    try {
      Chuck.self.setup_state()
      let id = parseInt(message.body.substring("chuck gptunban".length).trim())
      MessageStrategy.state.Chuck.GPTBannedUsers.splice(id, 1);
      MessageStrategy.client.sendText(message.from, "Unbanned")

    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async GPTBanList(message) {
    try {
      Chuck.self.setup_state()
      MessageStrategy.client.sendText(message.from, JSON.stringify(MessageStrategy.state.Chuck.GPTBannedUsers, null, 2))
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async BanGroup(message) {
    try {
      Chuck.self.setup_state()
      if (message.body.toLowerCase().trim() == "chuck ban") {
        if (MessageStrategy.state.Chuck.BannedGroups.indexOf(message.chatId) == -1) {
          MessageStrategy.state.Chuck.BannedGroups.push(message.chatId)
        }
        Chuck.self.leave_banned_groups()
      } else {
        let groups = await MessageStrategy.client.getAllGroups()
        let id = parseInt(message.body.substring(10).trim())
        if (MessageStrategy.state.Chuck.BannedGroups.indexOf(groups[id]['id']) == -1) {
          MessageStrategy.state.Chuck.BannedGroups.push(groups[id]['id'])
        }
        Chuck.self.leave_banned_groups()
      }
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async UnBanGroup(message) {
    try {
      Chuck.self.setup_state()
      let id = parseInt(message.body.substring("chuck unban".length).trim())
      MessageStrategy.state.Chuck.BannedGroups.splice(id, 1);
      MessageStrategy.client.sendText(message.from, "Unbanned")
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async ListBannedGroups(message) {
    try {
      Chuck.self.setup_state()
      let groups = MessageStrategy.state.Chuck.BannedGroups

      if (groups.length == 0) {
        MessageStrategy.client.sendText(message.from, "0 banned groups")
        return
      }

      let msg = ""

      for (let y = 0; y < groups.length; y++) {
        msg += y.toString().padStart(2, ' ') + " " + groups[y] + "\n"
      }

      MessageStrategy.client.sendText(message.from, "``` " + msg.trim() + "```")
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async ListGroups(message) {
    try {
      Chuck.self.setup_state()
      let groups = await MessageStrategy.client.getAllGroups()

      let msg = ""

      for (let y = 0; y < groups.length; y++) {
        let group = groups[y];
        let name = Object.keys(group).indexOf('formattedTitle') > -1 ? group['formattedTitle'] : group['id']
        msg += y.toString().padStart(2, ' ') + " " + name + "\n"
      }

      MessageStrategy.client.sendText(message.from, "``` " + msg.trim() + "```")
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async Help(message) {
    try {
      let question = message.body.substr('chuck help'.length)
      question = question + ', using the following menu system\n\n' + Chuck.self.get_help_menu()
      const res = await Chuck.gptapi.sendMessage(question)
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, res.text)
    } catch (e) {
      console.log(e)
      MessageStrategy.client.sendText(message.from, e)
    }
  }

  async get_current_usage(user) {
    let total_usage = 0;
    console.log(JSON.stringify(MessageStrategy.state.Chuck['GPTUserUsage'], null, 2))
    let usage = Object.keys(MessageStrategy.state.Chuck['GPTUserUsage'][user])
    for (let h = 0; h < usage.length; h++) {
      if (parseInt(usage[h]) > Math.floor(Date.now() / 1000) - 86400) {
        total_usage += MessageStrategy.state.Chuck['GPTUserUsage'][user][usage[h]]
      }
    }
    for (let h = 0; h < usage.length; h++) {
      if (parseInt(usage[h]) < Math.floor(Date.now() / 1000) - 86400) {
        delete MessageStrategy.state.Chuck['GPTUserUsage'][user][usage[h]]
      }
    }
    return total_usage
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

      if (Object.keys(MessageStrategy.state.Chuck).indexOf('GPTUserUsage') == -1) {
        MessageStrategy.state.Chuck['GPTUserUsage'] = {}
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

      let banned = MessageStrategy.state.Chuck.GPTBannedUsers;

      for (let y = 0; y < banned.length; y++) {
        if (message.sender.id.indexOf(banned[y]) > -1) {
          MessageStrategy.client.sendText(message.from, "Banned")
          return
        }
      }

      if (Object.keys(MessageStrategy.state.Chuck['GPTUserUsage']).indexOf(message.sender.id) == -1) {
        MessageStrategy.state.Chuck['GPTUserUsage'][message.sender.id] = {}
      }

      let current_user_usage = await Chuck.self.get_current_usage(message.sender.id)

      if (current_user_usage > 30000) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, "You have a rolling 24hr quota of 30000 credits, relax a while")
        return
      }

      const res = await Chuck.gptapi.sendMessage(the_msg + ' ' + requester, options)
      let resp = res.text.replace(/chatgpt/gi, 'chuck')
      resp = res.text.replace(/openai/gi, 'dave')

      console.log(JSON.stringify(res, null, 2))

      if (res.detail.usage.total_tokens != undefined) {
        MessageStrategy.state.Chuck['GPTUserUsage'][message.sender.id][Math.floor(Date.now() / 1000)] = res.detail.usage.total_tokens
      }

      if (res.conversationId != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res.conversationId
      }

      if (res.id != null) {
        MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res.id
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, resp)

      // if ((Math.floor(Math.random() * 9) + 1) % 9 == 1) {
      //   const res2 = await Chuck.gptapi.sendMessage("Can you ask a sarcastic personal question and add an insult into it?" + ' ' + requester, options)
      //   let resp = res2.text.replace(/chatgpt/gi, 'chuck')

      //   if (res2.conversationId != null) {
      //     MessageStrategy.state.Chuck.chats[message.chatId].conversationId = res2.conversationId
      //   }

      //   if (res2.id != null) {
      //     MessageStrategy.state.Chuck.chats[message.chatId].parentMessageId = res2.id
      //   }

      //   MessageStrategy.typing(message)
      //   MessageStrategy.client.sendText(message.from, resp)
      // }

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

      let question = 'I want to ask you questions about the following menu system \n\n' + Chuck.self.get_help_menu()
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
}

module.exports = {
  MessageStrategy: Chuck
}
