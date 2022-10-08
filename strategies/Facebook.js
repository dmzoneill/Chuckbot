const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Facebook previews 
// ####################################

class Facebook extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Facebook', {
      'enabled': true
    });
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

  async postFacebookPreview(self, fullurl) {
    try {
      if(self.message.thumbnail != "") return;
      
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
    if (MessageStrategy.state['Facebook']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/.*?facebook.com\/.*/))) {
      this.postFacebookPreview(self, message.body.replace(/&amp;/g, "&"));
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Facebook
}