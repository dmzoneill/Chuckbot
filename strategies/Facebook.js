const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Facebook previews 
// ####################################

class Facebook extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Facebook'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects facebook urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async postFacebookPreview(self, config) {
    try {
      axios.get(this.message.body, config).then(async resp => {
        let url = null;
        let description = null;

        try {
          let data = resp.data;
          let re1 = /property="og:image" content="(.*?)"/i;
          let match1 = re1.exec(data);
          url = match1[1];

          let re2 = /property="og:description" content="(.*?)"/i;
          let match2 = re2.exec(data);
          description = match2[1];

          url = url.replace(/&amp;/g, "&");
          const responseImage = await axios(url, {
            responseType: 'arraybuffer', headers: {
              'authority': 'external-dub4-1.xx.fbcdn.net',
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
              'cache-control': 'no-cache',
              'dnt': '1',
              'pragma': 'no-cache',
              'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Linux"',
              'sec-fetch-dest': 'document',
              'sec-fetch-mode': 'navigate',
              'sec-fetch-site': 'cross-site',
              'sec-fetch-user': '?1',
              'upgrade-insecure-requests': '1',
              'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            }
          });
          const buf = Buffer.from(responseImage.data, 'binary');
          const image = await resizeImg(buf, { width: 300, height: 300, format: "jpg" });
          const buffer64 = image.toString('base64');
          let image64 = "data:image/jpeg;base64," + buffer64;
          self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, description, image64);
        }
        catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Facebook']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/.*?facebook.com\/.*/))) {
      var config = {
        headers: {
          'authority': 'm.facebook.com',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          'cookie': 'datr=-YEjY7upDspuvniqjRLjJ0Dc; sb=CmkpY4pyIKCHo6MwLCzSfVzx; m_pixel_ratio=1; wd=1550x1563',
          'dnt': '1',
          'pragma': 'no-cache',
          'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      }

      this.postFacebookPreview(self, config);

      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Facebook
}