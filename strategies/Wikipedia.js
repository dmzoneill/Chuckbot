const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Wikipedia', {
      enabled: true
    })
  }

  provides () {
    Wikipedia.self = this

    return {
      help: 'Provides search and todays topics for wikipedia',
      provides: {
        'wiki today': {
          test: function (message) {
            return message.body.toLowerCase() === 'wiki today'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show wikipedia pages for this day'
          },
          action: Wikipedia.self.OnThisDay,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        'wiki enable': {
          test: function (message) {
            return message.body.toLowerCase() === 'wiki enable'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Enables random wikipedia articles'
          },
          action: Wikipedia.self.Enable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        'wiki disable': {
          test: function (message) {
            return message.body.toLowerCase() === 'wiki disable'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Disables random wikipedia articles'
          },
          action: Wikipedia.self.Disable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        'wiki state': {
          test: function (message) {
            return message.body.toLowerCase() == 'wiki state'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'show the state'
          },
          action: Wikipedia.self.State,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        'wiki clear': {
          test: function (message) {
            return message.body.toLowerCase() == 'wiki clear'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'clear the state'
          },
          action: Wikipedia.self.Clear,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        'wiki x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('wiki')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Search wikipedia'
          },
          action: Wikipedia.self.Search,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        },
        '*': {
          test: function (message) {
            return true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Post wikipedia article randomly'
          },
          action: function (message) {
            Wikipedia.self.RandomlyOnThisDay(message)
            return false
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Wikipedia.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Wikipedia.enabled
      }
    }
  }

  async Setup (message) {
    try {
      if (Object.keys(MessageStrategy.state).indexOf('Wikipedia') == -1) {
        MessageStrategy.state.Wikipedia = {}
      }

      if (Object.keys(MessageStrategy.state.Wikipedia).indexOf('LastNotified') == -1) {
        MessageStrategy.state.Wikipedia.LastNotified = {}
      }

      if (Object.keys(MessageStrategy.state.Wikipedia.LastNotified).indexOf(message.from) == -1) {
        MessageStrategy.state.Wikipedia.LastNotified[message.from] = 0
      }

      if (Object.keys(MessageStrategy.state.Wikipedia).indexOf('Chats') == -1) {
        MessageStrategy.state.Wikipedia.Chats = {}
      }

      if (Object.keys(MessageStrategy.state.Wikipedia.Chats).indexOf(message.from) == -1) {
        MessageStrategy.state.Wikipedia.Chats[message.from] = false
      }
    } catch (err) {
      console.log(err)
    }
  }

  async Post (fullurl) {
    try {
      const data = await Wikipedia.self.get_page_og_data(Wikipedia.self, fullurl, 500)

      if (data[1] === null) {
        // MessageStrategy.client.reply(Wikipedia.self.message.from, 'Sorry no preview', Wikipedia.self.message.id, true)
        return
      }

      // MessageStrategy.client.sendLinkWithAutoPreview(Wikipedia.self.message.from, fullurl, data[0], data[1])
      await MessageStrategy.client.sendImage(Wikipedia.self.message.from, data[1], 'meme.jpg', data[0] + '\n\n' + fullurl)
    } catch (err) {
      console.log(err)
    }
  }

  async OnThisDay (message) {
    try {
      await Wikipedia.self.Setup(message)
      const events = await wiki.onThisDay()
      const deaths = await wiki.onThisDay({ type: 'deaths' })
      Wikipedia.self.Post(events.selected[0].pages[0].content_urls.mobile.page)
      await Wikipedia.self.waitFor(1000)
      Wikipedia.self.Post(deaths.deaths[0].pages[0].content_urls.mobile.page)
    } catch (error) {
      console.log(error)
    }
  }

  async Clear (message) {
    try {
      delete MessageStrategy.state.Wikipedia
      await Wikipedia.self.Setup(message)
      console.log(MessageStrategy.state.Wikipedia)
    } catch (error) {
      console.log(error)
    }
  }

  async State (message) {
    try {
      await Wikipedia.self.Setup(message)
      console.log(MessageStrategy.state.Wikipedia)
    } catch (error) {
      console.log(error)
    }
  }

  async Enable (message) {
    try {
      await Wikipedia.self.Setup(message)
      MessageStrategy.state.Wikipedia.Chats[message.from] = true
      MessageStrategy.client.sendText(message.from, 'Enabled')
    } catch (error) {
      console.log(error)
    }
  }

  async Disable (message) {
    try {
      await Wikipedia.self.Setup(message)
      MessageStrategy.state.Wikipedia.Chats[message.from] = false
      MessageStrategy.client.sendText(message.from, 'Disabled')
    } catch (error) {
      console.log(error)
    }
  }

  async RandomlyOnThisDay (message) {
    try {
      await Wikipedia.self.Setup(message)

      if (MessageStrategy.state.Wikipedia.Chats[message.from] == false) {
        return
      }

      if ((Date.now() / 1000) > MessageStrategy.state.Wikipedia.LastNotified[message.from]) {
        MessageStrategy.state.Wikipedia.LastNotified[message.from] = (Math.floor(Date.now() / 1000)) + await Wikipedia.self.randomIntFromInterval(259200, 432000)
        Wikipedia.self.OnThisDay(message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async Search (message) {
    try {
      const page = await wiki.page(message.body.substring(4))
      if (Object.keys(page).includes('fullurl')) {
        Wikipedia.self.Post(page.fullurl)
      }
    } catch (error) {
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, 'Ya i have no idea')
      console.log(error)
    }
  }
}

module.exports = {
  MessageStrategy: Wikipedia
}
