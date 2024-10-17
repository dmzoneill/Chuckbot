const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Chan
// ####################################

class Chan extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Chan', {
      enabled: true
    })
  }

  provides (message) {
    Chan.self = this

    return {
      help: 'Gets a random Chan',
      provides: {
        'Chan subscriptions': {
          test: function (message) {
            return message.body.toLowerCase() === 'chan subscriptions'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'show list of chat subscriptions'
          },
          action: Chan.self.List,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Chan.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Chan.enabled
      }
    }
  }

  validURL (str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    return !!pattern.test(str)
  }

  async Clear (message) {
    try {
      MessageStrategy.state.Chan = {}
    } catch (err) {
    }
  }

  async State (message) {
    try {
      console.log(JSON.stringify(MessageStrategy.state.Chan, null, 4))
    } catch (err) {
    }
  }

  async Pop (message) {
    try {
      const chatkeys = Object.keys(MessageStrategy.state.Chan.Notified)
      for (let y = 0; y < chatkeys.length; y++) {
        const subkeys = Object.keys(MessageStrategy.state.Chan.Notified[chatkeys[y]])
        for (let h = 0; h < subkeys.length; h++) {
          MessageStrategy.state.Chan.LastNotified[message.from][chatkeys[y]][subkeys[h]] = 0
          console.log('Popped: ' + MessageStrategy.state.Chan.Notified[chatkeys[y]][subkeys[h]].pop().toString())
        }
      }
    } catch (err) {
    }
  }

  async List (message) {
    try {
      let msg = ''
      const subkeys = Object.keys(MessageStrategy.state.Chan.Subscribed[message.from])

      if (subkeys.length === 0) {
        MessageStrategy.client.sendText(message.from, 'This chat has 0 subscriptions')
        return
      }

      for (let h = 0; h < subkeys.length; h++) {
        msg += h.toString() + ' ' + MessageStrategy.state.Chan.Subscribed[message.from][subkeys[h]] + '\n'
      }
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
    }
  }

  async UnSubscribe (message) {
    try {
      const parts = message.body.split(' ')
      const isno = parseInt(parts[2])
      let toBeRemoved = parts[2]

      if (Number.isNaN(isno) === false) {
        const subkeys = MessageStrategy.state.Chan.Subscribed[message.from]
        for (let h = 0; h < subkeys.length; h++) {
          if (h === isno) {
            toBeRemoved = subkeys[h]
            break
          }
        }
      }

      const index = MessageStrategy.state.Chan.Subscribed[message.from].indexOf(toBeRemoved)
      if (index !== -1) {
        MessageStrategy.state.Chan.Subscribed[message.from].splice(index, 1)
      }

      delete MessageStrategy.state.Chan.Notified[message.from][toBeRemoved]
      delete MessageStrategy.state.Chan.LastNotified[message.from][toBeRemoved]

      MessageStrategy.client.sendText(message.from, 'Un-subscribed')
    } catch (err) {
      MessageStrategy.client.sendText(message.from, 'No such subscription')
    }
  }

  async GetSiteMaps (message, urlstr) {
    const url = new URL(urlstr)
    const robotstxt = await MessageStrategy.axiosHttpRequest(message, 'GET', url.protocol + '//' + url.hostname + '/robots.txt', false, 200, false)
    const regex1 = /Sitemap: .*/g
    let array1
    const resshort = []
    const resfull = []

    while ((array1 = regex1.exec(robotstxt)) !== null) {
      const entry = array1[0].substring(9)
      const index = entry.indexOf('/', 9)
      resshort.push(entry.substring(index))
      resfull.push(entry)
    }

    return [resshort, resfull]
  }

  async GetLocsFromXML (message, url) {
    const urls = []
    try {
      const xml = await MessageStrategy.axiosHttpRequest(message, 'GET', url, false, 200, false)
      // eslint-disable-next-line no-undef
      let json = x2j.toJson(xml)
      json = JSON.parse(json)

      if (Object.prototype.hasOwnProperty.call(json, 'urlset')) {
        for (let i = 0; i < json.urlset.url.length; i++) {
          urls.push(json.urlset.url[i].loc)
        }
      }

      if (Object.prototype.hasOwnProperty.call(json, 'rss')) {
        for (let i = 0; i < json.rss.channel.item.length; i++) {
          const item = json.rss.channel.item[i]
          urls.push(item.link)
        }
      }
    } catch (err) {
      console.log(err)
    }

    return urls
  }

  async Subscribe (message) {
    try {
      const parts = message.body.trim().split(' ')

      if (Chan.self.validURL(parts[2]) === false) {
        MessageStrategy.client.sendText(message.from, 'Not a valid subscription url')
        return
      }

      const sitemaps = await Chan.self.GetSiteMaps(message, parts[2])

      if (sitemaps[0].length === 0) {
        MessageStrategy.client.sendText(message.from, 'No sitemaps or robots.txt found.')
        return
      }

      if (sitemaps[0].length > 1 && parts.length === 3) {
        MessageStrategy.client.sendText(message.from, 'More than 1 sitemap found, please specify which one, e.g:\n\nChan subscribe http://x.com/ 1\n\n')
        let msg = ''
        for (let h = 0; h < sitemaps[0].length; h++) {
          msg += h + ' ' + sitemaps[0][h] + '\n'
        }
        MessageStrategy.client.sendText(message.from, msg)
        return
      }

      const index = (parts.length === 3) ? 0 : parseInt(parts[3])

      const urls = await Chan.self.GetLocsFromXML(message, sitemaps[1][index])

      if (urls.length === 0) {
        MessageStrategy.client.sendText(message.from, 'Not a valid subscription url')
        return
      }

      if (Object.keys(MessageStrategy.state).indexOf('Chan') === -1) {
        MessageStrategy.state.Chan = {}
      }

      if (Object.keys(MessageStrategy.state.Chan).indexOf('enabled') === -1) {
        MessageStrategy.state.Chan.enabled = true
      }

      if (Object.keys(MessageStrategy.state.Chan).indexOf('Subscribed') === -1) {
        MessageStrategy.state.Chan.Subscribed = {}
      }

      if (Object.keys(MessageStrategy.state.Chan).indexOf('Notified') === -1) {
        MessageStrategy.state.Chan.Notified = {}
      }

      if (Object.keys(MessageStrategy.state.Chan).indexOf('LastNotified') === -1) {
        MessageStrategy.state.Chan.LastNotified = {}
      }

      if (Object.keys(MessageStrategy.state.Chan.Subscribed).indexOf(message.from) === -1) {
        MessageStrategy.state.Chan.Subscribed[message.from] = []
      }

      if (MessageStrategy.state.Chan.Subscribed[message.from].indexOf(sitemaps[1][index]) === -1) {
        MessageStrategy.state.Chan.Subscribed[message.from].push(sitemaps[1][index])
      } else {
        MessageStrategy.client.sendText(message.from, 'Already subscribed')
        return
      }

      if (Object.keys(MessageStrategy.state.Chan.Notified).indexOf(message.from) === -1) {
        MessageStrategy.state.Chan.Notified[message.from] = {}
      }

      if (Object.keys(MessageStrategy.state.Chan.Notified[message.from]).indexOf(sitemaps[1][index]) === -1) {
        MessageStrategy.state.Chan.Notified[message.from][sitemaps[1][index]] = []
      }

      if (Object.keys(MessageStrategy.state.Chan.LastNotified).indexOf(message.from) === -1) {
        MessageStrategy.state.Chan.LastNotified[message.from] = {}
      }

      if (Object.keys(MessageStrategy.state.Chan.LastNotified[message.from]).indexOf(sitemaps[1][index]) === -1) {
        MessageStrategy.state.Chan.LastNotified[message.from][sitemaps[1][index]] = 0
      }

      MessageStrategy.state.Chan.Queue = {}

      for (let i = 0; i < urls.length; i++) {
        MessageStrategy.state.Chan.Notified[message.from][sitemaps[1][index]].push(urls[i])
      }

      MessageStrategy.client.sendText(message.from, 'Subscribed')
      Chan.self.Post(message)
    } catch (err) {
      console.log(err)
    }
  }

  async Post (message) {
    if (Object.keys(MessageStrategy.state).indexOf('Chan') === -1) {
      return
    }

    if (Object.keys(MessageStrategy.state.Chan).indexOf('Subscribed') === -1) {
      return
    }

    await Chan.self.processChats(message)
    await Chan.self.processQueue()
  }

  async processChats (message) {
    const chats = Object.keys(MessageStrategy.state.Chan.Subscribed)

    for (let c = 0; c < chats.length; c++) {
      const subscriptions = MessageStrategy.state.Chan.Subscribed[chats[c]]
      for (let s = 0; s < subscriptions.length; s++) {
        if (MessageStrategy.state.Chan.LastNotified[chats[c]][subscriptions[s]] > Math.floor(Date.now() / 1000)) {
          continue
        }

        await Chan.self.handleSubscription(message, chats[c], subscriptions[s])
      }
    }
  }

  async handleSubscription (message, chat, subscription) {
    const urls = await Chan.self.GetLocsFromXML(message, subscription)

    for (let i = 0; i < urls.length; i++) {
      await Chan.self.queuePost(chat, subscription, urls[i])
    }
  }

  async queuePost (chat, subscription, url) {
    if (MessageStrategy.state.Chan.Notified[chat][subscription].indexOf(url) === -1) {
      if (Object.keys(MessageStrategy.state.Chan).indexOf('Queue') === -1) {
        MessageStrategy.state.Chan.Queue = {}
      }
      MessageStrategy.state.Chan.Notified[chat][subscription].push(url)
      MessageStrategy.state.Chan.Queue[chat] = url
      MessageStrategy.state.Chan.LastNotified[chat][subscription] = (Math.floor(Date.now() / 1000)) + Chan.self.randomIntFromInterval()
    }
  }

  async processQueue () {
    if (Object.keys(MessageStrategy.state.Chan.Queue).length > 0) {
      const msgs = Object.keys(MessageStrategy.state.Chan.Queue)
      for (let c = 0; c < msgs.length; c++) {
        Chan.self.postPreview(msgs[c], MessageStrategy.state.Chan.Queue[msgs[c]])
      }
      MessageStrategy.state.Chan.Queue = {}
    }
  }

  async postPreview (chat, url) {
    const data = await Chan.self.get_page_og_data(Chan.self, url, 500)
    if (data[1] === null) return
    MessageStrategy.client.sendLinkWithAutoPreview(chat, url, data[0], data[1])
  }

  randomIntFromInterval (min = 10800, max = 28800) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = {
  MessageStrategy: Chan
}
