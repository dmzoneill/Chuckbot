const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Instagram previews / search
// ####################################

class Instagram extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static config = {}
  static client = null

  constructor () {
    super('Instagram', {
      enabled: true
    })
  }

  provides () {
    Instagram.self = this

    return {
      help: 'Provides previews and searches for instagram videos',
      provides: {
        'instagram profile': {
          test: function (message) {
            return message.body.toLowerCase() == 'instagram profile'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Returns instagrma profile'
          },
          interactive: true,
          action: Instagram.self.Profile,
          enabled: function () {
            return MessageStrategy.state.Instagram.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Instagram.enabled
      }
    }
  }

  async Profile (message) {
    try {
      // Instagram.config = JSON.parse(fs.readFileSync('strategies/config/instagram.json', { encoding: 'utf8', flag: 'r' }));
      // let username = Instagram.config['username']
      // let password = Instagram.config['password']
      // Instagram.client = new IG({ username, password })

      // Instagram.client.login().then(() => {
      //   Instagram.client.getProfile().then(console.log)
      // })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Instagram
}
