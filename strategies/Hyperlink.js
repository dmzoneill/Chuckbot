const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// hyperlink previews 
// ####################################

class HyperLink extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('HyperLink', {
      'enabled': true
    });
  }

  provides() {
    HyperLink.self = this;

    return {
      help: 'Detects urls and provides thumbnail preview if not provided',
      provides: {
        'Hyperlink': {
          test: function (message) {
            return message.body.match(new RegExp(/^(http|https):\/\/.*/));
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: function Preview(message) {
            HyperLink.self.Preview(message);
            return false;
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['HyperLink']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['HyperLink']['enabled'];
      }
    }
  }

  async Preview(message) {
    try {
      if (message.body.indexOf('tiktok') > -1) return;
      if (message.body.indexOf('yout') > -1) return;
      if (message.body.indexOf('facebook') > -1) return;
      if (message.body.indexOf('twitter') > -1) return;
      if (message.body.indexOf('amazon') > -1) return;

      if ("thumbnail" in message) {
        return false;
      }

      let data = await HyperLink.self.get_page_og_data(HyperLink.self, message.body, 500);

      if (data[1] == null) {
        MessageStrategy.client.reply(message.from, "Sorry no preview", message.id, true);
        return false;
      }

      MessageStrategy.client.sendLinkWithAutoPreview(message.from, message.body, data[0], data[1]);
      return true
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: HyperLink
}