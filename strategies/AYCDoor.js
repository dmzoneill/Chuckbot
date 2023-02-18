const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// AYCDoor
// ####################################

class AYCDoor extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('AYCDoor', {
      enabled: true
    })
  }

  provides () {
    AYCDoor.self = this

    return {
      help: 'Manages AYC Door',
      provides: {
        'ayc open door': {
          test: function (message) {
            return message.body.toLowerCase() === 'ayc open door'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Open the door'
          },
          action: AYCDoor.self.OpenDoor,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.AYCDoor.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.AYCDoor.enabled
      }
    }
  }

  AYCDoor () {
    return false
  }

  OpenDoor (message) {
    try {
      console.log('Opening door')
      const result = request('GET', 'http://192.168.0.30:9101/door/index.php?opendoor=true', {})
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, result.getBody())
    } catch (err) {
      console.log(err)
    }
  };
}

module.exports = {
  MessageStrategy: AYCDoor
}
