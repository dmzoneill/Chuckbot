const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// APC
// ####################################

class APC extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('APC', {
      enabled: true
    })
  }

  provides () {
    APC.self = this

    return {
      help: 'Manages APC UPS',
      provides: {
        'apc info': {
          test: function (message) {
            return message.body.toLowerCase() === 'apc info'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show ups information'
          },
          action: APC.self.Info,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.APC.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.APC.enabled
      }
    }
  }

  async Info (message) {
    try {
      const cmd = 'apcaccess'
      const child_process = require('child_process')
      const data = child_process.execSync(cmd)

      console.log(data.toString())

      const parts = data.toString().split('SENSE')

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, '```' + parts[0] + '```')
      MessageStrategy.client.sendText(message.from, '```' + 'SENSE' + parts[1] + '```')
    } catch (err) {
      console.log(err)
    }
  };
}

module.exports = {
  MessageStrategy: APC
}
