const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Meme
// ####################################

class Meme extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Meme', {
      'enabled': true
    });
  }

  provides() {
    Meme.self = this;

    return {
      help: 'Gets a random meme',
      provides: {
        'meme': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'gets the meme and posts it to the chat';
          },
          action: Meme.self.GetMeme,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Meme']['enabled'];
      }
    }
  }

  async GetMeme(message) {
    try {
      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://google.com/',
          'Pragma': 'no-cache',
          'Referer': 'https://google.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      };

      MessageStrategy.typing(message);

      let topics = [
        'me_irl',
        'WackyTicTacs',
        'memes',
        'AdviceAnimals',
        'funny'
      ];
      let randomIndex = Math.floor(Math.random() * topics.length);

      var meme = request('GET', 'https://meme-api.herokuapp.com/gimme/' + topics[randomIndex], {
        headers: config.headers
      });
      let json = JSON.parse(meme.getBody());

      MessageStrategy.typing(message);

      const responseImage = await axios(json['url'], { responseType: 'arraybuffer', headers: config['headers'] });

      MessageStrategy.typing(message);

      const image = await resizeImg(responseImage.data, { width: 600, format: "jpg" });

      MessageStrategy.typing(message);

      const buffer64 = Buffer.from(image, 'binary').toString('base64');
      let data = "data:image/jpeg;base64," + buffer64;

      MessageStrategy.client.sendImage(message.from, data, "meme.jpg", json['postLink']);
      //self.client.sendLinkWithAutoPreview(self.message.from, json['postLink'], json['url'], data);
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: Meme
}