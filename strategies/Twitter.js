const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// twitter previews 
// ####################################

class Twitter extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Twitter', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Detects twitter urls and provides thumbnail preview if not provided"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  async postTwitterPreview(self) {
    try {
      let data = await self.getPageOGData(self, self.message.body, 500);

      if (data[1] == null) {
        self.client.reply(self.message.from, "Sorry no preview", self.message.id, true);
        return;
      }

      self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, data[0], data[1]);
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Twitter']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.match(new RegExp(/^https:\/\/.*?twitter.com\/.*/))) {
      this.postTwitterPreview(self);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Twitter
}