const wa = require('@open-wa/wa-automate')
const fs = require('fs')


class ChuckBot {
  static source_dir = './'
  static chuck = null
  static Strategies = null
  static message_strategy_file = './MessageStrategy.js'
  static last_update = new Date(0)

  constructor () {
    fs.watch(ChuckBot.source_dir, (event, filename) => {
      if (filename == ChuckBot.message_strategy_file.substring(2)) {
        if (ChuckBot.last_update.valueOf() == Date.now()) {
          return
        }
        ChuckBot.update_strategies()
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
    ChuckBot.Strategies.chuckclient = ChuckBot.chuck
    ChuckBot.Strategies.update_strategies()
  }
}

new ChuckBot()
