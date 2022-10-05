const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// hyperlink previews 
// ####################################

class HyperLink extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('HyperLink', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async postHyperlinkPreview(self, fullurl) {
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
    if (MessageStrategy.state['HyperLink']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.match(new RegExp(/^(http|https):\/\/.*/))) {

      if (this.message.body.indexOf('tiktok') > -1) return;
      if (this.message.body.indexOf('yout') > -1) return;
      if (this.message.body.indexOf('facebook') > -1) return;
      if (this.message.body.indexOf('twitter') > -1) return;
      if (this.message.body.indexOf('amazon') > -1) return;

      if ("thumbnail" in this.message) {
        return;
      }

      this.postHyperlinkPreview(this, this.message.body);

      return true;
    }
    
    return false;
  }
}


module.exports = {
  MessageStrategy: HyperLink
}