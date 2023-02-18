const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// State
// ####################################

class State extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('State', {
      enabled: true
    })
    this.Load()
  }

  provides () {
    State.self = this

    return {
      help: 'Manages the state of chuck',
      provides: {
        'state show': {
          test: function (message) {
            return message.body.toLowerCase() === 'state show'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show chuck state'
          },
          action: State.self.Show,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.State.enabled
          }
        },
        'state save': {
          test: function (message) {
            return message.body.toLowerCase() === 'state save'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Save chuck state'
          },
          action: State.self.Save,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.State.enabled
          }
        },
        'state load': {
          test: function (message) {
            return message.body.toLowerCase() === 'state load'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Load chuck state'
          },
          action: State.self.Load,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.State.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.State.enabled
      }
    }
  }

  Show (message) {
    try {
      console.log(JSON.stringify(MessageStrategy.state, null, 2))
      MessageStrategy.client.sendText(message.from, JSON.stringify(MessageStrategy.state, null, 2))
    } catch (err) {
      console.log(err)
    }
  }

  Save (message) {
    try {
      const state_json = JSON.stringify(MessageStrategy.state)

      if (state_json == undefined) return
      if (state_json == null) return
      if (state_json == '') return
      if (state_json.length < 1500) return

      fs.writeFile('state.json', state_json, function (err) {
        try {
          if (err) {
            return console.log(err)
          }
          if (message.body.startsWith('state')) {
            MessageStrategy.client.sendText(message.from, 'The file was saved!')
          }
          console.log('The file was saved!')
        } catch (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  Load (message) {
    try {
      fs.readFile('state.json', 'utf8', function (err, data) {
        if (err) {
          return console.log(err)
        }
        try {
          const obj = JSON.parse(data)
          if (obj != null) {
            MessageStrategy.state = obj
            if (message) {
              MessageStrategy.client.sendText(message.from, 'State loaded')
            }
          }
        } catch (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: State
}
