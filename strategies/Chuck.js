const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chuck
// ####################################

class Chuck extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Chuck', {
      enabled: true
    })
  }

  handleEvent (message) {
    // Chuck.self = this;

    // if (message['event_type'] == 'onAddedToGroup') {
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
