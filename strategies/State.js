const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// State
// ####################################

class State extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static lock = false

  constructor() {
    super('State', {
      enabled: true
    })
    this.Load()
  }

  provides() {
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

  Show(message) {
    try {
      console.log(JSON.stringify(MessageStrategy.state, null, 2))
      MessageStrategy.client.sendText(message.from, JSON.stringify(MessageStrategy.state, null, 2))
    } catch (err) {
      console.log(err)
    }
  }

  Save(message) {
    if (State.lock) {
      console.log("State locked, possible load or save in progress")
      return
    }

    State.lock = true
    let success = false

    while (!success) {
      try {
        const state_json = JSON.stringify(MessageStrategy.state)

        if (state_json === undefined) return
        if (state_json === null) return
        if (state_json === '') return
        if (state_json.length < 3000) return

        let msg = 'The state file was saved!'

        fs.writeFileSync('state.json', state_json)
        console.log(msg)
        if (message.body.toLowerCase().startsWith('state')) {
          MessageStrategy.client.sendText(message.from, msg)
        }

        success = true
      } catch (err) {
        console.log(err)
        State.self.waitFor(1000)
      }
    }

    State.lock = false
  }

  Load(message) {
    if (State.lock) {
      console.log("State locked, possible load or save in progress")
      return
    }

    State.lock = true
    let success = false

    while (!success) {
      try {
        const data = fs.readFileSync('state.json', { encoding: 'utf8', flag: 'r' });
        const obj = JSON.parse(data)

        if (obj != null) {
          MessageStrategy.state = obj
          if (message) {
            MessageStrategy.client.sendText(message.from, 'State loaded')
          }
          success = true
        }
        else {
          console.log("State load failed, object null")
          State.self.waitFor(1000)
        }        
      } catch (err) {
        console.log(err)
        State.self.waitFor(1000)
      }
    }

    State.lock = false
  }
}

module.exports = {
  MessageStrategy: State
}
