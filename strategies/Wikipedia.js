const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Wikipedia', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Search wikipedia for a given string and provides a link to the page"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['wiki (.*)', 'wiki today']
  }

  async postWikiPreview(self, fullurl) {
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

  async wikiOnThisDay(self) {
    try {
      const events = await wiki.onThisDay();
      const deaths = await wiki.onThisDay({ type: 'deaths' });
      self.postWikiPreview(self, events['selected'][0]['pages'][0]['content_urls']['mobile']['page']);
      await self.waitFor(2000);
      self.postWikiPreview(self, deaths['deaths'][0]['pages'][0]['content_urls']['mobile']['page']);
    } catch (error) {
      console.log(error);
    }
  }

  async wikiSearch(self) {
    try {
      const page = await wiki.page(self.message.body.substring(4));
      if (Object.keys(page).includes('fullurl')) {
        self.postWikiPreview(self, page['fullurl']);
      }
    } catch (error) {
      MessageStrategy.typing(self.message);
      MessageStrategy.client.sendText(self.message.from, "Ya i have no idea");
      console.log(error);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['Wikipedia']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (message.body.toLowerCase() == 'wiki today') {
      MessageStrategy.typing(self.message);
      this.wikiOnThisDay(self);
      return true;
    }

    if (message.body.toLowerCase().startsWith('wiki')) {
      MessageStrategy.typing(self.message);
      this.wikiSearch(self);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Wikipedia
}