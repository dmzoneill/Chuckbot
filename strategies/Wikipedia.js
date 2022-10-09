const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Wikipedia', {
      'enabled': true
    });
  }

  provides() {
    Wikipedia.self = this;

    return {
      help: 'Provides search and todays topics for wikipedia',
      provides: {
        'wiki today': {
          test: function (message) {
            return message.body.toLowerCase() == 'wiki today';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Show wikipedia pages for this day';
          },
          action: function OnThisDay(message) {
            Wikipedia.self.OnThisDay(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Wikipedia']['enabled'];
          }
        },
        'wiki .*': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('wiki');
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Search wikipedia';
          },
          action: function Search(message) {
            Wikipedia.self.Search(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Wikipedia']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Wikipedia']['enabled'];
      }
    }
  }

  async postWikiPreview(fullurl) {
    try {
      let data = await Wikipedia.self.getPageOGData(Wikipedia.self, fullurl, 500);

      if (data[1] == null) {
        MessageStrategy.client.reply(Wikipedia.self.message.from, "Sorry no preview", Wikipedia.self.message.id, true);
        return;
      }

      MessageStrategy.client.sendLinkWithAutoPreview(Wikipedia.self.message.from, fullurl, data[0], data[1]);
    }
    catch (err) {
      console.log(err);
    }
  }

  async OnThisDay(message) {
    try {
      const events = await wiki.onThisDay();
      const deaths = await wiki.onThisDay({ type: 'deaths' });
      Wikipedia.self.postWikiPreview(events['selected'][0]['pages'][0]['content_urls']['mobile']['page']);
      await Wikipedia.self.waitFor(1000);
      Wikipedia.self.postWikiPreview(deaths['deaths'][0]['pages'][0]['content_urls']['mobile']['page']);
    } catch (error) {
      console.log(error);
    }
  }

  async Search(message) {
    try {
      const page = await wiki.page(message.body.substring(4));
      if (Object.keys(page).includes('fullurl')) {
        Wikipedia.self.postWikiPreview(page['fullurl']);
      }
    } catch (error) {
      MessageStrategy.typing(message);
      MessageStrategy.client.sendText(message.from, "Ya i have no idea");
      console.log(error);
    }
  }
}


module.exports = {
  MessageStrategy: Wikipedia
}