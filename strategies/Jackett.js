const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Jacket search
// ####################################

class Jackett extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static apikey = null

  constructor () {
    super('Jackett', {
      enabled: true
    })

    Jackett.apikey = fs.readFileSync('strategies/config/jackett.key').toString().trim()
  }

  provides () {
    Jackett.self = this

    return {
      help: 'Jackett seearch',
      provides: {
        jackett: {
          test: function (message) {
            return message.body.toLowerCase() === 'jackett'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: Jackett.self.Jackett,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Jackett.enabled
          }
        },
        'jackett x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('jackett ')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: Jackett.self.Search,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Jackett.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Jackett.enabled
      }
    }
  }

  Jackett () {
    return false
  }

  async Search (message) {
    try {
      MessageStrategy.typing(message)

      let url = 'http://192.168.0.30:9117/api/v2.0/indexers/all/results'
      url += '?apikey=' + Jackett.apikey
      // url += "&Category[]=2000,2030,2040,2045,2080,5000,5010,5030,5040,5080"
      url += '&Query=' + message.body.substring(8)
      url += '&Tracker[]=iptorrents'

      console.log(url)

      const results = await MessageStrategy.axiosHttpRequest(message, 'GET', url, false, 200, true, 'Results')

      console.log(results)

      MessageStrategy.typing(message)

      const seedersG0 = results.filter(function (el) {
        return el.Seeders > 0
      }
      )

      if (seedersG0.length == 0) {
        MessageStrategy.client.reply(message.from, 'No torrents found', message.id, true)
        return
      }

      seedersG0.sort(function (a, b) {
        return a.Seeders - b.Seeders
      })

      const result = seedersG0[seedersG0.length - 1]

      if ('MagnetUri' in result && result.MagnetUri != null) {
        MessageStrategy.client.sendLinkWithAutoPreview(message.from, result.MagnetUri, result.Title)
      } else if ('Link' in result) {
        const torrent = await MessageStrategy.axiosHttpRequest(message, 'GET', result.Link, false, 200, false, false, false, false, false, true)
        fs.writeFileSync('/tmp/' + result.Title + '.torrent', torrent)
        MessageStrategy.client.sendFile(message.from, '/tmp/' + result.Title + '.torrent', result.Title + '.torrent', result.Title)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Jackett
}
