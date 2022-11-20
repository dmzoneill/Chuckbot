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
        'pornhub x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('pornhub');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
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
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Pornhub']['enabled'];
      }
    }
  }

  async GetPornhubVideo(message) {
    try {
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
          const responseImage = await axios(porn['thumb'], { responseType: 'arraybuffer', headers: MessageStrategy.browser_config['headers'] });

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