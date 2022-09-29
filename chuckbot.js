const wa = require('@open-wa/wa-automate');
const fs = require('fs');

class ChuckBot {
  static source_dir = "./";
  static chuck = null;
  static Strategies = null;
  static chuck_express = null;
  static message_strategy_file = "./MessageStrategy.js";
  static web_file = "./web.js";

  constructor() {
    fs.watch(ChuckBot.source_dir, (event, filename) => {
      if (filename == ChuckBot.message_strategy_file.substring(2) || filename == ChuckBot.web_file.substring(2)) {
        ChuckBot.update_strategies();
        ChuckBot.update_web();
      }
    });

    wa.create({
      sessionId: "chuck",
      multiDevice: true,
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'IE_EN',
      logConsole: true,
      logConsoleErrors: true,
      popup: true,
      qrTimeout: 0,
      logging: [
        {
          "type": "console"
        }
      ]
    }).then(client => ChuckBot.start(client));
  }

  static start(client) {
    ChuckBot.chuck = client;
    ChuckBot.update_strategies();
    ChuckBot.update_web();

    client.onMessage(async message => {
      ChuckBot.Strategies.doHandleMessage(ChuckBot.chuck, message);
    });
  }

  static async update_strategies() {
    delete require.cache[require.resolve(ChuckBot.message_strategy_file)];
    ChuckBot.Strategies = require(ChuckBot.message_strategy_file);
    ChuckBot.Strategies.getStrategies(ChuckBot.chuck);
  }

  static async update_web() {
    await new Promise(r => setTimeout(r, 1000));

    if (ChuckBot.chuck_express != null) {
      ChuckBot.chuck_express.stop();
      ChuckBot.chuck_express = null;
    }

    await new Promise(r => setTimeout(r, 1000));

    delete require.cache[require.resolve(ChuckBot.web_file)];
    let Web = require(ChuckBot.web_file);

    (async () => {
      try {
        ChuckBot.chuck_express = new Web.Web(ChuckBot.Strategies);
        ChuckBot.chuck_express.launch(ChuckBot.Strategies);
      } catch (err) {
        console.log(err);
      }
    })();
  }
}

new ChuckBot();