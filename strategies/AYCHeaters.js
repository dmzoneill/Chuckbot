const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// AYCHeaters
// ####################################

class AYCHeaters extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('AYCHeaters', {
      enabled: true
    })
  }

  provides () {
    AYCHeaters.self = this

    return {
      help: 'Manages AYC Heaters',
      provides: {
        'ayc heater status': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc heater status'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Check the status of the heating'
          },
          action: AYCHeaters.Status,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCHeaters.enabled
          }
        },
        'ayc heater on': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc heater on'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Turn on the heating'
          },
          action: AYCHeaters.TurnOn,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCHeaters.enabled
          }
        },
        'ayc heater off': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc heater off'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Turn off the heating'
          },
          action: AYCHeaters.TurnOff,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCHeaters.enabled
          }
        },
        'ayc heater boost': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc heater boost'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Boost the heating'
          },
          action: AYCHeaters.Boost,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCHeaters.enabled
          }
        },
        'ayc heater reset': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc heater reset'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Reset the heating'
          },
          action: AYCHeaters.Reset,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCHeaters.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.AYCHeaters.enabled
      }
    }
  }

  static async request (message) {
    try {
      const opt = message.body.split(' ')[2].toLowerCase().trim()
      console.log('Managing heaters')
      const result = request('GET', 'http://192.168.0.30:9101/heating/' + opt, {})
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, result.getBody())
    } catch (err) {
      console.log(err)
    }
  }

  static async Status (message) {
    AYCHeaters.request(message)
  }

  static async TurnOn (message) {
    AYCHeaters.request(message)
  }

  static async TurnOff (message) {
    AYCHeaters.request(message)
  }

  static async Boost (message) {
    AYCHeaters.request(message)
  }

  static async Reset (message) {
    AYCHeaters.request(message)
  }
}

module.exports = {
  MessageStrategy: AYCHeaters
}
