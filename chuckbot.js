const wa = require('@open-wa/wa-automate')
const fs = require('fs')


class ChuckBot {
  static source_dir = './'
  static chuck = null
  static Strategies = null
  static chuck_express = null
  static message_strategy_file = './MessageStrategy.js'
  static web_file = './web.js'
  static last_update = new Date(0)

  constructor () {
    fs.watch(ChuckBot.source_dir, (event, filename) => {
      if (filename == ChuckBot.message_strategy_file.substring(2) || filename == ChuckBot.web_file.substring(2)) {
        if (ChuckBot.last_update.valueOf() == Date.now()) {
          return
        }
        ChuckBot.update_strategies()
        ChuckBot.update_web()
        ChuckBot.last_update = Date.now()
      }
    })

    wa.create({
      sessionId: 'chuck',
      multiDevice: true,
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'IE_EN',
      logConsole: true,
      logConsoleErrors: true,
      popup: false,
      useChrome: true,
      qrTimeout: 0,
      logging: [
        {
          type: 'console'
        }
      ]
    }).then(client => ChuckBot.start(client))
  }

  static start (client) {
    ChuckBot.chuck = client
    ChuckBot.update_strategies()
    ChuckBot.update_web()

    const event_message = {
      id: 'chuck',
      from: 'chuck',
      sender: {
        id: 'chuck'
      },
      isChuck: true,
      body: 'event',
      event_type: null,
      event: null
    }

    client.onMessage(async message => {
      ChuckBot.Strategies.doHandleMessage(message)
    })

    client.onGlobalParticipantsChanged(async event => {
      const message = event_message
      message.event_type = 'onParticipantsChanged'
      message.event = event
      ChuckBot.Strategies.doHandleMessage(message)
    })

    client.onAck(async event => {
      const message = event_message
      message.event_type = 'onAck'
      message.event = event
      ChuckBot.Strategies.doHandleMessage(message)
    })

    client.onAddedToGroup(async event => {
      const message = event_message
      message.event_type = 'onAddedToGroup'
      message.event = event
      ChuckBot.Strategies.doHandleMessage(message)
    })

    client.onMessageDeleted(async event => {
      const message = event_message
      message.event_type = 'onMessageDeleted'
      message.event = event
      ChuckBot.Strategies.doHandleMessage(message)
    })
  }

  static async update_strategies () {
    delete require.cache[require.resolve(ChuckBot.message_strategy_file)]
    ChuckBot.Strategies = require(ChuckBot.message_strategy_file)
    ChuckBot.Strategies.client.client = ChuckBot.chuck
    ChuckBot.Strategies.update_strategies()
  }

  static async update_web () {
    try {
      await new Promise(r => setTimeout(r, 1000))

      if (ChuckBot.chuck_express != null) {
        ChuckBot.chuck_express.stop()
        await new Promise(r => setTimeout(r, 1000))
        ChuckBot.chuck_express = null
      }

      delete require.cache[require.resolve(ChuckBot.web_file)]
      const Web = require(ChuckBot.web_file)

      ChuckBot.chuck_express = new Web.Web(ChuckBot.Strategies)
      ChuckBot.chuck_express.launch(ChuckBot.Strategies)
    } catch (err) {
      console.log(err)
    }
  }
}

new ChuckBot()
