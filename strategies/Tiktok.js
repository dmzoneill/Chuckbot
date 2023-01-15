const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// tiktok previews 
// ####################################

class TikTok extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('TikTok', {
      'enabled': true,
      'user_defaults': {}
    });
  }

  provides() {
    TikTok.self = this;

    return {
      help: 'Detects tiktok urls and provides thumbnail preview if not provided',
      provides: {
        'TikTok': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*tiktok.com\/.*/));
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Gets the TikTok for a given url';
          },
          action: function PostPreview(message) {
            TikTok.self.PostPreview(message);
            return true;
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['TikTok']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['TikTok']['enabled'];
      }
    }
  }

  async PostPreview(message) {
    try {
      let data = await TikTok.self.get_page_og_data(TikTok.self, message.body, 500);

      if (data[1] == null) {
        // MessageStrategy.client.reply(message.from, "Sorry no preview", message.id, true);
        return;
      }

      MessageStrategy.client.sendLinkWithAutoPreview(message.from, message.body, data[0], data[1]);
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: TikTok
}