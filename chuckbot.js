const wa = require('@open-wa/wa-automate');
const worker = require("worker_threads");
const fs = require('fs');

let chuck = null;

let chuck_express = null;
let chuck_express_file = "./web.js";

let word_strategies_dict = null;
let message_strategies_file = "./strategies.js";

wa.create({
  sessionId: "chuck",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'IE_EN',
  logConsole: true,
  logConsoleErrors: true,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
  logging: [
		{
			"type": "console"
		}
	]
}).then(client => start(client));

fs.watch(message_strategies_file, (event, filename) => {
  if (filename) {
    update_strategies();
    update_web();
  }
});

fs.watch(chuck_express_file, (event, filename) => {
  if (filename) {
    update_strategies();
    update_web();
  }
});

function update_strategies() {
  delete require.cache[require.resolve(message_strategies_file)];
  Strategies = require(message_strategies_file);
  word_strategies_dict = Strategies.MessageStrategy.getStrategies(chuck);
  console.log("Chuck strategies reloaded!");
}

function update_web() {
  if(chuck_express != null) {
    chuck_express.stop();
    chuck_express = null;
  }
  
  delete require.cache[require.resolve(chuck_express_file)];
  Web = require(chuck_express_file);
  
  (async () => {
    try {
      chuck_express = new Web.Web(chuck, word_strategies_dict);
      chuck_express.launch();
      console.log("Chuck web reloaded!");
    } catch (err) {
      console.log(err);
    }
  })();
}

function start(client) {
  chuck = client;
  update_strategies();
  update_web();

  client.onMessage(async message => {
    try {
      let keys = Object.keys(word_strategies_dict);
      for(let y = 0; y < keys.length; y++) {
        if(word_strategies_dict[keys[y]].handleMessage(message, word_strategies_dict)) {
          return;
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  });
}