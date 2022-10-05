const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Pornhub
// ####################################

class Pornhub extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Pornhub', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Gets a random Pornhub video"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Pornhub']
  }

  async getPornhub(self) {
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

      MessageStrategy.typing(self.message);


      let search = self.message.body.substring(7).trim();

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

          MessageStrategy.typing(self.message);
          const responseImage = await axios(porn['thumb'], { responseType: 'arraybuffer', headers: config['headers'] });

          MessageStrategy.typing(self.message);

          const image = await resizeImg(responseImage.data, { width: 400, format: "jpg" });

          MessageStrategy.typing(self.message);

          const buffer64 = Buffer.from(image, 'binary').toString('base64');
          let data = "data:image/jpeg;base64," + buffer64;

          self.client.sendImage(self.message.from, data, "meme.jpg", porn['title'] + "\n" + porn['url']);
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

  handleMessage(message) {
    if (MessageStrategy.state['Pornhub']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith('pornhub')) {
      MessageStrategy.typing(this.message);
      this.getPornhub(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Pornhub
}