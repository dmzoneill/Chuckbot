const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Meme
// ####################################

class Meme extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Meme', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Gets a random meme"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Meme']
  }

  async getMeme(self) {
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

      var meme = request('GET', 'https://meme-api.herokuapp.com/gimme/me_irl', {
        headers: config.headers
      });
      let json = JSON.parse(meme.getBody());

      MessageStrategy.typing(self.message);

      const responseImage = await axios(json['url'], { responseType: 'arraybuffer', headers: config['headers'] });

      MessageStrategy.typing(self.message);

      const image = await resizeImg(responseImage.data, { width: 400, format: "jpg" });

      MessageStrategy.typing(self.message);

      const buffer64 = Buffer.from(image, 'binary').toString('base64');
      let data = "data:image/jpeg;base64," + buffer64;

      self.client.sendImage(self.message.from, data, "meme.jpg", json['postLink']);
      //self.client.sendLinkWithAutoPreview(self.message.from, json['postLink'], json['url'], data);
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Meme']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'meme') {
      MessageStrategy.typing(this.message);
      this.getMeme(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Meme
}