const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Logger
// ####################################

class Logger extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Logger', {
      enabled: true,
      media_dir: './strategies/media'
    })
  }

  provides () {
    Logger.self = this

    return {
      help: 'Logs media to disk',
      provides: {
        'logger save': {
          test: function (message) {
            return true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return ''
          },
          action: function SaveMedia (message) {
            Logger.self.SaveMedia(message)
            return false
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Logger.enabled
          }
        },
        'logger list mine': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('logger list mine')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'List resources that were posted by you'
          },
          action: function ListMine (message) {
            Logger.self.ListMine(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Logger.enabled
          }
        },
        'logger list': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('logger list')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows all the logged resources'
          },
          action: function List (message) {
            Logger.self.List(message, false)
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Logger.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Logger.enabled
      }
    }
  }

  async SaveMedia (message) {
    try {
      if (message.type !== 'image' && message.type !== 'video') {
        return
      }

      const mime_types = {
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'video/mp4': 'mp4'
      }

      if (!fs.existsSync(MessageStrategy.state.Logger.media_dir)) {
        fs.mkdirSync(MessageStrategy.state.Logger.media_dir)
      }

      const data_url = await MessageStrategy.client.decryptMedia(message)
      const buff = Buffer.from(data_url.substring(data_url.indexOf(',')), 'base64')
      const sha1d = crypto.createHash('sha1').digest('hex')
      const filename = Date.now() + ' - ' + message.from + ' - ' + sha1d + '.' + mime_types[message.mimetype]

      fs.writeFile(MessageStrategy.state.Logger.media_dir + '/' + filename, buff, function (err) {
        if (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  my_files (list, filter) {
    const filtered = []

    list.forEach(item => {
      if (item.indexOf(filter) > -1) {
        filtered.push(item)
      }
    })

    return filtered
  }

  async ListMine (message) {
    Logger.self.List(message, true)
  }

  async List (message, filter_mine) {
    fs.readdir(MessageStrategy.state.Logger.media_dir, (err, files) => {
      if (err) return

      let full_msg = ''
      const my_files = filter_mine ? Logger.self.my_files(files, message.from) : files
      let cnt = 1

      my_files.forEach(file => {
        const padding = 5
        let msg = cnt.toString() + ''
        msg += ' '.repeat(padding - msg.length)
        msg += ': ' + file + '\n'
        full_msg += msg
        cnt += 1
      })

      MessageStrategy.client.sendText(message.from, full_msg.trim())
    })
  }
}

module.exports = {
  MessageStrategy: Logger
}
