const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// tiktok previews 
// ####################################

class TikTok extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('TikTok', {
      'enabled': true,
      'user_defaults': {}
    });
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

  async postTiktokPreview(self, fullurl) {
    try {
      let data = await self.getPageOGData(self, fullurl, 500);

      if (data[1] == null) {
        self.client.reply(self.message.from, "Sorry no preview", self.message.id, true);
        return;
      }

      self.client.sendLinkWithAutoPreview(self.message.from, fullurl, data[0], data[1]);
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['TikTok']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/.*tiktok.com\/.*/))) {
      MessageStrategy.typing(this.message);
      this.postTiktokPreview(self, this.message.body);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: TikTok
}