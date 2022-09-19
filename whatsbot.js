const wa = require('@open-wa/wa-automate');

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

function get_strategies(client) {
  delete require.cache[require.resolve('./strategies.js')];
  Strategies = require('./strategies.js');

  return {
    chuck: new Strategies.ChuckJokes(client),
    yoga: new Strategies.Asthanga(client),
    youtube: new Strategies.Youtube(client),
    tiktok: new Strategies.TikTok(client),
    hyperlink: new Strategies.HyperLink(client),
    currency: new Strategies.Currency(client),
    crypto: new Strategies.Crypto(client),
    imdb: new Strategies.Imdb(client),
    google: new Strategies.Google(client),
    wiki: new Strategies.Wikipedia(client),
    weather: new Strategies.Weather(client),
    urban: new Strategies.UrbanDictionary(client),
    hi: new Strategies.Hi(client)
  }
}

function start(client) {
  let word_strategies_dict = get_strategies(client);

  client.onMessage(async message => {
    if(message.body.toLowerCase() === "reload") {
      word_strategies_dict = get_strategies(client);
    }

    Object.keys(word_strategies_dict).forEach(key => {
      if(word_strategies_dict[key].handleMessage(message)) {
        return;
      }
    });
  });
}