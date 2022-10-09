const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Pornhub
// ####################################

class Pornhub extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Pornhub', {
      'enabled': true
    });
  }

  provides() {
    Pornhub.self = this;

    return {
      help: 'Gets a random Pornhub video',
      provides: {
        'Pornhub': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('pornhub');
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Gets a video given a search term';
          },
          action: Pornhub.self.GetPornhubVideo,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Pornhub']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Pornhub']['enabled'];
      }
    }
  }

  async GetPornhubVideo(message) {
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


      let search = message.body.substring(7).trim();

      let dodgey = [
        "\\", "\"", "'", ";", ">", "<", "$", "&", "`",
        "!", "@", "(", ")", "|",
        "/", ",", ".", "?", "~", "{", "}", "[", "]"
      ];

      for (let c = 0; c < dodgey.length; c++) {
        search.replace(dodgey[c], "");
      }


      exec("python3 strategies/scripts/pornhub.py \"" + search + "\"", async (error, stdout, stderr) => {
        try {
          console.log(stdout);
          let porn = JSON.parse(stdout);
          console.log(stdout);

          MessageStrategy.typing(message);
          const responseImage = await axios(porn['thumb'], { responseType: 'arraybuffer', headers: config['headers'] });

          MessageStrategy.typing(message);

          const image = await resizeImg(responseImage.data, { width: 400, format: "jpg" });

          MessageStrategy.typing(message);

          const buffer64 = Buffer.from(image, 'binary').toString('base64');
          let data = "data:image/jpeg;base64," + buffer64;

          MessageStrategy.client.sendImage(message.from, data, "meme.jpg", porn['title'] + "\n" + porn['url']);
          //self.client.sendLinkWithAutoPreview(self.message.from, porn['url'], json['url'], data);
        }
        catch (err) {
          console.log(err);
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: Pornhub
}