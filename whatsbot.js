const wa = require('@open-wa/wa-automate');
const fs = require('fs');

let chuck = null;
let word_strategies_dict = null;
let message_strategies_file = "./strategies.js";

wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'IE_EN',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

fs.watch(message_strategies_file, (event, filename) => {
  if (filename) {
    update_strategies();
  }
});

function update_strategies() {
  delete require.cache[require.resolve(message_strategies_file)];
  Strategies = require(message_strategies_file);
  word_strategies_dict = Strategies.MessageStrategy.getStrategies(chuck);
}

function start(client) {
  chuck = client;
  update_strategies();

  client.onMessage(async message => {
    if(message.body.toLowerCase() === "reload") {
      update_strategies();
    }

    if(message.body.toLowerCase() === "help") {
      help = "";
      Object.keys(word_strategies_dict).forEach(key => {
        word_strategies_dict[key].provides().forEach(term => {
          help += term + "\n"
        })        
      });
      help += "help\n"
      client.sendText(message.from, help);
    }

    Object.keys(word_strategies_dict).forEach(key => {
      if(word_strategies_dict[key].handleMessage(message)) {
        return;
      }
    });
  });
}