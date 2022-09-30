const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// tiktok previews 
// ####################################

class TikTok extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['TikTok'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects tiktok urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async postTiktokPreview(self, config) {
    try {
      axios.get(self.message.body, config).then(async resp => {

        let data = resp.data;
        let re1 = /property="twitter:image" content="(.*?)"/i;
        let match1 = re1.exec(data);

        let re2 = /property="twitter:description" content="(.*?)"/i;
        let match2 = re2.exec(data);

        const responseImage = await axios(match1[1], { responseType: 'arraybuffer', headers: config['headers'] });
        const buffer64 = Buffer.from(responseImage.data, 'binary').toString('base64')

        data = "data:image/jpeg;base64," + buffer64;
        self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, match2[1], data);
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['TikTok']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/vm.tiktok.com\/.*/))) {
      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://www.tiktok.com',
          'Pragma': 'no-cache',
          'Referer': 'https://www.tiktok.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      }

      this.postTiktokPreview(self, config);

      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: TikTok
}