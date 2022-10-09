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
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: HyperLink.self.HyperLink,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['HyperLink']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['HyperLink']['enabled'];
      }
    }
  }

  async HyperLink(message) {
    try {
      if (message.body.indexOf('tiktok') > -1) return;
      if (message.body.indexOf('yout') > -1) return;
      if (message.body.indexOf('facebook') > -1) return;
      if (message.body.indexOf('twitter') > -1) return;
      if (message.body.indexOf('amazon') > -1) return;

      if ("thumbnail" in message) {
        return;
      }

      let data = await HyperLink.self.getPageOGData(HyperLink.self, message.body, 500);

      if (data[1] == null) {
        MessageStrategy.client.reply(message.from, "Sorry no preview", message.id, true);
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
  MessageStrategy: HyperLink
}